# Depth precision — repaired and regression tested

The earlier diagnosis overstated the imported-PNG defect at the current revision: preserved `normalise_depth` already divides integer pixels by their dtype maximum rather than by image extrema. Constant-gray and narrow-range 8/16-bit inputs now have explicit tests, including the actual upload → saved float32 → screen-plane API path.

A separate real defect remained: the browser adapter used Transformers.js's rendered 8-bit depth image, discarding the float tensor's precision. It now reads `predicted_depth`, normalizes raw relative predictions once, then transports a float32 NPY file. Imported normalized maps are never contrast-stretched; model normalization is separate from importing an already normalized map.

Tests: frontend/src/depthPrecision.test.mjs and backend/test_depth_precision.py. A 512×512 real photograph processed with pinned local V2 Small produced 261,083 distinct depth values. Actual browser inference and device-memory behavior are separately recorded in WORK_STATE.md; mathematical tests are not substitutes for them.
