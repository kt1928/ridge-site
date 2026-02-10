"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import ASCIIAnimation from "@/components/ascii-animation"

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
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

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

  return (
    <main className="relative h-dvh w-full overflow-hidden" style={{ background: NORD_COLORS.polarNight.nord0 }}>
      {/* Loading */}
      {isLoading && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${NORD_COLORS.polarNight.nord0} 0%, ${NORD_COLORS.polarNight.nord1} 100%)`,
          }}
        >
          <div className="w-96 h-8 max-w-md mx-auto relative overflow-hidden" style={{ background: NORD_COLORS.polarNight.nord2 }}>
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

      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-6"
        style={{
          background: `linear-gradient(to bottom, ${NORD_COLORS.polarNight.nord1}CC, ${NORD_COLORS.polarNight.nord0}00)`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div>
          <h1 className="text-4xl font-bold" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
            Welcome
          </h1>
        </div>

        <div>
          <a
            href="/dashboard"
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

      {/* ASCII Animation */}
      <div className="h-full w-full flex items-center justify-center">
        <ASCIIAnimation
          frameFolder="animations/rs-logo"
          quality="high"
          fps={15}
          frameCount={90}
          className="w-full h-full"
          gradient={`linear-gradient(180deg, ${NORD_COLORS.frost.nord8}, ${NORD_COLORS.frost.nord10}, ${NORD_COLORS.aurora.nord15})`}
          ariaLabel="RS Logo ASCII animation"
        />
      </div>

      {/* Status */}
      <div className="absolute bottom-8 left-8 z-10">
        <div className="p-2 rounded-lg" style={{ background: NORD_COLORS.polarNight.nord1 }}>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: NORD_COLORS.aurora.nord14 }}
            />
            <span className="text-sm" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
              ASCII Art (RS Logo)
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
