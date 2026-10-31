/** Normalize raw model output once, then transport lossless float32 NPY. */
export function normalizedPrediction(values: ArrayLike<number>, reverse = false): Float32Array {
    if (!values.length) throw new Error('The depth prediction is empty')
    let minimum = Infinity, maximum = -Infinity
    for (let i = 0; i < values.length; i++) {
        if (!Number.isFinite(values[i])) throw new Error('The depth prediction contains non-finite values')
        minimum = Math.min(minimum, values[i]); maximum = Math.max(maximum, values[i])
    }
    const span = maximum - minimum
    return Float32Array.from(values, value => span > 1e-12 ? (reverse ? maximum - value : value - minimum) / span : .5)
}

export function encodeDepthNpy(values: Float32Array, width: number, height: number): Uint8Array {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || values.length !== width * height) {
        throw new Error('Depth dimensions do not match the prediction')
    }
    const dictionary = `{'descr': '<f4', 'fortran_order': False, 'shape': (${height}, ${width}), }`
    const padding = (64 - ((10 + dictionary.length + 1) % 64)) % 64
    const header = new TextEncoder().encode(dictionary + ' '.repeat(padding) + '\n')
    const bytes = new Uint8Array(10 + header.length + values.length * 4)
    bytes.set([0x93, 0x4e, 0x55, 0x4d, 0x50, 0x59, 1, 0])
    const view = new DataView(bytes.buffer)
    view.setUint16(8, header.length, true)
    bytes.set(header, 10)
    for (let i = 0; i < values.length; i++) view.setFloat32(10 + header.length + i * 4, values[i], true)
    return bytes
}

/** Copy the prediction into a standalone buffer and release its model tensor. */
export function encodeDisposablePrediction(prediction: {
    dims: number[]
    data: Float32Array
    dispose?: () => void
}): Uint8Array {
    try {
        const [height, width] = prediction.dims.slice(-2)
        return encodeDepthNpy(normalizedPrediction(prediction.data), width, height)
    } finally {
        prediction.dispose?.()
    }
}
