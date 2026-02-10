import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

class AnimationManager {
  private _animation: number | null = null
  private callback: () => void
  private lastFrame = -1
  private frameTime = 1000 / 30

  constructor(callback: () => void, fps = 30) {
    this.callback = callback
    this.frameTime = 1000 / fps
  }

  updateFPS(fps: number) {
    this.frameTime = 1000 / fps
  }

  start() {
    if (this._animation != null) return
    this._animation = requestAnimationFrame(this.update)
  }

  pause() {
    if (this._animation == null) return
    this.lastFrame = -1
    cancelAnimationFrame(this._animation)
    this._animation = null
  }

  private update = (time: number) => {
    const { lastFrame } = this
    let delta = time - lastFrame
    if (this.lastFrame === -1) {
      this.lastFrame = time
    } else {
      while (delta >= this.frameTime) {
        this.callback()
        delta -= this.frameTime
        this.lastFrame += this.frameTime
      }
    }
    this._animation = requestAnimationFrame(this.update)
  }
}

type Quality = "low" | "medium" | "high"

const FALLBACK_ORDER: Record<Quality, Quality[]> = {
  low: ["low", "high", "medium"],
  medium: ["medium", "high", "low"],
  high: ["high", "low", "medium"],
}

/**
 * Resolves the base URL for frame files by probing quality subfolders
 * and falling back to a flat folder structure.
 * Returns { baseUrl, isFlat } or null if nothing was found.
 */
async function resolveFrameSource(
  frameFolder: string,
  quality: Quality,
  firstFrameFile: string
): Promise<{ baseUrl: string; isFlat: boolean } | null> {
  const fallbackQualities = FALLBACK_ORDER[quality]

  for (const candidate of fallbackQualities) {
    try {
      const probeUrl = `/${frameFolder}/${candidate}/${firstFrameFile}`
      const probeResponse = await fetch(probeUrl)
      if (probeResponse.ok) {
        if (candidate !== quality) {
          console.warn(
            `ASCIIAnimation: quality "${quality}" not found in "${frameFolder}", falling back to "${candidate}"`
          )
        }
        return { baseUrl: `/${frameFolder}/${candidate}`, isFlat: false }
      }
    } catch {
      // continue to next candidate
    }
  }

  // Try flat folder structure (legacy)
  try {
    const legacyProbe = await fetch(`/${frameFolder}/${firstFrameFile}`)
    if (legacyProbe.ok) {
      console.warn(
        `ASCIIAnimation: no quality subfolders found in "${frameFolder}", using flat folder structure`
      )
      return { baseUrl: `/${frameFolder}`, isFlat: true }
    }
  } catch {
    // no legacy frames either
  }

  return null
}

interface ASCIIAnimationProps {
  frames?: string[]
  className?: string
  fps?: number
  colorOverlay?: boolean
  frameCount?: number
  frameFolder?: string
  textSize?: string
  showFrameCounter?: boolean
  quality?: Quality
  ariaLabel?: string
  lazy?: boolean
  color?: string
  gradient?: string
}

