# Legacy feature accountability ledger

**Baseline:** `udeudeude/Anaglyph-and-Friends` at `c4e698d2cf4610964408c0ff69a71f8735d406e8`.  
**Independent destination:** this repository, `main`.  
**Reviewed:** 2026-11-02.

## Meaning of "accounted for"

A feature is **accounted for** when its Legacy implementation or specification has an identified Independent destination, a clear evidence source, and an explicit verification status. This does **not** imply real-device, perceptual, or physical-output equivalence.

The known-feature inventory is assembled from the Legacy technique catalog, preserved React workspaces, supporting feature modules, and the 98-file history-based `PROVENANCE.json`. No claim is made that these sources reveal every undocumented historical interaction.

## 1. All 17 Legacy techniques

The exact technique IDs, labels, defaults, preview URLs, and full-resolution request URLs are in `docs/TECHNIQUE_INVENTORY.json`. The preserved `frontend/src/techniques.ts`, `TechniqueControls.tsx`, `techniqueOutput.ts`, `AnaglyphEditor.tsx`, and the independent `backend/app.py` are the implementation destinations.

| Techniques | Independent destination | Evidence | Remaining verification |
|---|---|---|---|
| Anaglyph, Parallel, Cross-Eyed | Direct output recipe and backend stereo engine | `backend/test_server.py`, `backend/test_stereo_renderer.py` | Visual comparison, filter calibration and real-device perception |
| ChromaDepth, Cardboard, Stereoscope Card, Mirror Stereoscope | Specialist routes and preserved technique controls | `backend/test_server.py`, `frontend/src/regression_contract.test.mjs` | Viewer geometry, physical printing, phone viewer |
| Wiggle, Pulfrich | Multi-frame GIF routes and settings | `backend/test_server.py` | Animation cadence, actual perceptual effect |
| Random-Dot and Pattern Stereograms | Distinct catalog IDs and autostereogram styles | `backend/test_server.py`, `TECHNIQUE_INVENTORY.json` | Viewing guides, pattern fidelity and stereogram fusion |
| Lenticular | Lenticular renderer, print/calibration controls | `backend/test_server.py`, `PrintCalibrationBuilder.tsx` | Printed lens pitch, slant, alignment |
| Top/Bottom, Half-SBS, Row Interlaced, Column Interlaced, Checkerboard | Direct output recipes and compatibility engine | `backend/test_server.py`, `techniqueOutput.ts` | External player/display compatibility |

**Evidence level:** All 17 routes previously passed automated preview/full image decoding, with GIF frame-count checks for animation. This is endpoint-level evidence, not a comprehensive settings-by-settings or visual comparison. `frontend/src/featureAccounting.test.mjs` now guards the entire inventory.

## 2. All 12 known application workspaces

| Workspace | Independent implementation | Evidence | Not yet certified |
|---|---|---|---|
| 3D Studio | `AnaglyphEditor.tsx`, `TechniqueControls.tsx` | Exact Legacy Git blobs; feature-contract test | Full UI/interaction parity |
| Single-image intake, depth generation/editing | `ImageUpload.tsx`, `browserDepth.ts`, `DepthGeneratorSelector.tsx` | Adapted intake; V2 model inference verified locally; frontend regressions | Real iOS browser AI inference, depth painting gestures |
| Stereo pair intake and editing | `StereoPairUpload.tsx`, `StereoPairEditor.tsx` | Original editor blob; preserved stereo-pair math | Real-device interaction |
| View-Master reel | `ViewMasterBuilder.tsx`, `viewMasterPdf.ts`, `viewMasterCrop.ts` | PDF/crop regression tests; mobile return/reel fixes | Printed reel alignment, phone viewport acceptance |
| Polarized projection | `PolarizedProjection.tsx` | Exact Legacy Git blob, mounted in App | Physical dual-projector setup |
| Phantogram | `PhantogramBuilder.tsx`, `modelPhantogram.ts`, `phantogramDiagnosticSheet.ts` | Mesh and diagnostic-sheet unit tests; physical viewing guide | Physical geometry and print perception |
| Color reveal | `ColorRevealBuilder.tsx` | Exact Legacy Git blob, mounted | Printed filter/glasses experiments |
| Layered composite | `LayeredCompositeBuilder.tsx` | Exact Legacy Git blob, mounted | Layer output visual parity |
| Layered transparency | `LayeredTransparencyBuilder.tsx`, `layeredTransparency.ts`, `layeredTransparencyPdf.ts` | Original layer math/PDF tests; mobile slider update | Printed stack registration and live touch scrubbing |
| Print calibration | `PrintCalibrationBuilder.tsx` | Exact Legacy Git blob, mounted | Physical printer calibration |
| Print-page builder | `PrintPageBuilder.tsx` | Exact Legacy Git blob, mounted | Print-to-paper dimensions |

