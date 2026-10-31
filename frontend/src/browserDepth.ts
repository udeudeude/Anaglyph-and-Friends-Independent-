import { AUTOMATIC_DEPTH_GENERATOR, resolveDepthGenerator } from './depthGenerators'
import type { DepthGeneratorSelection } from './depthGenerators'

import { normalizedPrediction, encodeDepthNpy } from './depthPrecision'
const MODEL_REVISION = '4472b7362082ad9968fee890ca0f1e5aca36b93d'
const MODEL_ID = 'onnx-community/depth-anything-v2-small'

type Progress = (message: string) => void
type ModelProgress = { status?: string; progress?: number }
type DepthPrediction = { dims: number[]; data: Float32Array; dispose?: () => void }
type DepthResult = { predicted_depth: DepthPrediction }
type DepthEstimator = (source: string) => Promise<DepthResult>
type TransformersModule = {
    pipeline: (task: string, model: string, options: {
        device?: string
        dtype?: string
        revision?: string
        progress_callback: (info: ModelProgress) => void
    }) => Promise<DepthEstimator>
}

export type BrowserDepthFailureKind =
    | 'library-download'
    | 'model-download'
    | 'model-startup'
    | 'inference'
    | 'output'

export type BrowserDepthFailureInfo = {
    kind: BrowserDepthFailureKind
    title: string
    detail: string
    technical: string
}

export class BrowserDepthError extends Error {
    kind: BrowserDepthFailureKind
    cause?: unknown

    constructor(kind: BrowserDepthFailureKind, message: string, cause?: unknown) {
        super(message)
        this.name = 'BrowserDepthError'
        this.kind = kind
        this.cause = cause
    }
}

let estimatorPromise: Promise<DepthEstimator> | null = null
let estimatorEngine = ''

const errorText = (error: unknown) => {
    if (error instanceof Error) return error.message || error.name
    if (typeof error === 'string') return error
    try {
        return JSON.stringify(error)
    } catch {
        return String(error)
    }
}

const looksLikeDownloadFailure = (error: unknown) => {
    const text = errorText(error).toLowerCase()
    return [
        'failed to fetch',
        'fetch failed',
        'network',
        'networkerror',
        'load failed',
        'loading chunk',
        'dynamically imported module',
        'status 4',
        'status 5',
        '404',
        '403',
        'cdn.jsdelivr',
        'huggingface',
        'resolve/main',
        'could not locate',
        'could not load',
        'download',
    ].some(fragment => text.includes(fragment))
}

export function describeBrowserDepthError(error: unknown): BrowserDepthFailureInfo {
    const technical = error instanceof BrowserDepthError && error.cause
        ? `${error.message}: ${errorText(error.cause)}`
        : errorText(error)
    const kind: BrowserDepthFailureKind = error instanceof BrowserDepthError
        ? error.kind
        : looksLikeDownloadFailure(error)
            ? 'model-download'
            : 'inference'

    if (kind === 'library-download') {
        return {
            kind,
            title: 'Couldn’t load the browser AI',
            detail: 'The AI code could not be downloaded. Check the connection or a content blocker, then retry.',
            technical,
        }
    }
    if (kind === 'model-download') {
        return {
            kind,
            title: 'Couldn’t download the AI depth model',
            detail: 'The source image is still loaded. A stable connection is especially important the first time this browser loads the selected model.',
            technical,
        }
    }
    if (kind === 'model-startup') {
        return {
            kind,
            title: 'The AI depth model couldn’t start',
            detail: 'WebGPU and the browser CPU fallback were unable to start the model. Retrying may help; if it repeats, this browser or device may be the issue.',
            technical,
        }
    }
    if (kind === 'output') {
        return {
            kind,
            title: 'Depth was calculated, but its image could not be created',
            detail: 'The model ran, but the browser could not convert its result into a usable depth map. Retry once; if it repeats, the technical details can help diagnose it.',
            technical,
        }
    }
    return {
        kind,
        title: 'The AI model loaded, but depth calculation failed',
        detail: 'This is later than a model-download failure. Retry once; if it repeats on the same image, import a depth map while we diagnose the browser/device issue.',
        technical,
    }
}

