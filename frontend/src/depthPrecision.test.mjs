import assert from 'node:assert/strict'
import { normalizedPrediction, encodeDepthNpy } from './depthPrecision.ts'
import { writeFileSync } from 'node:fs'
const values = Float32Array.from({length: 4096}, (_, i) => 50 + i / 4096)
const result = normalizedPrediction(values)
assert.equal(new Set(result).size, 4096, 'AI depth must retain more than 256 levels')
assert.deepEqual([...normalizedPrediction([7,7,7])], [.5,.5,.5])
assert.deepEqual([...normalizedPrediction([10,20,30])], [0,.5,1])
assert.throws(() => normalizedPrediction([NaN]), /non-finite/)
const narrow = new Float32Array([.49, .5, .51, .501])
const bytes = encodeDepthNpy(narrow,2,2)
const view = new DataView(bytes.buffer), offset = 10 + view.getUint16(8,true)
for(let i=0;i<4;i++) assert.equal(view.getFloat32(offset+i*4,true),narrow[i])
if(process.env.AAF_DEPTH_FIXTURE) writeFileSync(process.env.AAF_DEPTH_FIXTURE,bytes)
console.log('Float32 depth, narrow-range preservation, constant predictions and NPY transport passed')
