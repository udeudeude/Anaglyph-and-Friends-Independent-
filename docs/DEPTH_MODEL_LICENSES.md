# Model and runtime inventory

Verified 2026-10-31 against publisher metadata, source and downloaded files.

| Component | Exact identity | License/evidence |
|---|---|---|
| Default local model | depth-anything/Depth-Anything-V2-Small revision 05bbaec5306c04f1fa00a8c376c7dcf4153e7fe8, depth_anything_v2_vits.pth | Apache-2.0 publisher model card |
| Local code | DepthAnything/Depth-Anything-V2 commit a561b849ebae10a6f5ef49e26c83cbbcd36c71bf | Apache-2.0 LICENSE; maintainer clarification issue 81 |
| Browser ONNX | onnx-community/depth-anything-v2-small revision 4472b7362082ad9968fee890ca0f1e5aca36b93d | Model card explicitly Apache-2.0, derived from V2 Small; pinned model_q4f16.onnx on WebGPU, model_quantized.onnx on WASM |
| Browser model runtime | @huggingface/transformers 3.7.6, installed/bundled from npm | Apache-2.0; transitive ONNX Runtime MIT |
| Optional V3 | onnx-community/depth-anything-v3-small revision 7764f5829b7429e7ecfa0a9c908a6e0facb65a24 | Retained original optional adapter; publisher licensing and real-runtime checks remain in QA work state |

Local V2 Small weights SHA-256: `715fade13be8f229f8a70cc02066f656f2423a59effd0579197bbf57860e1378` (verified against the actual downloaded 99 MB file). Both CPU inference and output stereo generation passed on a real NASA photograph. Browser model inference must be verified separately.

Sources: https://huggingface.co/depth-anything/Depth-Anything-V2-Small ; https://huggingface.co/onnx-community/depth-anything-v2-small ; https://github.com/DepthAnything/Depth-Anything-V2/issues/81 . Base/Large/Giant weights have noncommercial terms and are not bundled or offered by the default model adapter.
