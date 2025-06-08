"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import SketchfabModel from "@/components/sketchfab-model"
import SimpleScene from "@/components/simple-scene"
import { ArrowRight } from "lucide-react"

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

export default function Home() {
  const [useSketchfab, setUseSketchfab] = useState(true) // Start with Sketchfab
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [modelReady, setModelReady] = useState(false)

  useEffect(() => {
    // Simulate progress bar filling up
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Small delay after reaching 100% before hiding
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
          return 100
        }
        // Randomize progress increments for more realistic feel
        const increment = Math.random() * 15 + 5 // 5-20% increments
        return Math.min(prev + increment, 100)
      })
    }, 200) // Update every 200ms

    return () => clearInterval(progressInterval)
  }, [])

  // Listen for messages from the iframe to switch models
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === "switchToLocal") {
        setUseSketchfab(false)
      }
      if (event.data.action === "modelReady") {
        setModelReady(true)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <main className="w-full h-screen relative" style={{ background: NORD_COLORS.polarNight.nord0 }}>
      {/* Minimalist Progress Bar Loading Screen */}
      {isLoading && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${NORD_COLORS.polarNight.nord0} 0%, ${NORD_COLORS.polarNight.nord1} 100%)`,
          }}
        >
          {/* Simple Blocky Progress Bar */}
          <div className="w-96 h-8 max-w-md mx-auto bg-nord-polar-night-light relative overflow-hidden">
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: NORD_COLORS.frost.nord8,
              }}
            />
          </div>
        </div>
      )}

      {/* Top navigation bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-6"
        style={{
          background: `linear-gradient(to bottom, ${NORD_COLORS.polarNight.nord1}CC, ${NORD_COLORS.polarNight.nord0}00)`,
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Welcome text on left */}
        <div>
          <h1 className="text-4xl font-bold" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
            Welcome
          </h1>
        </div>

        {/* Enter button on right */}
        <div>
          <a
            href="/project1"
            className="flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-300 hover:scale-105"
            style={{
              background: NORD_COLORS.frost.nord8,
              color: NORD_COLORS.polarNight.nord0,
              boxShadow: `0 4px 20px ${NORD_COLORS.frost.nord8}66`,
            }}
          >
            <span className="font-medium text-lg">Enter</span>
            <ArrowRight size={20} />
          </a>
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-8 left-8 z-10">
        <div className="p-2 rounded-lg" style={{ background: NORD_COLORS.polarNight.nord1 }}>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: useSketchfab ? NORD_COLORS.aurora.nord14 : NORD_COLORS.frost.nord10 }}
            />
            <span className="text-sm" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
              {useSketchfab ? "Sketchfab Model (RS Logo)" : "Local Model"}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Content */}
      <div className="w-full h-full">
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
