"use client"

import { useState } from "react"

export default function ModelIdExtractor() {
  const [url, setUrl] = useState("")
  const [extractedId, setExtractedId] = useState("")

  const extractModelId = (sketchfabUrl: string) => {
    // Handle different Sketchfab URL formats
    const patterns = [
      /skfb\.ly\/([a-zA-Z0-9]+)/, // Short URL format
      /sketchfab\.com\/3d-models\/[^/]+\/([a-zA-Z0-9]+)/, // Full URL format
      /sketchfab\.com\/models\/([a-zA-Z0-9]+)/, // Direct model URL
    ]

    for (const pattern of patterns) {
      const match = sketchfabUrl.match(pattern)
      if (match) {
        return match[1]
      }
    }
    return null
  }

  const handleExtract = () => {
    const id = extractModelId(url)
    if (id) {
      setExtractedId(id)
    } else {
      setExtractedId("Could not extract ID from URL")
    }
  }

  return (
    <div className="absolute bottom-8 right-8 z-10 bg-nord-polar-night-light p-4 rounded-lg max-w-sm">
      <h3 className="text-nord-snow-storm text-sm font-bold mb-2">Model ID Extractor</h3>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Sketchfab URL here"
        className="w-full p-2 text-sm bg-nord-polar-night text-nord-snow-storm rounded mb-2"
      />
      <button
        onClick={handleExtract}
        className="w-full bg-nord-frost text-nord-polar-night p-1 rounded text-sm hover:bg-nord-snow-storm transition-colors"
      >
        Extract ID
      </button>
      {extractedId && (
        <div className="mt-2 p-2 bg-nord-polar-night rounded">
          <p className="text-nord-frost text-xs">Extracted ID:</p>
          <p className="text-nord-snow-storm text-sm font-mono">{extractedId}</p>
        </div>
      )}
    </div>
  )
}
