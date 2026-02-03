"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Text } from "@react-three/drei"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { type Group, Vector3, type Mesh } from "three"
import { useRouter } from "next/navigation"

// Use the uploaded model
const MODEL_PATH = "/models/rs-logo.glb"

// Define the project data
const PROJECTS = [
  { name: "Dashboard", path: "/dashboard", color: "#4285F4" },
  { name: "Project 2", path: "/project2", color: "#EA4335" },
  { name: "Project 3", path: "/project3", color: "#FBBC05" },
  { name: "Project 4", path: "/project4", color: "#34A853" },
]

export default function PortalModel() {
  const modelRef = useRef<Group>(null)
  const dotsRef = useRef<Group>(null)
  const { camera } = useThree()
  const router = useRouter()
  const [hoveredDot, setHoveredDot] = useState<number | null>(null)
  const [modelError, setModelError] = useState(false)

  // Load the 3D model with error handling
  const { scene: modelScene } = useGLTF(MODEL_PATH)

  useEffect(() => {
    if (!modelScene) {
      console.error("Error loading model:")
      setModelError(true)
    }
  }, [modelScene])

  // Generate random points on the model surface
  const projectPoints = useMemo(() => {
    // Simple predefined positions around the model
    return [
      new Vector3(1.2, 0.8, 0.5),
      new Vector3(-1.0, 1.2, -0.3),
      new Vector3(0.6, -1.0, 1.2),
      new Vector3(-1.2, -0.5, 0.8),
    ]
  }, [])

  // Initialize GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (modelRef.current) {
      // Set initial 45-degree tilt
      modelRef.current.rotation.x = Math.PI / 4
      modelRef.current.rotation.z = Math.PI / 4

      // Floating animation
      gsap.to(modelRef.current.position, {
        y: 0.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })

      // Scroll-triggered rotation animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      })

      tl.to(modelRef.current.rotation, {
        y: Math.PI * 2,
        ease: "power1.inOut",
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  // Add subtle continuous rotation for the floating effect
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.0005

      // Animate the dots when hovered
      if (dotsRef.current && hoveredDot !== null) {
        const dotGroup = dotsRef.current.children[hoveredDot] as Group
        if (dotGroup && dotGroup.children[0]) {
          // Pulse animation for the dot
          const dot = dotGroup.children[0] as Mesh
          const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.2
          dot.scale.set(scale, scale, scale)
        }
      }
    }
  })

  return (
    <group>
      {/* Test cube to verify 3D scene is working */}
      <mesh position={[3, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>

      {/* Main model with 45-degree tilt or fallback */}
      <group ref={modelRef} scale={2} position={[0, 0, 0]}>
        {modelScene && !modelError ? (
          <primitive object={modelScene.clone()} />
        ) : (
          // Fallback geometry if model fails to load
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffffff" wireframe />
          </mesh>
        )}
      </group>

      {/* Interactive dots with extending lines */}
      <group ref={dotsRef}>
        {projectPoints.map((point, index) => (
          <group key={index}>
            {/* Dot */}
            <mesh
              position={point}
              onPointerOver={() => setHoveredDot(index)}
              onPointerOut={() => setHoveredDot(null)}
              onClick={() => router.push(PROJECTS[index].path)}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={PROJECTS[index].color}
                emissive={PROJECTS[index].color}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Line that extends when hovered */}
            {hoveredDot === index && (
              <mesh position={[point.x + 0.4, point.y + 0.4, point.z + 0.2]}>
                <boxGeometry args={[0.6, 0.02, 0.02]} />
                <meshStandardMaterial
                  color={PROJECTS[index].color}
                  emissive={PROJECTS[index].color}
                  emissiveIntensity={0.2}
                />
              </mesh>
            )}

            {/* Text label */}
            {hoveredDot === index && (
              <group position={[point.x + 1.0, point.y + 1.0, point.z + 0.3]}>
                <Text
                  color={PROJECTS[index].color}
                  fontSize={0.2}
                  maxWidth={3}
                  lineHeight={1}
                  letterSpacing={0.02}
                  textAlign="left"
                >
                  {`Enter ${PROJECTS[index].name}`}
                </Text>
              </group>
            )}
          </group>
        ))}
      </group>
    </group>
  )
}