export default function ASCIIAnimation({
  frames: providedFrames,
  className = "",
  fps = 24,
  frameCount = 60,
  frameFolder = "frames",
  textSize = "text-xs",
  showFrameCounter = false,
  ariaLabel,
  quality = "medium",
  lazy = true,
  color,
  gradient,
}: ASCIIAnimationProps) {
  const [frames, setFrames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const frameCounterRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [scaled, setScaled] = useState(false)

  // Direct DOM refs for animation — bypasses React re-renders
  const currentFrameRef = useRef(0)
  const framesRef = useRef<string[]>([])

  // Keep framesRef in sync with state
  useEffect(() => {
    framesRef.current = frames
  }, [frames])

  // Track whether the full frame set has been loaded (or is loading)
  const fullLoadTriggered = useRef(false)
  // Store the resolved base URL so phase 2 doesn't re-probe
  const resolvedSource = useRef<{ baseUrl: string; isFlat: boolean } | null>(null)

  const animationManager = useMemo(
    () =>
      new AnimationManager(() => {
        const f = framesRef.current
        if (f.length === 0) return
        const nextFrame = (currentFrameRef.current + 1) % f.length
        currentFrameRef.current = nextFrame

        // Direct DOM write — no React re-render
        if (preRef.current) {
          preRef.current.textContent = f[nextFrame]
        }
        if (frameCounterRef.current) {
          frameCounterRef.current.textContent = `Frame: ${nextFrame + 1}/${f.length}`
        }
      }, fps),
    [fps]
  )

  const frameFiles = useMemo(
    () =>
      Array.from(
        { length: frameCount },
        (_, i) => `frame_${String(i + 1).padStart(5, "0")}.txt`
      ),
    [frameCount]
  )

  // Load all remaining frames (phase 2)
  const loadAllFrames = useCallback(async () => {
    if (fullLoadTriggered.current) return
    fullLoadTriggered.current = true

    const source = resolvedSource.current
    if (!source) return

    try {
      const framePromises = frameFiles.map(async filename => {
        const response = await fetch(`${source.baseUrl}/${filename}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filename}: ${response.status}`)
        }
        return await response.text()
      })

      const loadedFrames = await Promise.all(framePromises)
      setFrames(loadedFrames)
      currentFrameRef.current = 0
    } catch (error) {
      console.error("Failed to load ASCII frames:", error)
    } finally {
      setIsLoading(false)
    }
  }, [frameFiles])

  // Phase 1: Load the first frame (preview) immediately on mount
  useEffect(() => {
    fullLoadTriggered.current = false
    resolvedSource.current = null

    const loadPreview = async () => {
      if (providedFrames) {
        setFrames(providedFrames)
        setIsLoading(false)
        fullLoadTriggered.current = true
        return
      }

      const source = await resolveFrameSource(frameFolder, quality, frameFiles[0])
      if (!source) {
        console.error(
          `ASCIIAnimation: could not find frames in any quality folder or flat structure for "${frameFolder}"`
        )
        setIsLoading(false)
        return
      }

      resolvedSource.current = source

      // Fetch only the first frame as a preview
      try {
        const response = await fetch(`${source.baseUrl}/${frameFiles[0]}`)
        if (!response.ok) throw new Error(`Failed to fetch preview frame`)
        const firstFrame = await response.text()
        setFrames([firstFrame])
        currentFrameRef.current = 0
      } catch (error) {
        console.error("Failed to load preview frame:", error)
      }

      // If not lazy, immediately load all frames
      if (!lazy) {
        await loadAllFrames()
      } else {
        // Preview is loaded, stop showing spinner
        setIsLoading(false)
      }
    }

    loadPreview()
  }, [providedFrames, frameCount, frameFolder, quality, lazy, frameFiles, loadAllFrames])

  // IntersectionObserver: triggers lazy load + controls playback
  useEffect(() => {
    if (frames.length === 0 || !containerRef.current) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Trigger lazy load of remaining frames on first intersection
            if (lazy && !fullLoadTriggered.current) {
              loadAllFrames()
            }
            if (!reducedMotion) {
              animationManager.start()
            }
          } else {
            animationManager.pause()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      animationManager.pause()
    }
  }, [animationManager, frames.length, lazy, loadAllFrames])

  // Handle resize and scaling
  useLayoutEffect(() => {
    if (!containerRef.current || !preRef.current || frames.length === 0) return

    const updateScale = () => {
      const container = containerRef.current
      const content = preRef.current
      if (!container || !content) return

      const availableWidth = container.clientWidth
      const availableHeight = container.clientHeight
      const naturalWidth = content.scrollWidth
      const naturalHeight = content.scrollHeight

      if (naturalWidth === 0 || naturalHeight === 0) return

      const newScale = Math.min(
        availableWidth / naturalWidth,
        availableHeight / naturalHeight
      )

      setScale(newScale * 0.95)

      // First measurement done — safe to reveal
      if (!scaled) setScaled(true)
    }

    updateScale()

    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [frames, quality, scaled])

  if (isLoading && frames.length === 0) {
    return (
      <div className={`flex items-center justify-center w-full h-full ${className}`}>
        <svg
          className="animate-spin h-8 w-8 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    )
  }

  if (!frames.length) {
    return (
      <div className={`overflow-hidden whitespace-pre font-mono ${className}`}>
        No frames loaded
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full flex items-center justify-center bg-background text-foreground ${className}`}
      {...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : {})}
    >
      {showFrameCounter && (
        <div
          ref={frameCounterRef}
          className="absolute top-2 left-2 z-10 text-primary-foreground bg-primary/50 px-2 py-1 rounded text-xs"
        >
          Frame: {currentFrameRef.current + 1}/{frames.length}
        </div>
      )}
      <pre
        ref={preRef}
        className={`leading-none origin-center ${textSize}`}
        style={{
          transform: `scale(${scale})`,
          opacity: scaled ? 1 : 0,
          transition: "opacity 0.5s ease-in",
          ...(gradient
            ? {
              background: gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }
            : color
              ? { color }
              : {}),
        }}
      >
        {frames[currentFrameRef.current]}
      </pre>
    </div>
  )
}
