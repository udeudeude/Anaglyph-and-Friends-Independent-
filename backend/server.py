"""Independent Edition rendering API.

Accepts an image and a depth map produced by the browser's Depth Anything V2
pipeline. Uses preserved original post-fork rendering modules, not the
unlicensed upstream application's Flask routes or stereo generator.
"""
from __future__ import annotations

import io
import os
import sys
from pathlib import Path

import cv2
import numpy as np
from flask import Flask, jsonify, request, send_file, send_from_directory
from PIL import Image

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from stereo_renderer import render_view
from stereo_formats import make_anaglyph, compatibility_stereo
from technique_generator import technique_generator
from depth_sources import align_depth, normalise_depth

app = Flask(__name__)


@app.get("/")
def home():
    return send_from_directory(str(HERE.parent), "index.html")


@app.get("/app.js")
def frontend_script():
    return send_from_directory(str(HERE.parent), "app.js")


app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024

TECHNIQUES = (
    "anaglyph", "parallel", "cross", "left", "right", "chromadepth",
    "autostereogram", "cardboard", "stereoscope-card", "mirror-stereoscope",
    "rowinterlaced", "columninterlaced", "checkerboard",
    "lenticular", "wiggle", "pulfrich",
)


def decode_image(upload):
    if upload is None:
        raise ValueError("An image file is required")
    content = np.frombuffer(upload.read(), dtype=np.uint8)
    decoded = cv2.imdecode(content, cv2.IMREAD_COLOR)
    if decoded is None:
        raise ValueError("Could not decode image")
    if decoded.shape[0] * decoded.shape[1] > 24_000_000:
        raise ValueError("Image exceeds 24 megapixels")
    return decoded


def read_depth(upload, width, height):
    if upload is None:
        raise ValueError("An AI-generated or imported depth map is required")
    data = np.frombuffer(upload.read(), dtype=np.uint8)
    raw = cv2.imdecode(data, cv2.IMREAD_UNCHANGED)
    if raw is None:
        raise ValueError("Could not decode depth map")
    depth = normalise_depth(raw)
    return align_depth(depth, width, height, "stretch").astype(np.float32)


def render(image, depth, technique="anaglyph", disparity=3.0, screen_depth=0.5):
    if technique not in TECHNIQUES:
        raise ValueError("Unsupported technique")
    if not (0 <= disparity <= 20 and 0 <= screen_depth <= 1):
        raise ValueError("Disparity or screen depth is out of range")
    height, width = image.shape[:2]
    half = width * disparity / 200
    left, _ = render_view(image, depth, half, screen_depth)
    right, _ = render_view(image, depth, -half, screen_depth)
    if technique == "anaglyph":
        result = right.copy()
        result[:, :, 2] = left[:, :, 2]
    elif technique == "parallel":
        result = np.hstack((left, right))
    elif technique == "cross":
        result = np.hstack((right, left))
    elif technique == "left":
        result = left
    elif technique == "right":
        result = right
    elif technique == "chromadepth":
        result = technique_generator.chromadepth(image, depth)
    elif technique == "autostereogram":
        result = technique_generator.autostereogram(depth)
    elif technique == "cardboard":
        result = technique_generator.cardboard(left, right)
    elif technique == "stereoscope-card":
        result = technique_generator.stereoscope_card(left, right)
    elif technique == "mirror-stereoscope":
        result = technique_generator.mirror_stereoscope(left, right)
    elif technique in ("rowinterlaced", "columninterlaced", "checkerboard"):
        result = compatibility_stereo(left, right, technique)
    elif technique == "lenticular":
        result = technique_generator.lenticular(
            image, depth, width, height, strength=disparity,
            screen_depth=screen_depth)
    elif technique in ("wiggle", "pulfrich"):
        frames = (technique_generator.wiggle_frames(image, depth, strength=disparity,
                  screen_depth=screen_depth) if technique == "wiggle"
                  else technique_generator.pulfrich_frames(image, depth, strength=disparity,
                  screen_depth=screen_depth))
        result = frames[0]
    else:
        raise ValueError("Unsupported technique")
    if not isinstance(result, np.ndarray):
        result = np.asarray(result)
    if result.ndim != 3 or result.shape[2] != 3:
        raise ValueError("Technique returned an unsupported image format")
    return result


@app.get("/api/techniques")
def techniques():
    return jsonify({"techniques": TECHNIQUES, "ai_depth": "provided by browser Depth Anything V2"})


@app.post("/api/render")
def render_endpoint():
    try:
        image = decode_image(request.files.get("image"))
        depth = read_depth(request.files.get("depth"), image.shape[1], image.shape[0])
        technique = request.form.get("technique", "anaglyph")
        disparity = float(request.form.get("disparity", 3))
        plane = float(request.form.get("screen_depth", 0.5))
        output = render(image, depth, technique, disparity, plane)
        ok, encoded = cv2.imencode(".png", output)
        if not ok:
            raise ValueError("PNG encoding failed")
        return send_file(io.BytesIO(encoded.tobytes()), mimetype="image/png",
                         download_name="independent-result.png")
    except (ValueError, TypeError, cv2.error) as error:
        return jsonify({"error": str(error)}), 400


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.getenv("PORT", "8010")))
