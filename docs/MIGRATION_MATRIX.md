# Preservation and provenance migration matrix

**Baseline:** `udeudeude/Anaglyph-and-Friends` (Legacy Edition).
**Upstream comparison:** `Senacen/Anaglyph-AI` default branch, as inspected 2026-10-30.
**Target:** this Independent Edition repository, with unrelated Git history.

The user explicitly requires preservation of all original post-fork work and the full product experience. This is a *working provenance screen*, not final legal clearance. Absence of an upstream path is strong evidence of post-fork addition, but does not establish ownership of every embedded dependency or asset.

| Component | Upstream same path | Independent destination | Status |
|---|---|---|---|
| Subpixel stereo rendering / occlusion repair | Not present | `backend/stereo_renderer.py` | Preserved source; tests pending |
| Multi-technique output generator | Not present | `backend/technique_generator.py` | Preserved source; tests pending |
| Stereo/anaglyph formats | Not present | `backend/stereo_formats.py` | Preserved source; integration pending |
| Depth editing, alignment, brush/selection | Not present | `backend/depth_sources.py` | Preserved source; UI pending |
| Physical phantogram projection | Not present | `backend/phantogram_generator.py` | Preserved source; tests pending |
| Technique regression suite | Not present | `backend/test_technique_generator.py` | Preserved |
| Phantogram regression suite | Not present | `backend/test_phantogram_generator.py` | Preserved |
| Automatic browser Depth Anything V2 | Independent model, original app adapter in legacy | `app.js`, `frontend/src/browserDepth.ts` | Original post-fork adapter preserved; prototype inference unverified |
| Legacy stereo generator | Substantial copied code | None | Do not port; use original renderer |
| Legacy depth wrapper | Partial shared code | None | Do not port; independently integrate licensed model |
| Legacy Flask API | Some inherited routes/helpers | `backend/server.py` | Independent render API added; incomplete parity |
| Legacy React upload/editor | Some inherited code | None | Audit and preserve independently developed features |
| Batch queue, ZIP, depth maps | Developed after fork | `frontend/src/batchProcessing.ts`; prototype partial | Original batch logic preserved; integration incomplete |
| 17 techniques, print workflows | Developed after fork | Backend API plus `frontend/src/viewMasterPdf.ts`, `phantogramDiagnosticSheet.ts`; UI incomplete | Original post-fork modules preserved; integration incomplete |
| Mac offline packaging | Developed after fork | Not yet | Preserve after provenance/dependency review |

## Additional preserved original frontend modules

`frontend/src/browserDepthV3.ts`, `frontend/src/depthGenerators.ts`, and `frontend/src/screenDepth.ts` have been preserved alongside the V2 adapter, batch, View-Master, and phantogram modules. These were absent at corresponding paths in the inspected upstream repository. They are not yet all connected to the independent application.

## Preserved original workspace components (2026-10-30)

The following ten substantial React modules have now been transferred from the Legacy Edition after confirming their exact paths are absent in the inspected Huynh upstream repository:

- `ViewMasterBuilder.tsx`: reel design and export workspace.
- `PhantogramBuilder.tsx`: perspective print workspace.
- `ColorRevealBuilder.tsx`: color-filter optical experiments.
- `LayeredCompositeBuilder.tsx`: layered composition.
- `LayeredTransparencyBuilder.tsx`: transparency output.
- `PrintCalibrationBuilder.tsx`: print calibration.
- `PrintPageBuilder.tsx`: page layout and output.
- `PolarizedProjection.tsx`: polarized projection.
- `StereoPairUpload.tsx`: stereo source intake.
- `StereoPairEditor.tsx`: stereo pair controls and editing.

**Important:** These files are preserved, not yet wired into a compiled Independent Edition React application. Their imports, supporting files, assets, and provenance require further review. Path absence alone is not a complete legal clearance.

## Release gate

The prototype is **not a replacement** until real-model inference, all techniques, original editing tools, batch exports, offline Mac packaging, and visual parity have been verified. Keep the Legacy Edition untouched.

## Follow-up provenance work

1. Verify history and authorship of each newly migrated module, plus bundled fonts/images and dependencies.
2. Port independent post-fork UI and backend work where legally clear; independently replace inherited code.
3. Reconnect preserved Python functionality to a complete application without losing AI inference.
4. Run all legacy tests plus browser/device visual acceptance checks.
5. Verify third-party model and checkpoint licenses before public release.


## Integrated 2026-10-31

The above is the pre-integration snapshot. The React application, preserved dependencies/styles and complete API are now assembled. Current file-level evidence is in PROVENANCE.json and PROVENANCE_REVIEW.md; tested status and remaining gates are in WORK_STATE.md and QA_CHECKLIST.md.
