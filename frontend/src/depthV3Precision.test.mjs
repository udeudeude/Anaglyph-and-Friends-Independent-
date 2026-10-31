import assert from 'node:assert/strict'
import { v3NearValues } from './depthV3Math.ts'
import { encodeDepthNpy } from './depthPrecision.ts'

const raw = Float32Array.from({ length: 4096 }, (_, i) => i / 4096)
const near = v3NearValues(raw, 64, 64)
assert.equal(new Set(near).size, 4096, 'V3 depth must retain more than 256 levels')
assert.equal(near[0], 1)
assert.equal(near[4095], 0)
assert.deepEqual([...v3NearValues([5, 5, 5, 5], 2, 2)], [.5, .5, .5, .5])
assert.throws(() => v3NearValues([NaN], 1, 1), /non-finite/)
assert.throws(() => v3NearValues([1, 2], 1, 1), /shape/)
const bytes = encodeDepthNpy(near, 64, 64)
const view = new DataView(bytes.buffer)
const offset = 10 + view.getUint16(8, true)
assert.equal(view.getFloat32(offset, true), near[0])
assert.equal(view.getFloat32(offset + 4 * 4095, true), near[4095])
console.log('V3 near-depth orientation, precision, and float32 transport passed')
