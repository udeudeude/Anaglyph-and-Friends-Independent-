# Independent Edition parity roadmap

## Implemented (initial browser prototype)

- [x] New repository with independent Git history.
- [x] Photograph upload and automatic Depth Anything V2 depth estimation through a separately distributed Transformers runtime.
- [x] Browser CPU fallback when WebGPU startup fails.
- [x] Imported grayscale depth maps and depth preview.
- [x] Stereo projection with depth-based visibility and gap diagnostic.
- [x] Red/cyan, parallel, cross-eye, left-eye and right-eye viewing.
- [x] Disparity, convergence-plane controls, and PNG output.
- [x] Basic multi-image batch processing with individual image downloads.

## Not yet implemented or verified

- [ ] Run real-image and mobile-device tests of AI model downloads and inference.
- [ ] Validate third-party model **weights** license and packaging permissions.
- [ ] Replace nearest-pixel warp with subpixel, depth-aware splatting and background reconstruction.
- [ ] Implement the complete 17-technique catalogue from an independent feature specification.
- [ ] Depth painting, selections, undo/redo, and depth-map precision/export.
- [ ] Batch folder hierarchy, ZIP packaging, manifest, optional depth maps, pause/resume, and error recovery.
- [ ] Full-resolution local exports and offline Mac application packaging.
- [ ] Print and specialty modes: lenticular, stereograms, phantograms, View-Master, anaglyph matrices, animated outputs, and PDF layout.
- [ ] Automated visual regression fixtures, browser integration tests, accessibility, performance and licensing audit.
- [ ] Separate preview deployment and user comparison against Legacy Edition.
- [ ] AGPL-3.0-or-later grant for independently authored code after rights review.

**Do not replace the working Legacy Edition until all acceptance tests pass.**

## Implementation boundaries

No source code or creative assets from the Huynh fork are imported. Functional behavior is a specification, not a license to copy implementation. Model libraries, weights, and external packages retain their own licenses.
