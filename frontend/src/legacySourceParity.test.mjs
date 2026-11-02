import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const manifest=JSON.parse(readFileSync(new URL('../../docs/LEGACY_SOURCE_PARITY.json',import.meta.url),'utf8'));
const entries=manifest.modules;
assert.equal(entries.length,25,'Expected 25 compared source modules');
for(const item of entries){
  const content=readFileSync(new URL('../../'+item.path,import.meta.url));
  const gitBlob=createHash('sha1').update('blob '+content.length+'\\0').update(content).digest('hex');
  if(item.handling==='exact'){
    assert.ok(gitBlob.startsWith(item.legacy_sha_prefix),'Original post-fork source changed unexpectedly: '+item.path);
  }else{
    assert.equal(item.handling,'adapted','Unrecognized provenance status');
    assert.ok(content.length>100,'Adapted module missing: '+item.path);
  }
}
console.log('Preservation accounting: '+entries.filter(x=>x.handling==='exact').length+' exact Git blobs; '+entries.filter(x=>x.handling==='adapted').length+' documented adaptations');