The table counts **12** workspaces by treating the 3D Studio, single-image intake, and stereo-pair intake/editor as separate functional areas. It does not imply 12 top-level navigation tabs.

## 3. Cross-cutting features

| Known capability | Independent destination | Evidence | Open acceptance work |
|---|---|---|---|
| Depth Anything V2 Small automatic inference | `browserDepth.ts`, `backend/local_depth.py` | Pinned model checksums; actual local photo inference; depth precision tests | iPhone/WebGPU/WASM real inference |
| Optional Depth Anything V3 | `browserDepthV3.ts`, `depthV3Math.ts` | Float32 and near/far unit tests; GPU-to-CPU retry code | Actual V3 browser inference and licensing |
| Depth import, inversion, regeneration, brush, selection | `ImageUpload.tsx`, `backend/depth_sources.py`, `backend/app.py` | Depth-regeneration and import tests | Manual brush/selection gestures |
| Screen-depth/convergence | `screenDepth.ts`, stereo renderer | Numeric screen-plane tests | Physical viewing |
| Occlusion, subpixel displacement, repair | `backend/stereo_renderer.py` | Stereo/visibility/background repair tests | Visual artifact comparison |
| Batch folder processing, queue, retry, pause | `BatchWorkspace.tsx`, `batchProcessing.ts`, `backend/app.py` | Batch parsing/workspace regression tests | Long nested-folder and failure-recovery test |
| ZIP packaging and optional depth maps | `batchZip.ts`, `BatchWorkspace.tsx` | Batch regression tests; code-path accounting | Large real-world download and optional-map audit |
| Source/archive and AGPL notices | `backend/production.py`, `LICENSE`, notices | Live hosted `/source` ZIP smoke test | Full redistribution audit |
| Mac local/offline distribution | `macos/desktop.py`, `macos/desktop.spec`, Mac workflow | Both architecture builds and frozen-app smoke tests previously passed | User-device installation and offline use |
| Touch navigation and previews | `App.tsx`, View-Master and transparency CSS | Mobile regressions and source accounting | Actual iPhone/iPad interaction |
| Full-resolution image and specialty print exports | `backend/app.py`, print builders | Preview/full endpoint tests, PDF unit tests | Physical dimensions and appearance |

## 4. Source-preservation evidence

`docs/PROVENANCE.json` traces **98** historical files, of which **82** are classified as preserved post-fork and **16** as post-fork implementations with mixed scaffolding reviewed. `frontend/src/historicalProvenance.test.mjs` requires a current destination for all 98; four retired Legacy macOS launcher paths map explicitly to the independent desktop package.

`docs/LEGACY_SOURCE_PARITY.json` records direct Git blob comparisons for 25 important frontend modules: **21 exact** and **4 adapted** (image intake, View-Master, phantogram, layered transparency). `frontend/src/legacySourceParity.test.mjs` enforces the original Git blob hashes for the exact-preserved files.

**Important:** Git blob identity demonstrates source retention, not runtime success. Mixed-origin modules require separate rights review, which is recorded in `PROVENANCE_REVIEW.md`.

## 5. Verification and release gates

**Previously verified:** independent React production build, original frontend feature/math/PDF tests, 17 preview/full technique routes, real local V2 inference, both Mac architecture builds, hosted source/asset/photograph/depth/anaglyph smoke tests.

**New checks committed, result pending:** 17-technique/workspace accounting, 25-source comparison gate, and 98-file historical-path gate. Do not mark them passed until GitHub Actions confirms.

**Not yet verified:** actual browser model inference on target devices, full visual parity, iOS Safari interactions, print calibration, physical phantogram and View-Master results, long real-image batches, and complete optional V3 runtime behavior.

## Conclusion

**Every feature in the documented Legacy technique/workspace/capability inventory has an identified Independent implementation and an explicit evidence level.** No known catalogued feature is currently marked as lacking an implementation destination. This is an *accounting conclusion*, not a claim of identical behavior or perfect software. New findings from historical chats, user testing, or source inspection must be added to this ledger and its tests.
