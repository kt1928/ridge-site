"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { ArrowRight } from "lucide-react"
import SketchfabModel from "@/components/sketchfab-model"
import SimpleScene from "@/components/simple-scene"

// Nord color palette (kept to preserve branding)
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

export default function Home() {
  const [useSketchfab, setUseSketchfab] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Extend scroll only on landing page (used by ScrollTrigger in 3D model)
    document.body.dataset.scrollExtended = "true"
    return () => {
      delete document.body.dataset.scrollExtended
    }
  }, [])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => setIsLoading(false), 450)
          return 100
        }
        const increment = Math.random() * 15 + 5
        return Math.min(prev + increment, 100)
      })
    }, 200)

    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === "switchToLocal") setUseSketchfab(false)
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-nord-0">
          <div className="w-[22rem] max-w-[85vw] animate-in">
            <div className="mb-4 text-center">
              <div className="text-xs font-medium tracking-wide text-nord-5">RIDGE</div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-nord-6">Loading experience</div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-nord-1/70">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%`, background: NORD_COLORS.frost.nord8 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 px-4 pt-4 sm:px-8 sm:pt-6">
        <div className="pointer-events-auto glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-nord-6 sm:text-2xl">Welcome</h1>
            <p className="mt-0.5 text-sm text-nord-5 text-balance">Interactive 3D portal. Explore projects and the map.</p>
          </div>

          <nav className="flex items-center gap-3">
            <a
              href="/map"
              className="rounded-xl px-4 py-2 text-sm font-medium text-nord-6/90 transition-colors hover:bg-nord-3/20 focus-visible:focus-ring"
            >
              Map
            </a>
            <a
              href="/project1"
              className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:translate-y-[-1px] focus-visible:focus-ring"
              style={{
                background: NORD_COLORS.frost.nord8,
                color: NORD_COLORS.polarNight.nord0,
                boxShadow: `0 10px 30px ${NORD_COLORS.frost.nord8}33`,
              }}
            >
              Enter
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </nav>
        </div>
      </header>

      {/* Status */}
      <div className="absolute bottom-6 left-4 z-10 sm:bottom-8 sm:left-8">
        <div className="glass rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: useSketchfab ? NORD_COLORS.aurora.nord14 : NORD_COLORS.frost.nord10 }}
            />
            <span className="text-xs font-medium text-nord-6/90">
              {useSketchfab ? "Sketchfab Model (RS Logo)" : "Local Model"}
            </span>
          </div>
        </div>
      </div>

      {/* 3D */}
      <div className="h-full w-full">
        {useSketchfab ? (
          <SketchfabModel modelId="37c146c94b1e4d28b34d2d428247e5c0" />
        ) : (
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <SimpleScene />
          </Canvas>
        )}
      </div>
    </main>
  )
}
