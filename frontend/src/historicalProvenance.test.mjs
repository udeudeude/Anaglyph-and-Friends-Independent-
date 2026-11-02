import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const provenance=JSON.parse(readFileSync(new URL('../../docs/PROVENANCE.json',import.meta.url),'utf8'));
const root=resolve(new URL('../../',import.meta.url).pathname);
const replacements={
  'macos/Anaglyph & Friends.app/Contents/Info.plist':'macos/desktop.spec',
  'macos/Anaglyph & Friends.app/Contents/MacOS/launcher':'macos/desktop.py',
  'macos/Stop Anaglyph & Friends.app/Contents/Info.plist':'macos/desktop.spec',
  'macos/Stop Anaglyph & Friends.app/Contents/MacOS/launcher':'macos/desktop.py'
};
const missing=[];
for(const entry of provenance.files){
  assert.ok(entry.first_commit && entry.legacy_blob && entry.handling,'Missing historical provenance: '+entry.path);
  const target=replacements[entry.path]||entry.path;
  if(!existsSync(resolve(root,target)))missing.push(entry.path+' -> '+target);
}
assert.deepEqual(missing,[], 'Unaccounted historical source paths');
assert.equal(provenance.files.length,98,'Historical provenance inventory changed; review additions');
console.log('Historical source accounting passed: 98 documented paths, four retired legacy launchers explicitly mapped to independent desktop packaging.');
