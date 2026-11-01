"""End-to-end smoke test of the deployed image/depth/stereo API."""
from io import BytesIO
import numpy as np
from PIL import Image
import requests

root = "https://anaglyph-friends-independent.onrender.com"
session = requests.Session()
height, width = 32, 48
yy, xx = np.indices((height, width))
rgb = np.stack((xx * 5, yy * 7, (xx + yy) * 3), axis=-1).astype(np.uint8)
photo = BytesIO()
Image.fromarray(rgb, "RGB").save(photo, "PNG")
photo.seek(0)
uploaded = session.post(root + "/image", files={"file": ("smoke.png", photo, "image/png")}, timeout=90)
assert uploaded.status_code == 200, (uploaded.status_code, uploaded.text[:500])
depth = BytesIO()
np.save(depth, (xx / (width - 1)).astype(np.float32))
depth.seek(0)
imported = session.post(root + "/depth-map/ai-import", files={"file": ("smoke.npy", depth, "application/octet-stream")}, timeout=90)
assert imported.status_code == 200, (imported.status_code, imported.text[:500])
result = session.get(root + "/output/anaglyph", params={"scope": "preview", "format": "png", "max_disparity_percentage": 2}, timeout=90)
assert result.status_code == 200, (result.status_code, result.text[:500])
decoded = Image.open(BytesIO(result.content))
decoded.load()
assert decoded.width > 0 and decoded.height > 0
print("Live photo upload, float32 depth import, stereo rendering and PNG decoding passed")
