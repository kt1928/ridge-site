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
  const [error, setError] = useState<string | null>(null)

  const embedUrl = `https://sketchfab.com/models/${modelId}/embed?autostart=1&autospin=0.25&preload=1&dnt=1&ui_hint=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_help=0&ui_settings=0&ui_fullscreen=0&ui_annotations=0&ui_watermark=0&ui_watermark_link=0`

  useEffect(() => {
    // Clear any previous state
    setError(null)

    const iframe = iframeRef.current
    if (!iframe) {
      setError("Failed to initialize viewer")
      return
    }

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      setError("Model loading timed out. Please try again.")
    }, 20000)

    // Listen for iframe load events
    const handleIframeLoad = () => {
      clearTimeout(loadingTimeout)
    }

    const handleIframeError = () => {
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
  }, [])

  return (
    <div className="relative w-full h-full" style={{ background: NORD_COLORS.polarNight.nord0 }}>
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
        <iframe
          ref={iframeRef}
          title="RS LOGO v1"
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          loading="eager"
          fetchPriority="high"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
            background: NORD_COLORS.polarNight.nord0,
          }}
        />
      </div>
    </div>
  )
}
