"""Independent local adapter for the Apache-2.0 Depth Anything V2 Small model."""
from pathlib import Path
import os
import threading
import numpy as np
import cv2

# PyTorch must see this before import; it is also useful on Apple Silicon.
os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")


class LocalDepth:
    def __init__(self):
        self._model = None
        self._device = "cpu"
        self._lock = threading.Lock()

    def _load(self):
        import torch
        from ai_models.Depth_Anything_V2.depth_anything_v2.dpt import DepthAnythingV2
        requested = os.getenv("AAF_TORCH_DEVICE", "").lower()
        available = {"cpu": True, "cuda": torch.cuda.is_available(), "mps": torch.backends.mps.is_available()}
        self._device = requested if available.get(requested) else next(d for d in ("cuda", "mps", "cpu") if available[d])
        directory = Path(os.getenv("AAF_DEPTH_MODEL_DIR", str(Path(__file__).parent / "ai_models/checkpoints")))
        weights = directory / "depth_anything_v2_vits.pth"
        if not weights.is_file():
            raise RuntimeError("Local V2 Small weights are missing. Run scripts/install_local_model.py, or use the browser edition.")
        model = DepthAnythingV2(encoder="vits", features=64, out_channels=[48, 96, 192, 384])
        model.load_state_dict(torch.load(weights, map_location="cpu", weights_only=True))
        model.eval()
        try:
            self._model = model.to(self._device)
        except RuntimeError as error:
            if self._device != "mps" or "out of memory" not in str(error).lower():
                raise
            # MPS can fail during model placement, before inference begins.
            # Reconstruct on CPU rather than transferring a partially moved model.
            self._device = "cpu"
            model = DepthAnythingV2(encoder="vits", features=64,
                                    out_channels=[48, 96, 192, 384])
            model.load_state_dict(torch.load(weights, map_location="cpu", weights_only=True))
            self._model = model.eval()

    def generate_depth_map(self, image):
        import torch
        import torch.nn.functional as functional
        # Use the licensed model's published preprocessing and control the device
        # explicitly. Its image2tensor helper otherwise chooses a device itself.
        from ai_models.Depth_Anything_V2.depth_anything_v2.util.transform import Resize, NormalizeImage, PrepareForNet
        with self._lock:
            if self._model is None:
                self._load()
            resized = Resize(width=518, height=518, resize_target=False,
                             keep_aspect_ratio=True, ensure_multiple_of=14,
                             resize_method="lower_bound", image_interpolation_method=cv2.INTER_CUBIC)
            source = {"image": image[..., ::-1].astype(np.float32) / 255}
            source = resized(source)
            source = NormalizeImage(mean=[.485, .456, .406], std=[.229, .224, .225])(source)
            source = PrepareForNet()(source)["image"]
            tensor = torch.from_numpy(source).unsqueeze(0)
            try:
                with torch.inference_mode():
                    prediction = self._model(tensor.to(self._device))
            except RuntimeError:
                if self._device == "cpu":
                    raise
                self._device = "cpu"
                self._model.to("cpu")
                with torch.inference_mode():
                    prediction = self._model(tensor)
            prediction = functional.interpolate(prediction[:, None], image.shape[:2], mode="bilinear", align_corners=True)
            values = prediction[0, 0].cpu().numpy().astype(np.float32)
        if not np.isfinite(values).all():
            raise RuntimeError("Depth Anything V2 returned non-finite predictions")
        lo, hi = float(values.min()), float(values.max())
        return np.zeros_like(values) if hi - lo < 1e-12 else (values - lo) / (hi - lo)


local_depth = LocalDepth()
