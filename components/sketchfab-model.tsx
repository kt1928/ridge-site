"use client"

import { useEffect, useRef, useState } from "react"

// Nord color palette
const NORD_COLORS = {
  polarNight: {
    nord0: "#2E3440",
    nord1: "#3B4252",
    nord2: "#434C5E",
    nord3: "#4C566A",
  },
  snowStorm: {
    nord4: "#D8DEE9",
    nord5: "#E5E9F0",
    nord6: "#ECEFF4",
  },
  frost: {
    nord7: "#8FBCBB",
    nord8: "#88C0D0",
    nord9: "#81A1C1",
    nord10: "#5E81AC",
  },
  aurora: {
    nord11: "#BF616A",
    nord12: "#D08770",
    nord13: "#EBCB8B",
    nord14: "#A3BE8C",
    nord15: "#B48EAD",
  },
}

interface SketchfabModelProps {
  modelId: string
}

export default function SketchfabModel({ modelId }: SketchfabModelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (info: string) => {
    console.log(info)
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
  }

  useEffect(() => {
    addDebugInfo("Starting Sketchfab initialization with correct model ID...")

    // Clear any previous state
    setError(null)

    const iframe = iframeRef.current
    if (!iframe) {
      addDebugInfo("ERROR: No iframe found")
      setError("Failed to initialize viewer")
      return
    }

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      addDebugInfo("TIMEOUT: Model took too long to load")
      setError("Model loading timed out. Please try again.")
    }, 15000) // 15 seconds timeout

    // Use the exact embed URL from your updated code with autospin and autostart
    const embedUrl = `https://sketchfab.com/models/${modelId}/embed?autospin=1&autostart=1&ui_hint=0&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_fullscreen=0&ui_annotations=0&transparent=1`

    addDebugInfo(`Setting iframe src to: ${embedUrl}`)
    iframe.src = embedUrl

    // Listen for iframe load events
    const handleIframeLoad = () => {
      addDebugInfo("Iframe loaded successfully")
      clearTimeout(loadingTimeout)

      // Give it a moment to fully initialize the 3D viewer
      setTimeout(() => {
        addDebugInfo("Model should be ready now")
        // Notify parent that model is ready
        window.parent.postMessage({ action: "modelReady" }, "*")
      }, 1000) // Reduced timing since main loading covers it
    }

    const handleIframeError = () => {
      addDebugInfo("ERROR: Iframe failed to load")
      clearTimeout(loadingTimeout)
      setError("Failed to load the 3D model. Please check your internet connection.")
    }

    iframe.addEventListener("load", handleIframeLoad)
    iframe.addEventListener("error", handleIframeError)

    return () => {
      clearTimeout(loadingTimeout)
      iframe.removeEventListener("load", handleIframeLoad)
      iframe.removeEventListener("error", handleIframeError)
    }
  }, [modelId])

  return (
    <div ref={containerRef} className="relative w-full h-full" style={{ background: NORD_COLORS.polarNight.nord0 }}>
      {/* Nord-themed gradient background */}
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{
          background: `radial-gradient(circle at center, ${NORD_COLORS.polarNight.nord1} 0%, ${NORD_COLORS.polarNight.nord0} 100%)`,
        }}
      />

      {/* Error overlay */}
      {error && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-20"
          style={{
            background: `linear-gradient(135deg, ${NORD_COLORS.polarNight.nord0} 0%, ${NORD_COLORS.polarNight.nord1} 100%)`,
          }}
        >
          <div className="p-6 rounded-lg max-w-md text-center" style={{ background: NORD_COLORS.polarNight.nord1 }}>
            <h3 className="text-xl mb-2" style={{ color: NORD_COLORS.frost.nord8 }}>
              Model Loading Failed
            </h3>
            <p className="mb-4" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
              {error}
            </p>

            <div className="text-sm mb-4">
              <p className="mb-2" style={{ color: NORD_COLORS.frost.nord9 }}>
                Troubleshooting:
              </p>
              <ul className="text-left list-disc list-inside space-y-1" style={{ color: NORD_COLORS.snowStorm.nord5 }}>
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Switch to the local model if issues persist</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded transition-colors"
                style={{
                  background: NORD_COLORS.frost.nord8,
                  color: NORD_COLORS.polarNight.nord0,
                }}
              >
                Retry
              </button>
              <button
                onClick={() => window.parent.postMessage({ action: "switchToLocal" }, "*")}
                className="px-4 py-2 rounded transition-colors border"
                style={{
                  background: NORD_COLORS.polarNight.nord0,
                  color: NORD_COLORS.snowStorm.nord6,
                  borderColor: NORD_COLORS.frost.nord8,
                }}
              >
                Use Local Model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sketchfab embed wrapper - clip bottom to hide attribution bar */}
      <div
        className="absolute inset-0 z-10 overflow-hidden"
        style={{
          background: NORD_COLORS.polarNight.nord0,
          visibility: error ? "hidden" : "visible",
        }}
      >
        <div className="sketchfab-embed-wrapper w-full" style={{ height: "calc(100% + 60px)" }}>
          <iframe
            ref={iframeRef}
            title="RS LOGO v1"
            frameBorder="0"
            allowFullScreen
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
            className="w-full h-full border-0"
            style={{
              background: NORD_COLORS.polarNight.nord0,
            }}
          />
        </div>
      </div>
    </div>
  )
}
