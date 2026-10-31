# Preservation contract: Legacy to Independent Edition

This document records a non-negotiable project requirement confirmed by the owner on 2026-10-30.

## Central distinction

**Replace Huynh-derived implementation, not our subsequent original work.** The Legacy Edition is a functional baseline, not a disposable prototype. Its location in a fork does not make every later addition inherited. Establish provenance at the component/file level before replacing it.

## Preserve and carry forward

- Depth Anything V2 automatic image-to-depth inference, with browser inference, local/offline inference, device fallback, and supported optional models.
- The complete 17-technique catalog and all existing controls and defaults.
- Depth editing, importing, inversion, regeneration, painting/selection, and screen-depth selection.
- Stereo synthesis improvements: fractional-pixel displacement, occlusion handling, background-aware repairs, diagnostics.
- Batch photo processing, folder hierarchy, queue controls, pause/resume, retries, manifests, ZIP export, and optional depth-map inclusion.
- Full-resolution local exports, quality controls, individual image exports, and print-oriented formats.
- View-Master, lenticular, stereograms, phantograms, stereo viewers, animations, and other specialist outputs.
- UI/UX improvements, mobile and desktop behavior, settings persistence, accessibility, and application-specific details.
- Working Mac desktop distribution and browser-hosted application, as supported by their respective environments.
- Regression tests, documented decisions, backlog, and known limitations.

This list is a floor, not an exhaustive feature inventory. The authoritative baseline is the latest working Legacy Edition plus its tests, project documentation, and development history.

## Implementation rules

1. Before altering a component, compare the Legacy Edition and the upstream Senacen/Anaglyph-AI version. Record what was inherited, what was independently developed later, and what requires permission or reimplementation.
2. **Port original post-fork work where provenance permits.** Do not rewrite original work just because it resides in the Legacy repository.
3. For inherited upstream code, independently implement its required behavior without copying protected expression.
4. Retain the original depth-estimation capability. A synthetic gradient or user-supplied depth map is not an adequate substitute for AI inference.
5. Preserve working Legacy Edition deployments and releases unchanged until the owner approves a tested successor.
6. Require functional and visual regression tests for each migration. Missing capabilities are blockers, not acceptable simplifications.
7. Track features and provenance in a migration matrix: legacy location, origin, independent destination, test coverage, parity status.
8. Do not claim feature parity or readiness until verified on real photographs and target devices.

## Current status

The Independent Edition has an early browser prototype, **not** feature parity. The existing Legacy Edition remains the source of truth for functionality. Continue development by auditing and migrating the original post-fork contributions rather than replacing them wholesale.
