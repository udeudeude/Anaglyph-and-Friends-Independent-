# Anaglyph & Friends: Independent Edition

A new implementation of the image-to-stereo application, developed separately from the unlicensed Anaglyph AI fork. The existing [Legacy Edition](https://github.com/udeudeude/Anaglyph-and-Friends) remains untouched.

## Current milestone

A standalone browser prototype plus a companion Python rendering API with **automatic Depth Anything V2 inference**, uploadable depth maps, convergence/disparity controls, stereo viewing modes, image downloads, and basic multi-image batch exports. Model inference runs in the browser using the independently published Hugging Face Transformers library and the `onnx-community/depth-anything-v2-small` model. The model is downloaded on first use; internet is required for that initial download.

**This is not yet feature parity.** Five substantial original post-fork Python modules and two regression suites have now been preserved in `backend/` (stereo rendering, output techniques, stereo formats, depth editing, and phantograms). They are not yet connected to the browser interface. The legacy application's complete 17 techniques, specialist print outputs, depth painting, and Mac offline packaging remain on the development backlog. No claim of a clean licensing audit for all future dependencies is made.

## Run

For the **preserved original renderers**, run the companion Python service from the repository root:

```sh
python3 -m pip install Flask numpy opencv-python-headless Pillow
python3 backend/server.py
```

Then open **http://127.0.0.1:8010/**. The browser performs automatic Depth Anything V2 inference; the local service receives the resulting depth map and original photograph for additional techniques. The browser-only prototype can still run without the service, but its advanced output modes require it.

Open `index.html` in a modern browser, ideally from a static web server. Because this repository is private, no public deployment has been configured. GitHub Pages availability depends on your plan. For local use, `python3 -m http.server 8000` and open `http://localhost:8000`.

## Licensing

New code in this repository is independently authored, with AGPL-3.0-or-later intended after a full audit. Model weights and third-party packages have independent licenses. Do not import code or expressive assets from the Legacy Edition.

See [the roadmap](docs/ROADMAP.md), [preservation contract](docs/PRESERVATION_CONTRACT.md), and [component migration matrix](docs/MIGRATION_MATRIX.md).
