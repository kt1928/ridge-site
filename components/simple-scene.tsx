"use client"

import { useRef, useState, Suspense, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, Text } from "@react-three/drei"
import type { Group } from "three"
import type * as THREE from "three"

// Define the project data with Nord colors
const PROJECTS = [
  { name: "Project 1", path: "/project1", color: "#88C0D0" },
  { name: "Project 2", path: "/project2", color: "#81A1C1" },
  { name: "Project 3", path: "/project3", color: "#5E81AC" },
  { name: "Project 4", path: "/project4", color: "#BF616A" },
]

// Model component with error handling
function RSLogo() {
  const logoRef = useRef<Group>(null)
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // Replace with your hosted model URL
  const MODEL_URL = "https://your-hosting-service.com/rs-logo.glb"

  useEffect(() => {
    let isMounted = true

    const loadModel = async () => {
      try {
        const gltf = await useGLTF.preload(MODEL_URL)
        if (isMounted) {
          setScene(gltf.scene)
        }
      } catch (err: any) {
        console.warn("Model failed to load, using fallback")
        setError(err)
      }
    }

    loadModel()

    return () => {
      isMounted = false
    }
  }, [])

  useFrame((state) => {
    if (logoRef.current) {
      const newY = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      logoRef.current.position.set(0, newY, 0)
      logoRef.current.rotation.set(
        Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05,
        state.clock.elapsedTime * 0.3,
        Math.PI / 4 + Math.cos(state.clock.elapsedTime * 0.5) * 0.05,
      )
    }
  })

  if (error) {
    return <FallbackLogo />
  }

  return (
    <group ref={logoRef} scale={2}>
      {scene ? <primitive object={scene.clone()} /> : null}
    </group>
  )
}

// Fallback logo (our current 3D version)
function FallbackLogo() {
  const logoRef = useRef<Group>(null)

  useFrame((state) => {
    if (logoRef.current) {
      const newY = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      logoRef.current.position.set(0, newY, 0)
      logoRef.current.rotation.set(
        Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05,
        state.clock.elapsedTime * 0.3,
        Math.PI / 4 + Math.cos(state.clock.elapsedTime * 0.5) * 0.05,
      )
    }
  })

  return (
    <group ref={logoRef} scale={1.8}>
      {/* R Letter */}
      <group position={[-0.8, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.15, 2.0, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
        <mesh position={[0.4, 0.7, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
        <mesh position={[0.7, 0.35, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
        <mesh position={[0.35, 0.1, 0]}>
          <boxGeometry args={[0.5, 0.15, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
        <mesh position={[0.45, -0.45, 0]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.15, 0.9, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
      </group>

      {/* S Letter */}
      <group position={[0.8, 0, 0]}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[0.7, 0.15, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
        <mesh position={[-0.275, 0.525, 0]}>
          <boxGeometry args={[0.15, 0.2, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.7, 0.15, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
        <mesh position={[0.275, -0.325, 0]}>
          <boxGeometry args={[0.15, 0.2, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.7, 0.15, 0.15]} />
          <meshStandardMaterial color="#ECEFF4" />
        </mesh>
      </group>
    </group>
  )
}

export default function SimpleScene() {
  const [hoveredDot, setHoveredDot] = useState<number | null>(null)

  const projectPoints = [
    [2.5, 1.5, 0],
    [-2.5, 1.5, 0],
    [2.5, -1.5, 0],
    [-2.5, -1.5, 0],
  ] as const

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} color="#D8DEE9" />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#88C0D0" />

      {/* Logo with Suspense for loading */}
      <Suspense fallback={null}>
        <RSLogo />
      </Suspense>

      {/* Interactive dots */}
      {projectPoints.map((point, index) => (
        <group key={index}>
          <mesh
            position={point}
            onPointerOver={() => setHoveredDot(index)}
            onPointerOut={() => setHoveredDot(null)}
            onClick={() => (window.location.href = PROJECTS[index].path)}
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={PROJECTS[index].color}
              emissive={PROJECTS[index].color}
              emissiveIntensity={hoveredDot === index ? 0.8 : 0.3}
            />
          </mesh>

          {hoveredDot === index && (
            <>
              <mesh position={[point[0] * 0.7, point[1] * 0.7, 0]}>
                <boxGeometry args={[0.6, 0.04, 0.04]} />
                <meshStandardMaterial
                  color={PROJECTS[index].color}
                  emissive={PROJECTS[index].color}
                  emissiveIntensity={0.6}
                />
              </mesh>
              <Text
                position={[point[0] * 0.5, point[1] * 0.5, 0.3]}
                color={PROJECTS[index].color}
                fontSize={0.15}
                maxWidth={3}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign="center"
              >
                {`Enter ${PROJECTS[index].name}`}
              </Text>
            </>
          )}
        </group>
      ))}

      {/* Debug text */}
      <Text position={[0, -3, 0]} color="#88C0D0" fontSize={0.1} textAlign="center">
        3D Portal Ready - Hover dots to explore
      </Text>
    </>
  )
}