async function createEstimator(progress?: Progress, forceCpu = false) {
    if (estimatorPromise) return estimatorPromise
    estimatorPromise = (async () => {
        progress?.('Loading browser AI… first use may need a one-time model download')
        let transformers: TransformersModule
        try {
            const runtime = await import('@huggingface/transformers')
            runtime.env.allowLocalModels = false
            transformers = runtime as unknown as TransformersModule
        } catch (error) {
            throw new BrowserDepthError('library-download', 'Failed to download the browser AI library', error)
        }

        progress?.('Loading Depth Anything V2 model…')
        const hasWebGpu = !forceCpu && typeof navigator !== 'undefined' && 'gpu' in navigator
        let webGpuError: unknown = null
        if (hasWebGpu) {
            try {
                estimatorEngine = 'WebGPU'
                return await transformers.pipeline('depth-estimation', MODEL_ID, {
                    device: 'webgpu',
                    dtype: 'q4f16',
                    revision: MODEL_REVISION,
                    progress_callback: (info: ModelProgress) => {
                        if (info?.status === 'progress' && typeof info.progress === 'number') {
                            progress?.(`Loading AI model… ${Math.round(info.progress)}%`)
                        }
                    },
                })
            } catch (error) {
                webGpuError = error
                console.warn('WebGPU depth model failed; falling back to browser CPU', error)
            }
        }

        estimatorEngine = 'browser CPU'
        progress?.(hasWebGpu ? 'WebGPU unavailable here · trying browser CPU…' : 'Starting browser CPU depth model…')
        try {
            return await transformers.pipeline('depth-estimation', MODEL_ID, {
                device: 'wasm', dtype: 'q8', revision: MODEL_REVISION,
                progress_callback: (info: ModelProgress) => {
                    if (info?.status === 'progress' && typeof info.progress === 'number') {
                        progress?.(`Loading AI model… ${Math.round(info.progress)}%`)
                    }
                },
            })
        } catch (error) {
            const combined = webGpuError
                ? `WebGPU: ${errorText(webGpuError)}; CPU: ${errorText(error)}`
                : errorText(error)
            const kind: BrowserDepthFailureKind = looksLikeDownloadFailure(error) || looksLikeDownloadFailure(webGpuError)
                ? 'model-download'
                : 'model-startup'
            throw new BrowserDepthError(kind, combined, error)
        }
    })()

    try {
        return await estimatorPromise
    } catch (error) {
        estimatorPromise = null
        estimatorEngine = ''
        throw error
    }
}

function depthToNpy(prediction: DepthPrediction): Blob {
    const [height, width] = prediction.dims.slice(-2)
    const bytes = encodeDepthNpy(normalizedPrediction(prediction.data), width, height)
    return new Blob([bytes], { type: 'application/octet-stream' })
}

export const hostedBrowserDepthEnabled = () => {
    if (typeof window === 'undefined') return false
    if (import.meta.env.VITE_BROWSER_DEPTH === 'true') return true
    const host = window.location.hostname.toLowerCase()
    return !['localhost', '127.0.0.1', '::1'].includes(host)
}

export async function generateBrowserDepth(file: File, progress?: Progress, selection: DepthGeneratorSelection = AUTOMATIC_DEPTH_GENERATOR): Promise<{ file: File; engine: string; generator: string }> {
    const generator = resolveDepthGenerator(selection, 'browser')
    if (generator.id === 'depth-anything-v3-small') {
        const { generateV3Depth } = await import('./browserDepthV3')
        return generateV3Depth(file, progress, generator.name)
    }
    let estimator = await createEstimator(progress)
    progress?.(`Estimating depth on this device (${estimatorEngine})…`)
    const sourceUrl = URL.createObjectURL(file)
    try {
        let result: DepthResult
        try {
            result = await estimator(sourceUrl)
        } catch (error) {
            if (estimatorEngine === 'WebGPU') {
                progress?.('GPU inference failed · retrying on browser CPU…')
                estimatorPromise = null
                estimator = await createEstimator(progress, true)
                try { result = await estimator(sourceUrl) }
                catch (cpuError) { throw new BrowserDepthError('inference', 'GPU and CPU depth inference failed', cpuError) }
            } else {
                throw new BrowserDepthError('inference', 'Depth inference failed after the model loaded', error)
            }
        }

        let blob: Blob
        try {
            blob = depthToNpy(result.predicted_depth)
        } catch (error) {
            throw new BrowserDepthError('output', 'Depth output could not be encoded at full precision', error)
        }

        return {
            file: new File([blob], 'browser-depth-anything-v2.npy', { type: 'application/octet-stream' }),
            engine: estimatorEngine,
            generator: generator.name,
        }
    } finally {
        URL.revokeObjectURL(sourceUrl)
    }
}
