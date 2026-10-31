"""API regression tests using synthetic imagery, no downloaded model required."""
from io import BytesIO

import cv2
import numpy as np

from server import app, render, TECHNIQUES


def synthetic():
    image = np.zeros((24, 40, 3), dtype=np.uint8)
    image[:] = [70, 120, 180]
    image[4:20, 14:26] = [20, 40, 240]
    depth = np.zeros((24, 40), dtype=np.float32)
    depth[4:20, 14:26] = 1.0
    return image, depth


def test_all_core_outputs():
    image, depth = synthetic()
    for name in ("anaglyph", "parallel", "cross", "left", "right",
                 "chromadepth", "autostereogram", "rowinterlaced",
                 "columninterlaced", "checkerboard"):
        result = render(image, depth, name, disparity=4)
        assert result.ndim == 3 and result.shape[2] == 3, name
        assert result.size > 0, name


def test_upload_to_png():
    image, depth = synthetic()
    _, photo = cv2.imencode(".png", image)
    _, map_png = cv2.imencode(".png", np.uint8(depth * 255))
    with app.test_client() as client:
        result = client.post("/api/render", data={
            "image": (BytesIO(photo.tobytes()), "source.png"),
            "depth": (BytesIO(map_png.tobytes()), "depth.png"),
            "technique": "anaglyph",
            "disparity": "3",
        })
        assert result.status_code == 200, result.get_data(as_text=True)[:300]
        assert result.mimetype == "image/png"
        assert cv2.imdecode(np.frombuffer(result.data, np.uint8), 1).shape == image.shape


def test_invalid_upload():
    with app.test_client() as client:
        response = client.post("/api/render", data={})
        assert response.status_code == 400


if __name__ == "__main__":
    test_all_core_outputs()
    test_upload_to_png()
    test_invalid_upload()
