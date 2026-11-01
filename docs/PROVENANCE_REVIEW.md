# Provenance review — 2026-10-31

Pinned Legacy baseline: c4e698d2cf4610964408c0ff69a71f8735d406e8. Inherited ancestor inspected in its full Git history: c13f1889997ca5a994b0781575d355fa3f610e2e (Duy Huynh). The current Senacen upstream tree b75e11e199dd2401e21b9d8e4f730d80936c7d15 was separately enumerated. The working Legacy repository, hosting and downloads are unchanged.

The migration uses git log --follow, original addition commits, git blame and source comparison, not path absence alone. docs/PROVENANCE.json records per-file first commits and exact Legacy blobs. The specialist components and their dependencies/styles are original post-fork code. Backend origin examples: stereo_renderer.py 9ded360238; technique_generator.py 0ff809b; stereo_formats.py e43020b; phantogram_generator.py f1aad56; depth_sources.py 5ba0359. TechniqueControls originated at dfd7f64; BatchWorkspace at 44965e8d; stereoPairRender at a0dd6f2.

## Mixed files

- App.tsx: 64/74 lines attributed to owner, 10 inherited lines consisting of imports, two trivial state declarations and component scaffolding. Preserve original post-fork workspace/navigation JSX; replace the component declaration and inherited state declarations. Imports necessary for module linkage are retained.
- AnaglyphEditor.tsx: 554/555 lines attributed to owner. Only the CSS import is inherited. Preserve the original post-fork editor.
- ImageUpload.tsx: 692/716 lines attributed to owner. Remaining lines are four simple hook declarations, a CSS import, blank lines and delimiters. All original image upload, random image, resize and depth request implementations were already replaced. Retain the owner's implementation and replace the inherited hook declarations.
- main.tsx: owner-authored migration/autosubmit behavior, with standard React createRoot/import scaffolding. Retain functionality. styles/index.css and index.html are independently supplied. App/editor/upload styles were fully rewritten after the fork.
- backend/app.py: 1113/1123 lines attributed to owner. Trace review also identified structural inheritance in upload/session lifecycle despite line reattribution. Independently replace session initialization/expiry, upload route, depth read route, configuration, and inference adapter; retain post-fork session namespaces, batching, depth history, cached stereo, specialty routes and full-resolution exports.
- backend/anaglyph_generator.py is EXCLUDED. Only the original post-fork stereo methods from 9ded360238 are preserved in stereo_adapter.py. All obsolete inherited hole fillers, singleton class and demo are excluded. Optimized color mixing is independently implemented from scientific coefficients with floating-point accumulation.
- backend/depth_map_generator.py is EXCLUDED. local_depth.py independently integrates the licensed V2 Small model and published preprocessing, preserving device selection and adding inference-stage CPU retry.
- Standard Vite/TypeScript configuration is retained as functional scaffolding, with React/Vite dependencies retaining their own licenses.

## Exclusions and review limits

No inherited assets, favicon, logo, example photograph, notebook, Footer component, upstream Dockerfile or old renderer are included. Original creative artwork is not relicensed by this application grant. Git authorship is provenance evidence, not a legal opinion. Dependency notices and the exact downloaded model revisions must stay with distributions. Optional V3 and physical viewer outputs still require the behavioral verification described in QA_CHECKLIST.md. Automated similarity screening and runtime tests supplement, not replace, this review.
