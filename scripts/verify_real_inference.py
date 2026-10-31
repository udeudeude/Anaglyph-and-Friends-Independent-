"""Actual V2 Small inference on the public-domain NASA Collins photograph."""
from pathlib import Path
import hashlib,io,json,os,sys,time,urllib.request
import cv2,numpy as np
root=Path(__file__).resolve().parents[1];sys.path.insert(0,str(root/'backend'))
from local_depth import local_depth
from stereo_adapter import stereo_adapter
folder=root/'artifacts';folder.mkdir(exist_ok=True)
photo=folder/'astronaut.png'
if not photo.exists():
 urllib.request.urlretrieve('https://raw.githubusercontent.com/scikit-image/scikit-image/v0.24.0/skimage/data/astronaut.png',photo)
image=cv2.imread(str(photo));assert image is not None
started=time.monotonic();depth=local_depth.generate_depth_map(image)
assert depth.shape==image.shape[:2] and depth.dtype==np.float32 and np.isfinite(depth).all()
assert len(np.unique(depth))>4096 and depth.max()-depth.min()>.9
left,right=stereo_adapter.generate_stereo_images(image,depth,False,3,.5)
assert np.mean(np.abs(left.astype(float)-right.astype(float)))>1
cv2.imwrite(str(folder/'real-depth-16bit.png'),np.round(depth*65535).astype(np.uint16))
cv2.imwrite(str(folder/'real-photo-anaglyph.png'),stereo_adapter.generate_optimised_RR_anaglyph(left,right))
report={'photo':'NASA Eileen Collins via scikit-image v0.24.0 (public domain)','photo_sha256':hashlib.file_digest(photo.open('rb'),'sha256').hexdigest(),'model':'Depth Anything V2 Small','model_sha256':hashlib.file_digest((root/'backend/ai_models/checkpoints/depth_anything_v2_vits.pth').open('rb'),'sha256').hexdigest(),'device':local_depth._device,'shape':list(depth.shape),'unique_depth_values':len(np.unique(depth)),'seconds':round(time.monotonic()-started,3),'mean_eye_difference':float(np.mean(np.abs(left.astype(float)-right.astype(float))))}
(folder/'real-inference.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
