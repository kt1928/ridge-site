"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { ArrowRight, Coffee, Home, Server } from "lucide-react"
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
          setTimeout(() => setIsLoading(false), 500)
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

  if (!mounted) {
    return null
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${NORD_COLORS.polarNight.nord0} 0%, ${NORD_COLORS.polarNight.nord1} 100%)`,
          }}
        >
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center">
              <div
                className="rounded-2xl p-4"
                style={{
                  background: `${NORD_COLORS.frost.nord8}15`,
                  border: `1px solid ${NORD_COLORS.frost.nord8}30`,
                }}
              >
                <Server size={32} style={{ color: NORD_COLORS.frost.nord8 }} />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
              Ridge Server
            </h1>
            <p className="mt-2 text-sm" style={{ color: NORD_COLORS.snowStorm.nord5 }}>
              Initializing homelab dashboard...
            </p>
          </div>
          
          <div className="w-80 max-w-md mx-auto">
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ background: NORD_COLORS.polarNight.nord2 }}
            >
              <div
                className="h-full transition-all duration-300 ease-out rounded-full"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${NORD_COLORS.frost.nord8}, ${NORD_COLORS.frost.nord7})`,
                  boxShadow: `0 0 20px ${NORD_COLORS.frost.nord8}40`,
                }}
              />
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs font-medium" style={{ color: NORD_COLORS.snowStorm.nord4 }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Navigation */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <nav className="glass rounded-2xl px-6 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="rounded-lg p-1.5"
                style={{
                  background: `${NORD_COLORS.frost.nord8}20`,
                  border: `1px solid ${NORD_COLORS.frost.nord8}30`,
                }}
              >
                <Server size={16} style={{ color: NORD_COLORS.frost.nord8 }} />
              </div>
              <span className="text-sm font-medium" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
                Ridge Server
              </span>
            </div>
            
            <div className="h-4 w-px" style={{ background: NORD_COLORS.polarNight.nord3 }} />
            
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: NORD_COLORS.snowStorm.nord5 }}
              >
                <Home size={14} />
                Dashboard
              </a>
              <a
                href="/map"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: NORD_COLORS.snowStorm.nord5 }}
              >
                <Coffee size={14} />
                Map
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                 style={{
                   background: `${NORD_COLORS.aurora.nord14}15`,
                   border: `1px solid ${NORD_COLORS.aurora.nord14}30`,
                 }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: NORD_COLORS.aurora.nord14 }} />
              <span className="text-xs font-medium" style={{ color: NORD_COLORS.aurora.nord14 }}>
                Forest Hills, Queens • NYC
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4"
                style={{ color: NORD_COLORS.snowStorm.nord6 }}>
              Welcome to
              <br />
              <span style={{ color: NORD_COLORS.frost.nord8 }}>Ridge Server</span>
            </h1>
            
            <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto"
               style={{ color: NORD_COLORS.snowStorm.nord5 }}>
              Personal homelab & portfolio showcasing self-hosted services, 
              real estate operations, and passion projects.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${NORD_COLORS.frost.nord8}, ${NORD_COLORS.frost.nord7})`,
                color: NORD_COLORS.polarNight.nord0,
                boxShadow: `0 8px 32px ${NORD_COLORS.frost.nord8}40`,
              }}
            >
              <span className="text-lg font-semibold">Explore Dashboard</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
            
            <a
              href="https://github.com/kt1928"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 glass"
              style={{ color: NORD_COLORS.snowStorm.nord6 }}
            >
              <span className="text-lg font-medium">View Projects</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="absolute bottom-8 left-8 z-10">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: NORD_COLORS.frost.nord8 }}>18</div>
              <div className="text-xs" style={{ color: NORD_COLORS.snowStorm.nord5 }}>Rental Units</div>
            </div>
            <div className="h-8 w-px" style={{ background: NORD_COLORS.polarNight.nord3 }} />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: NORD_COLORS.aurora.nord14 }}>15+</div>
              <div className="text-xs" style={{ color: NORD_COLORS.snowStorm.nord5 }}>Services</div>
            </div>
            <div className="h-8 w-px" style={{ background: NORD_COLORS.polarNight.nord3 }} />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: NORD_COLORS.aurora.nord13 }}>4</div>
              <div className="text-xs" style={{ color: NORD_COLORS.snowStorm.nord5 }}>Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Status */}
      <div className="absolute bottom-8 right-8 z-10">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ background: useSketchfab ? NORD_COLORS.aurora.nord14 : NORD_COLORS.frost.nord10 }}
            />
            <span className="text-sm font-medium" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
              {useSketchfab ? "3D Model Active" : "Local Render"}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        {useSketchfab ? (
          <SketchfabModel modelId="37c146c94b1e4d28b34d2d428247e5c0" />
        ) : (
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <SimpleScene />
          </Canvas>
        )}
      </div>

      {/* Gradient Overlays */}
      <div 
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 0%, ${NORD_COLORS.polarNight.nord0}20 100%)`,
        }}
      />
    </main>
  )
}