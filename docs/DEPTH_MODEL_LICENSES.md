# Depth model and runtime licensing review

Reviewed against the upstream repositories on 2026-10-30.

1. **Depth Anything V2:** The [official repository](https://github.com/DepthAnything/Depth-Anything-V2) contains an Apache License 2.0 file. Its README explicitly distinguishes the model weights: **Depth Anything V2 Small is Apache-2.0**, while **Base, Large, and Giant are CC BY-NC 4.0**. The Independent Edition should use the Small model by default and must not silently substitute the noncommercial weights for commercial distribution.
2. **Transformers.js:** The [Hugging Face Transformers.js repository](https://github.com/huggingface/transformers.js) contains an Apache-2.0 license. The browser prototype currently loads the runtime from a version-pinned jsDelivr CDN URL.
3. **ONNX conversion:** The browser prototype references `onnx-community/depth-anything-v2-small`, a Hugging Face model repository rather than a GitHub repository. The exact converted model card, files, and redistribution terms must still be checked at Hugging Face before bundling or distributing weights. An upstream Apache license is not automatically proof that every third-party converted artifact has identical rights.
4. **AGPL compatibility:** Apache-2.0-licensed code is compatible with GPLv3/AGPLv3 combination subject to preservation of notices and other conditions. Separate model weights remain under their own licenses; using a model from an AGPL application does not by itself relicense the weights.

## Release gate

Verify the exact ONNX model revision, model-card license, checkpoint provenance, runtime version, and notice distribution before public release. Test actual WebGPU and CPU inference on target devices. Keep the Legacy Edition unchanged.
