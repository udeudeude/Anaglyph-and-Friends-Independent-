// Exhaustive *declared* Legacy feature-accounting gate.
// This proves that every inventoried technique/workspace has a destination and
// evidence. It does not pretend to prove visual or physical equivalence.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = p => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const root = JSON.parse(read('../../docs/TECHNIQUE_INVENTORY.json'));
const original = read('./techniques.ts');
const output = read('./techniqueOutput.ts');
const editor = read('./AnaglyphEditor.tsx');
const app = read('./App.tsx');
const backend = read('../../backend/app.py');
const inventory = root.techniques;
assert.equal(inventory.length, 17, 'The Legacy catalog has 17 techniques');
const ids = inventory.map(x => x.id);
assert.equal(new Set(ids).size, 17, 'Technique identifiers must be unique');
const direct = ['anaglyph','parallel','cross','topbottom','halfsbs','rowinterlaced','columninterlaced','checkerboard'];
for (const {id, label, preview, full} of inventory) {
  assert.ok(original.includes("'"+id+"'"), 'Missing original technique: '+id);
  assert.ok(editor.includes('techniqueInfo') && editor.includes('TechniqueControls'), 'Technique controls not wired');
  assert.ok(output.includes("'"+id+"'"), 'Output recipe missing '+id);
  assert.ok(preview.includes('scope=preview') && full.includes('scope=full'), 'Missing preview/full contract: '+id);
  const route = direct.includes(id) ? '/output/' : '/special/';
  assert.ok(preview.includes(route), 'Unexpected output route: '+id);
  assert.ok(label, 'Technique missing display label: '+id);
}
const workspaces = [
 ['3D Studio','./AnaglyphEditor.tsx','<AnaglyphEditor'],
 ['Single-image upload','./ImageUpload.tsx','<ImageUpload'],
 ['Stereo pair upload','./StereoPairUpload.tsx','<StereoPairUpload'],
 ['Stereo pair editor','./StereoPairEditor.tsx','<StereoPairEditor'],
 ['View-Master','./ViewMasterBuilder.tsx','<ViewMasterBuilder'],
 ['Polarized projection','./PolarizedProjection.tsx','<PolarizedProjection'],
 ['Phantogram','./PhantogramBuilder.tsx','<PhantogramBuilder'],
 ['Color reveal','./ColorRevealBuilder.tsx','<ColorRevealBuilder'],
 ['Layered composite','./LayeredCompositeBuilder.tsx','<LayeredCompositeBuilder'],
 ['Layered transparency','./LayeredTransparencyBuilder.tsx','<LayeredTransparencyBuilder'],
 ['Print calibration','./PrintCalibrationBuilder.tsx','<PrintCalibrationBuilder'],
 ['Print page','./PrintPageBuilder.tsx','<PrintPageBuilder'],
];
for (const [name, file, mounted] of workspaces) {
  assert.ok(read(file).length > 100, 'Missing workspace source: '+name);
  assert.ok(app.includes(mounted), 'Workspace not mounted: '+name);
}
const capabilities = [
 ['Automatic V2 AI depth','./browserDepth.ts','depth-estimation'],
 ['Optional V3 depth','./browserDepthV3.ts','generateV3Depth'],
 ['Depth editing','./ImageUpload.tsx','depth'],
 ['Screen-depth selection','./screenDepth.ts','screenDepth'],
 ['Stereo visibility and repair','../../backend/stereo_renderer.py','render_view'],
 ['Batch queue and folders','./batchProcessing.ts','BatchInput'],
 ['Streaming ZIP','./batchZip.ts','Zip'],
 ['View-Master PDF','./viewMasterPdf.ts','downloadViewMasterPdf'],
 ['Layered transparency PDF','./layeredTransparencyPdf.ts','pdf'],
 ['Ground-plane reference PDF','./groundPlaneReference.ts','Pdf'],
 ['Phantogram mesh projection','./modelPhantogram.ts','renderModelPhantogram'],
 ['Phantogram diagnostic sheet','./phantogramDiagnosticSheet.ts','renderPhantogramDiagnosticSheet'],
 ['Touch-friendly sheet scrubbing','./LayeredTransparencyBuilder.tsx','transparencySheetSlider'],
 ['Mobile View-Master exit','./ViewMasterBuilder.tsx','vmBackToStudio'],
 ['Physical print calibration','./PrintCalibrationBuilder.tsx','PrintCalibrationBuilder'],
 ['Source archive','../../backend/production.py','source'],
];
for (const [name, file, marker] of capabilities) {
  assert.ok(read(file).includes(marker), 'Unaccounted capability: '+name);
}
assert.ok(backend.includes('phantogram'), 'Phantogram endpoint absent');
console.log('ACCOUNTED: '+ids.length+' techniques, '+workspaces.length+' mounted workspaces, '+capabilities.length+' cross-cutting capabilities');
console.log('This is a source/route accounting gate, not real-device or visual parity certification.');
