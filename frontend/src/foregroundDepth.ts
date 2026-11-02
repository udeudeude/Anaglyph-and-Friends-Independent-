/** Decode the browser depth model's float32 NPY transport into a PNG for the
 * existing independently depth-mapped foreground renderer. */
export async function foregroundDepthPng(npy: File, source: File): Promise<File> {
    const bytes = await npy.arrayBuffer()
    const view = new DataView(bytes)
    const magic = [0x93,78,85,77,80,89]
    if (magic.some((n,i)=>view.getUint8(i)!==n) || view.getUint8(6)!==1) throw new Error('Unexpected depth map format')
    const headerSize = view.getUint16(8,true)
    const header = new TextDecoder().decode(new Uint8Array(bytes,10,headerSize))
    if (!header.includes('f4')) throw new Error('Expected float32 depth')
    const match = header.match(/'shape':\s*\((\d+),\s*(\d+)\)/)
    if (!match) throw new Error('Depth dimensions are missing')
    const height = Number(match[1]), width = Number(match[2])
    if (width<1 || height<1 || width*height>24000000 || 10+headerSize+width*height*4>bytes.byteLength) throw new Error('Invalid depth dimensions')
    const sourceBitmap = await createImageBitmap(source)
    try {
        const canvas = document.createElement('canvas')
        canvas.width=width;canvas.height=height
        const ctx=canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas unavailable')
        ctx.drawImage(sourceBitmap,0,0,width,height)
        const alpha=ctx.getImageData(0,0,width,height).data
        const pixels=ctx.createImageData(width,height)
        const start=10+headerSize
        for(let i=0;i<width*height;i++){
            const value=view.getFloat32(start+i*4,true)
            if(!Number.isFinite(value)) throw new Error('Non-finite depth')
            const grey=alpha[i*4+3]===0 ? 128 : Math.round(Math.max(0,Math.min(1,value))*255)
            const offset=i*4
            pixels.data[offset]=pixels.data[offset+1]=pixels.data[offset+2]=grey
            pixels.data[offset+3]=255
        }
        ctx.putImageData(pixels,0,0)
        const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(result=>result?resolve(result):reject(new Error('Depth PNG encoding failed')),'image/png'))
        return new File([blob],'foreground-ai-depth.png',{type:'image/png'})
    }finally{sourceBitmap.close()}
}
