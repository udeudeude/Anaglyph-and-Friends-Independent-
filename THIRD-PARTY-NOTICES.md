# Anaglyph & Friends: Independent Edition

Application contributions by the owner of udeudeude/Anaglyph-and-Friends and independently authored replacements are distributed under AGPL-3.0-or-later; see LICENSE. Post-fork provenance, exclusions and unresolved checks are recorded in docs/PROVENANCE_REVIEW.md and docs/PROVENANCE.json.

No Duy Huynh source implementation, logo, favicon or example photograph is distributed here. No original creative artwork is bundled under the application license.

Dependencies retain their licenses: React and React DOM (MIT), Vite (MIT), TypeScript (Apache-2.0), ONNX Runtime (MIT), Hugging Face Transformers.js (Apache-2.0), Flask and Werkzeug (BSD-3-Clause), NumPy (BSD-3-Clause), Pillow (HPND), OpenCV (Apache-2.0), PyTorch/torchvision (BSD-style), Python (PSF), and PyInstaller (GPL with bootloader exception). Exact installed dependencies are pinned in lock/requirements files. Their license texts are retained in installed distributions; the Mac collector bundles these notices.

The vendored Iconoir paths are MIT licensed; see frontend/NOTICE-ICONOIR.md.

Depth Anything V2 Small code and weights are Apache-2.0. See docs/DEPTH_MODEL_LICENSES.md for immutable source/model revisions. Base, Large and Giant weights are not bundled. The optional ONNX V3 Small adapter retains its original explicit selection behavior; V2 Small remains Automatic.

The independent optimized anaglyph implementation uses the published Dubois red/cyan projection coefficients. Numeric matrices are scientific parameters, not copied implementation. It preserves floating-point negative contributions until the final clamp, correcting the inherited uint8 clipping/wraparound and coefficient defect.

QA photograph: NASA astronaut Eileen Collins, via scikit-image v0.24.0 skimage/data/astronaut.png, public domain. This is downloaded by verification scripts, not an inherited upstream artwork.
