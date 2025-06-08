"use client"

import { useState, useEffect } from "react"

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Hide loading screen after a delay
    const timer = setTimeout(() => {
      setVisible(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="w-32 h-32 relative mb-8">
        <div className="w-full h-full rounded-full border-4 border-gray-800"></div>
        <div
          className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"
          style={{ animationDuration: "2s" }}
        ></div>
      </div>
      <h2 className="text-white text-2xl font-bold">Loading 3D Portal</h2>
      <p className="text-gray-400 mt-2">Preparing your experience...</p>
    </div>
  )
}
