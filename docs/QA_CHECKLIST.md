# Acceptance evidence

- [x] Full React application builds and all specialist components are routed.
- [x] Preserved frontend feature assertions/math/PDF/batch tests pass.
- [x] Stereo visibility, background-aware repairs and cache tests pass.
- [x] Absolute imported depth/convergence tests pass for 8-bit, 16-bit and float32.
- [x] Pinned local V2 Small weights verified; real-photo inference and stereo output executed.
- [x] Post-fork provenance reviewed with Git history and upstream comparison.
- [x] All 17 production recipe requests decoded at preview/full scope, including multi-frame GIFs.
- [ ] Separate preview deployed and its workload checked.
- [ ] Real browser V2 inference, GPU startup/inference fallback, optional V3.
- [ ] Visual comparisons and specialist workspace exports in browser.
- [ ] Mac Intel/Apple Silicon builds and native frozen smoke tests.
- [ ] iPhone/iPad real device tests; touch, download, browser memory limits.
- [ ] Print calibration and physical viewer tests with user's equipment.
- [ ] Long/nested batch test, pause/retry, ZIP/depth inclusion and memory measurements.

Record concrete results and limitations in WORK_STATE.md. The structural test suite is not an acceptance test for behavior.
