# Exact technique-parity contract

Source of truth: original post-fork `frontend/src/techniques.ts`, now preserved in this repository. The legacy studio has **17** named techniques, with distinct settings and output semantics.

| Legacy ID | Label | Current independent status |
| --- | --- | --- |
| anaglyph | Anaglyph | Basic red/cyan only; custom filters and print profiles missing |
| parallel | Parallel | Basic |
| cross | Cross-Eyed | Basic |
| chromadepth | ChromaDepth | Preserved Python engine, incomplete UI |
| cardboard | Cardboard / Phone Viewer | Preserved Python engine, incomplete UI |
| stereoscope | Traditional Stereoscope Card | Preserved Python engine under a different ID; settings missing |
| mirror | Single-Mirror Stereoscope | Preserved Python engine under a different ID; settings missing |
| wiggle | Wiggle-gram | GIF supported, defaults and controls not matched |
| pulfrich | Pulfrich Motion 3D | GIF supported, defaults and controls not matched |
| randomdot | Random-Dot Stereogram | Combined under generic autostereogram; distinct mode missing |
| pattern | Pattern Stereogram | Combined under generic autostereogram; custom pattern missing |
| lenticular | Lenticular 3D | Preserved Python engine; printing/calibration controls missing |
| topbottom | Top / Bottom Stereo | **Missing** |
| halfsbs | Half-Width Side-by-Side | **Missing** |
| rowinterlaced | Row-Interlaced | Preserved Python engine |
| columninterlaced | Column-Interlaced | Preserved Python engine |
| checkerboard | Checkerboard Stereo | Preserved Python engine |

**Important:** The Independent Edition's current API lists 16 modes, but that is *not* equivalent to the Legacy Edition's 17 techniques. The API includes extra single-eye outputs, combines distinct stereogram modes, and omits two digital formats. Counts must not be substituted for feature equivalence.

The original technique settings, labels, defaults, and descriptions are preserved in `frontend/src/techniques.ts`. Before release, test all 17 legacy IDs, their options, preview behavior, and export formats against the Legacy Edition. This is a blocking acceptance requirement.
