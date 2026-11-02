# Acceptance evidence and outstanding checks (updated 2026-11-02)

See [FEATURE_ACCOUNTABILITY.md](FEATURE_ACCOUNTABILITY.md) for the complete known-feature inventory, implementation destinations, and test evidence. An accounted-for feature is not necessarily visually or physically verified.

## Previously verified in development and CI

- [x] Integrated React build and 17-technique catalog with all specialist workspaces mounted.
- [x] Automated backend preview/full output tests for all 17 technique IDs, including animated GIF frames.
- [x] Depth-map precision, convergence, stereo visibility, background repair, and retained frontend PDF/math/batch unit tests.
- [x] Pinned Depth Anything V2 Small local real-photo inference.
- [x] Intel and Apple Silicon Mac builds and frozen-app smoke tests.
- [x] Hosted health, React assets, source ZIP, image upload, float32 depth import, and anaglyph output smoke tests.
- [x] Historical provenance and mixed-file review documented in PROVENANCE.json and PROVENANCE_REVIEW.md.

## New accounting gates (committed; CI result not yet verified)

- [ ] Confirm featureAccounting.test.mjs passes: all 17 techniques, 12 workspaces, 16 capabilities.
- [ ] Confirm legacySourceParity.test.mjs passes: 25 compared modules, exact source hashes for 21 preserved files.
- [ ] Confirm historicalProvenance.test.mjs passes: 98 historical source paths mapped to current destinations.

## Remaining functional and physical acceptance

- [ ] Browser V2 inference on actual iPhone, iPad, and desktop (including GPU/WASM fallback).
- [ ] Optional V3 model download, license and real browser inference.
- [ ] Visual/interaction comparison with Legacy at representative desktop and mobile viewport sizes.
- [ ] View-Master navigation, reel fit and PDF printing on actual mobile devices.
- [ ] Layered transparency slider live scrubbing and real film-stack print registration.
- [ ] Phantogram physical viewing calibration, model geometry and print-size verification.
- [ ] Long nested batch processing, pause/resume/retry, ZIP/depth-map inclusion and memory use.
- [ ] End-to-end installation and offline model inference on user Mac hardware.
- [ ] Specialist optical glasses, lenticular lens, stereo viewer and polarized-projector tests.

**Release criterion:** Source accounting can be complete while behavioral and physical acceptance remains open. Never represent unperformed device or print tests as passed.
