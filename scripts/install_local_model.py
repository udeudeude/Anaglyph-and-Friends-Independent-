"""Install the pinned Apache-2.0 V2 Small implementation and verified weights."""
from pathlib import Path
import hashlib, subprocess, urllib.request
root=Path(__file__).resolve().parents[1]
folder=root/'backend/ai_models'
folder.mkdir(parents=True,exist_ok=True)
code=folder/'Depth_Anything_V2'
revision='a561b849ebae10a6f5ef49e26c83cbbcd36c71bf'
if not code.exists(): subprocess.run(['git','clone','https://github.com/DepthAnything/Depth-Anything-V2.git',str(code)],check=True)
subprocess.run(['git','-C',str(code),'checkout','--detach',revision],check=True)
weights=folder/'checkpoints/depth_anything_v2_vits.pth';weights.parent.mkdir(exist_ok=True)
expected='715fade13be8f229f8a70cc02066f656f2423a59effd0579197bbf57860e1378'
if not weights.exists():
 temporary=weights.with_suffix('.download')
 urllib.request.urlretrieve('https://huggingface.co/depth-anything/Depth-Anything-V2-Small/resolve/05bbaec5306c04f1fa00a8c376c7dcf4153e7fe8/depth_anything_v2_vits.pth',temporary)
 if hashlib.file_digest(temporary.open('rb'),'sha256').hexdigest()!=expected:
  temporary.unlink();raise RuntimeError('Model checksum mismatch')
 temporary.replace(weights)
assert hashlib.file_digest(weights.open('rb'),'sha256').hexdigest()==expected,'Model checksum mismatch'
print('Pinned V2 Small code and SHA-256-verified weights ready')
