// Independently authored image-to-stereo browser application.
// Depth model and Transformers runtime are third-party projects.
const $ = id => document.getElementById(id);
const MODEL = 'onnx-community/depth-anything-v2-small';
const CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6/+esm';
let estimatorPromise, image=null, depth=null, originalFile=null, busy=false;
let animatedBlob=null, animatedUrl=null;
const status = message => { $('status').textContent=message; };
const pause = () => new Promise(resolve => requestAnimationFrame(()=>setTimeout(resolve,0)));
const fileImage = file => new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{URL.revokeObjectURL(url);resolve(im)};
  im.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Could not decode image'))};
  im.src=url;
});
const raster = (img,w,h) => {
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(img,0,0,w,h);
  return ctx.getImageData(0,0,w,h);
};
const dimensions = img => {const w=Math.min(900,img.naturalWidth);return [w,Math.max(1,Math.round(img.naturalHeight*w/img.naturalWidth))]};
async function getEstimator(){
  if(!estimatorPromise)estimatorPromise=(async()=>{
    status('Loading browser AI library…');const {pipeline}=await import(CDN);
    const progress_callback=info=>{if(info.status==='progress'&&Number.isFinite(info.progress))status('Downloading Depth Anything V2… '+Math.round(info.progress)+'%')};
    if('gpu' in navigator){
      try{return await pipeline('depth-estimation',MODEL,{device:'webgpu',dtype:'q4f16',progress_callback})}
      catch(error){console.warn('WebGPU unavailable; trying CPU',error)}
    }
    status('Starting Depth Anything V2 on browser CPU…');
    return pipeline('depth-estimation',MODEL,{progress_callback});
  })().catch(error=>{estimatorPromise=null;throw error});
  return estimatorPromise;
}
async function inferDepth(file,w,h){
  const estimator=await getEstimator();
  status('Estimating AI depth from photograph…');
  const url=URL.createObjectURL(file);
  try{
    const result=await estimator(url),raw=result?.depth;
    if(!raw?.width||!raw?.height||!raw?.data)throw Error('AI model returned no depth image');
    const c=document.createElement('canvas');c.width=raw.width;c.height=raw.height;
    const ctx=c.getContext('2d'),pixels=ctx.createImageData(raw.width,raw.height),n=raw.width*raw.height;
    for(let i=0;i<n;i++){
      const value=raw.data.length===n?raw.data[i]:raw.data.length===n*3?raw.data[3*i]:raw.data[4*i];
      const j=i*4;pixels.data[j]=pixels.data[j+1]=pixels.data[j+2]=value;pixels.data[j+3]=255;
    }
    ctx.putImageData(pixels,0,0);
    const scaled=raster(c,w,h).data,output=new Float32Array(w*h);
    for(let i=0;i<output.length;i++)output[i]=scaled[i*4]/255;
    return output;
  }finally{URL.revokeObjectURL(url)}
}
async function importedDepth(file,w,h){
  const img=await fileImage(file),rgba=raster(img,w,h).data,out=new Float32Array(w*h);
  for(let i=0;i<out.length;i++)out[i]=(rgba[i*4]+rgba[i*4+1]+rgba[i*4+2])/765;
  return out;
}
function view(source,z,w,h,offset,plane){
  const n=w*h,out=new Uint8ClampedArray(n*4),nearest=new Float32Array(n),coverage=new Uint8Array(n);
  nearest.fill(-Infinity);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=y*w+x,tx=Math.round(x+(z[i]-plane)*offset);
    if(tx>=0&&tx<w){const j=y*w+tx;if(z[i]>nearest[j])nearest[j]=z[i]}
  }
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=y*w+x,tx=Math.round(x+(z[i]-plane)*offset);
    if(tx<0||tx>=w)continue;
    const j=y*w+tx;
    if(!coverage[j]&&z[i]>=nearest[j]-1e-6){out.set(source.subarray(i*4,i*4+4),j*4);coverage[j]=1}
  }
  const holes=coverage.map(v=>v?0:1);
  for(let y=0;y<h;y++){
    let first=-1;for(let x=0;x<w;x++)if(coverage[y*w+x]){first=x;break}
    if(first<0)continue;
    let previous=first;
    for(let x=0;x<first;x++)out.set(out.subarray(4*(y*w+first),4*(y*w+first)+4),4*(y*w+x));
    for(let x=first+1;x<w;x++){
      if(coverage[y*w+x]){previous=x;continue}
      let next=x;while(next<w&&!coverage[y*w+next])next++;
      const chosen=next<w&&next-x<x-previous?next:previous;
      out.set(out.subarray(4*(y*w+chosen),4*(y*w+chosen)+4),4*(y*w+x));
    }
  }
  return {data:out,holes};
}
function combine(l,r,w,h,mode){
  const n=w*h;
  if(mode==='left'||mode==='right')return {data:mode==='left'?l.data:r.data,w,h};
  if(mode==='mask'){
    const out=new Uint8ClampedArray(n*4);
    for(let i=0;i<n;i++){const j=4*i;out[j]=l.holes[i]*255;out[j+1]=r.holes[i]*255;out[j+3]=255}
    return {data:out,w,h};
  }
  if(mode==='parallel'||mode==='cross'){
    const out=new Uint8ClampedArray(n*8),a=mode==='parallel'?l.data:r.data,b=mode==='parallel'?r.data:l.data;
    for(let y=0;y<h;y++){out.set(a.subarray(y*w*4,(y+1)*w*4),y*w*8);out.set(b.subarray(y*w*4,(y+1)*w*4),y*w*8+w*4)}
    return {data:out,w:w*2,h};
  }
  const out=new Uint8ClampedArray(n*4);
  for(let i=0;i<n;i++){const j=4*i;out[j]=l.data[j];out[j+1]=r.data[j+1];out[j+2]=r.data[j+2];out[j+3]=255}
  return {data:out,w,h};
}
function show(canvas,data,w,h){
  canvas.width=w;canvas.height=h;
  canvas.getContext('2d').putImageData(new ImageData(data,w,h),0,0);
}
function showDepth(z,w,h){
  const rgba=new Uint8ClampedArray(w*h*4);
  for(let i=0;i<z.length;i++){const k=i*4,v=Math.round(z[i]*255);rgba[k]=rgba[k+1]=rgba[k+2]=v;rgba[k+3]=255}
  show($('depthview'),rgba,w,h);
}
const advancedModes=new Set(['chromadepth','autostereogram','cardboard','stereoscope-card','mirror-stereoscope','rowinterlaced','columninterlaced','checkerboard','lenticular','wiggle','pulfrich']);
function encodeDepthPng(z,w,h){
  const rgba=new Uint8ClampedArray(w*h*4);
  for(let i=0;i<z.length;i++){
    const k=i*4,value=Math.round(z[i]*255);
    rgba[k]=rgba[k+1]=rgba[k+2]=value;rgba[k+3]=255;
  }
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  canvas.getContext('2d').putImageData(new ImageData(rgba,w,h),0,0);
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Depth PNG encoding failed')),'image/png'));
}
async function renderPreserved(){
  if(!image||!depth||!originalFile)return;
  const button=$('serverrender');button.disabled=true;
  try{
    const [w,h]=dimensions(image),map=await encodeDepthPng(depth,w,h),form=new FormData();
    form.append('image',originalFile,originalFile.name);
    form.append('depth',map,'ai-depth.png');
    form.append('technique',$('mode').value);
    form.append('disparity',$('disp').value);
    form.append('screen_depth',$('plane').value);
    status('Rendering with preserved original technique engine…');
    const response=await fetch('/api/render',{method:'POST',body:form});
    if(!response.ok)throw new Error((await response.json().catch(()=>({}))).error||'Rendering service unavailable. Run the local Python server.');
    const blob=await response.blob();
    if(animatedUrl){URL.revokeObjectURL(animatedUrl);animatedUrl=null}
    animatedBlob=null;
    if(blob.type.includes('gif')){
      animatedBlob=blob;animatedUrl=URL.createObjectURL(blob);
      $('animation').src=animatedUrl;$('animation').hidden=false;
      $('result').hidden=true;
    }else{
      $('animation').hidden=true;$('result').hidden=false;
      const result=await fileImage(blob);
      const rgba=raster(result,result.naturalWidth,result.naturalHeight);
      show($('result'),rgba.data,rgba.width,rgba.height);
    }
    $('save').disabled=false;
    status('Rendered '+$('mode').value+' using preserved original technique code.');
  }catch(error){status('Preserved engine: '+error.message)}
  finally{button.disabled=false}
}
async function render(){
  if(!image||!depth)return;
  if(advancedModes.has($('mode').value))return renderPreserved();
  animatedBlob=null;if(animatedUrl){URL.revokeObjectURL(animatedUrl);animatedUrl=null}
  $('animation').hidden=true;$('result').hidden=false;
  const [w,h]=dimensions(image),rgba=raster(image,w,h).data;
  const shift=w*Number($('disp').value)/200,plane=Number($('plane').value);
  const left=view(rgba,depth,w,h,shift,plane),right=view(rgba,depth,w,h,-shift,plane);
  const result=combine(left,right,w,h,$('mode').value);
  show($('result'),result.data,result.w,result.h);showDepth(depth,w,h);
  $('save').disabled=false;status('Rendered '+w+' × '+h+' with AI-derived depth.');
}
async function generate(){
  if(!image||!originalFile)return;
  $('estimate').disabled=true;$('render').disabled=true;
  try{
    const [w,h]=dimensions(image);
    if($('depthsource').value==='uploaded'){
      const f=$('depthfile').files[0];
      if(!f)throw Error('Choose a depth map or switch to automatic AI depth.');
      depth=await importedDepth(f,w,h);
    }else depth=await inferDepth(originalFile,w,h);
    $('render').disabled=false;$('serverrender').disabled=false;render();
  }catch(error){status('Depth generation failed: '+(error?.message||error));console.error(error)}
  finally{$('estimate').disabled=false}
}
$('photo').onchange=async e=>{
  const file=e.target.files[0];if(!file)return;
  try{image=await fileImage(file);originalFile=file;depth=null;$('estimate').disabled=false;$('render').disabled=true;$('save').disabled=true;await generate()}
  catch(error){status(error.message)}
};
$('depthfile').onchange=()=>{if($('depthfile').files[0]){$('depthsource').value='uploaded';if(image)generate()}};
$('depthsource').onchange=()=>{if(image)generate()};
$('estimate').onclick=generate;$('render').onclick=render;$('serverrender').onclick=renderPreserved;
for(const id of ['disp','plane','mode'])$(id).addEventListener('input',()=>{
  $('displabel').textContent=Number($('disp').value).toFixed(1)+'%';
  $('planelabel').textContent=Number($('plane').value).toFixed(2);
  if(depth)render();
});
function downloadResult(blob,filename){
  if(!blob)return;
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
}
$('save').onclick=()=>{
  if(animatedBlob){downloadResult(animatedBlob,'anaglyph-independent.gif');return}
  $('result').toBlob(blob=>downloadResult(blob,'anaglyph-independent.png'),'image/png');
};
$('runbatch').onclick=async()=>{
  const files=[...$('batch').files];if(!files.length)return;
  $('runbatch').disabled=true;
  const previous={image,depth,originalFile};
  try{
    for(let i=0;i<files.length;i++){
      $('batchstatus').textContent='Processing '+(i+1)+' of '+files.length+': '+files[i].name;
      await pause();image=await fileImage(files[i]);originalFile=files[i];depth=null;
      const [w,h]=dimensions(image);depth=await inferDepth(files[i],w,h);await render();
      const isGif=Boolean(animatedBlob);
      const blob=isGif?animatedBlob:await new Promise(resolve=>$('result').toBlob(resolve,'image/png'));
      downloadResult(blob,files[i].name.replace(/\.[^.]+$/,'')+'-independent.'+(isGif?'gif':'png'));
    }
    $('batchstatus').textContent='Batch finished. '+files.length+' files processed.';
  }catch(error){$('batchstatus').textContent='Batch stopped: '+error.message}
  finally{image=previous.image;depth=previous.depth;originalFile=previous.originalFile;if(depth)await render();$('runbatch').disabled=false}
};
