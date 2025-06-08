"use client"

import { useGLTF } from "@react-three/drei"

// This function will preload your model to improve performance
export function preloadModel(path: string) {
  useGLTF.preload(path)
}

// This function will help you replace the placeholder model with your own
export function updateModelPath(newPath: string) {
  // You would implement logic here to update the model path in your application
  console.log(`Model path updated to: ${newPath}`)
  return newPath
}
