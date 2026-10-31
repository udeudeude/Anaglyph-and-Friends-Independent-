# Work state — 2026-10-31

## Completed in this integration

- Recovered actual Legacy source and history at c4e698d2; preserved original post-fork modules/dependencies/styles and core workspace implementation. No writes to Legacy or website repository.
- Reassembled the complete React studio and production Flask API. Removed the competing minimalist prototype entrypoint.
- Independently replaced the inherited local model adapter and optimized anaglyph implementation; retained the owner's fractional-pixel stereo renderer and repair masks.
- Restored original routes for depth editing/import/regeneration/selection, all 17 techniques, batch workspaces, specialized print outputs, and specialist React tools.
- Pinned and bundled browser inference runtime, pinned ONNX model revision, float32 prediction transfer, inference-stage CPU fallback.
- Added true request/response integration tests for all 17 UI recipe IDs and preview/full outputs, numeric depth tests, and reproducible real-photo inference verification.
- Added separate Mac app identity/origin/data paths and Intel/Apple Silicon packaging, verified model installer, source archive and AGPL notices.

## Evidence so far

React production build passes; original 234 structural feature assertions and retained frontend math/PDF/batch suites pass. Backend stereo visibility, background repair, cache invalidation, screen-plane, batch isolation, depth regeneration and numerical import tests pass. Local V2 Small real-photo inference: 512×512 NASA Collins photo, 261,083 distinct float32 values, ~3 seconds on this Linux CPU; stereo eye mean absolute difference 18.14/255. Exact weights checksum recorded in DEPTH_MODEL_LICENSES.md.

## Still open

Deployment and CI/Mac workflow status; actual browser inference (GPU/WASM), visual comparison with live Legacy, iPhone/iPad behavior, optional V3 real inference, end-to-end specialist browser exports, physical print/viewer checks and long-batch memory tests. This is an integrated development build, not yet accepted equivalence. Continue with the deployed preview and exact failure evidence; do not substitute feature-count or compilation claims for these checks.
