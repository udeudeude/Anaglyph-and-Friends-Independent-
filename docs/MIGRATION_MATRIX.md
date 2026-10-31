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
| Automatic browser Depth Anything V2 | Independent model, original app adapter in legacy | `app.js` | Prototype implemented; inference not verified |
| Legacy stereo generator | Substantial copied code | None | Do not port; use original renderer |
| Legacy depth wrapper | Partial shared code | None | Do not port; independently integrate licensed model |
| Legacy Flask API | Some inherited routes/helpers | None | Must independently replace inherited portions |
| Legacy React upload/editor | Some inherited code | None | Audit and preserve independently developed features |
| Batch queue, ZIP, depth maps | Developed after fork | Prototype partial | Must restore full feature parity |
| 17 techniques, print workflows | Developed after fork | Backend preserved, UI incomplete | Must restore complete UI and export integration |
| Mac offline packaging | Developed after fork | Not yet | Preserve after provenance/dependency review |

## Release gate

The prototype is **not a replacement** until real-model inference, all techniques, original editing tools, batch exports, offline Mac packaging, and visual parity have been verified. Keep the Legacy Edition untouched.

## Follow-up provenance work

1. Verify history and authorship of each newly migrated module, plus bundled fonts/images and dependencies.
2. Port independent post-fork UI and backend work where legally clear; independently replace inherited code.
3. Reconnect preserved Python functionality to a complete application without losing AI inference.
4. Run all legacy tests plus browser/device visual acceptance checks.
5. Verify third-party model and checkpoint licenses before public release.
