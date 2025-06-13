"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, MeshTransmissionMaterial } from "@react-three/drei"
import type * as THREE from "three"
import { usePathname } from "next/navigation"

// Performance detection hook
function usePerformanceLevel() {
  const [performanceLevel, setPerformanceLevel] = useState<"high" | "medium" | "low">("medium")

  useEffect(() => {
    // Detect device capabilities
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isLowEnd = navigator.hardwareConcurrency <= 4
    const hasLimitedMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4

    if (isMobile || isLowEnd || hasLimitedMemory) {
      setPerformanceLevel("low")
    } else if (navigator.hardwareConcurrency <= 8) {
      setPerformanceLevel("medium")
    } else {
      setPerformanceLevel("high")
    }
  }, [])

  return performanceLevel
}

function OptimizedGlassCube({
  position = [0, 0, 0],
  scale = 1,
  performanceLevel,
}: { position: number[]; scale: number; performanceLevel: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current) return

    const t = state.clock.getElapsedTime()
    // Reduce animation complexity for low-end devices
    const animationIntensity = performanceLevel === "low" ? 0.1 : performanceLevel === "medium" ? 0.2 : 0.3

    meshRef.current.rotation.x = Math.sin(t / 4) * animationIntensity
    meshRef.current.rotation.y = Math.sin(t / 2) * animationIntensity

    // Reduce position animation for low-end devices
    if (performanceLevel !== "low") {
      meshRef.current.position.y = position[1] + Math.sin(t / 3) * (animationIntensity * 0.7)
      meshRef.current.position.x = position[0] + Math.sin(t / 4) * (animationIntensity * 0.7)
    }
  })

  // Simplified material settings based on performance
  const materialProps = {
    low: {
      samples: 1,
      thickness: 0.2,
      roughness: 0.1,
      transmission: 0.8,
      chromaticAberration: 0.02,
      distortion: 0.1,
      distortionScale: 0.1,
    },
    medium: {
      samples: 2,
      thickness: 0.3,
      roughness: 0.08,
      transmission: 0.9,
      chromaticAberration: 0.04,
      distortion: 0.2,
      distortionScale: 0.2,
    },
    high: {
      samples: 4,
      thickness: 0.5,
      roughness: 0.05,
      transmission: 0.95,
      chromaticAberration: 0.06,
      distortion: 0.4,
      distortionScale: 0.3,
    },
  }

  const settings = materialProps[performanceLevel as keyof typeof materialProps]

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <MeshTransmissionMaterial
        backside
        samples={settings.samples}
        thickness={settings.thickness}
        roughness={settings.roughness}
        clearcoat={0.1}
        clearcoatRoughness={0.1}
        transmission={settings.transmission}
        ior={1.5}
        chromaticAberration={settings.chromaticAberration}
        anisotropy={0.1}
        distortion={settings.distortion}
        distortionScale={settings.distortionScale}
        temporalDistortion={0.1}
        metalness={0.1}
        attenuationColor="#fff"
        color="#8b5cf6"
        attenuationDistance={0.2}
        opacity={0.8}
      />
    </mesh>
  )
}

function Scene({ performanceLevel }: { performanceLevel: string }) {
  // Reduce number of objects based on performance
  const objectCount = {
    low: 2,
    medium: 3,
    high: 5,
  }

  const count = objectCount[performanceLevel]

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Reduce number of lights for low-end devices */}
      {performanceLevel !== "low" && (
        <>
          <pointLight position={[-10, -10, -10]} intensity={0.1} />
          <pointLight position={[0, 0, 5]} intensity={1} color="#8b5cf6" />
        </>
      )}

      {performanceLevel === "high" && <pointLight position={[5, 5, 0]} intensity={0.5} color="#8b5cf6" />}

      {/* Render fewer objects based on performance level */}
      <OptimizedGlassCube position={[3, -1, -5]} scale={2.5} performanceLevel={performanceLevel} />

      {count >= 2 && <OptimizedGlassCube position={[-3, 2, -8]} scale={3} performanceLevel={performanceLevel} />}

      {count >= 3 && <OptimizedGlassCube position={[-5, -3, -10]} scale={4} performanceLevel={performanceLevel} />}

      {count >= 4 && <OptimizedGlassCube position={[4, 3, -7]} scale={2} performanceLevel={performanceLevel} />}

      {count >= 5 && <OptimizedGlassCube position={[-2, -2, -6]} scale={1.5} performanceLevel={performanceLevel} />}
    </>
  )
}

export default function BackgroundScene() {
  const pathname = usePathname()
  const isDocPage = pathname.includes("/docs")
  const [performanceLevel, setPerformanceLevel] = useState<"high" | "medium" | "low">("medium")
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    if (isDocPage) {
      setPerformanceLevel("low")
    } else {
      const detectPerformance = () => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        const isLowEnd = navigator.hardwareConcurrency <= 4
        const hasLimitedMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4

        if (isMobile || isLowEnd || hasLimitedMemory) {
          setPerformanceLevel("low")
        } else if (navigator.hardwareConcurrency <= 8) {
          setPerformanceLevel("medium")
        } else {
          setPerformanceLevel("high")
        }
      }

      detectPerformance()
    }
  }, [isDocPage])

  // Show fallback for very low-end devices
  useEffect(() => {
    if (performanceLevel === "low") {
      const timer = setTimeout(() => {
        // If the component takes too long to render, show fallback
        setShowFallback(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [performanceLevel])

  // Fallback for very low-end devices
  if (showFallback && performanceLevel === "low") {
    return (
      <div className="fixed inset-0 z-0 opacity-80">
        {/* CSS-only background for low-end devices */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-800/20" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-700/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-purple-400/10 rounded-full blur-[80px]" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-0 opacity-80">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        performance={{ min: 0.5 }}
        dpr={performanceLevel === "low" ? 1 : performanceLevel === "medium" ? 1.5 : 2}
      >
        <Scene performanceLevel={performanceLevel} />
        {performanceLevel !== "low" && <Environment preset="night" />}
      </Canvas>

      {/* Reduced CSS light effects */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-700/10 rounded-full blur-[120px]" />
      {performanceLevel !== "low" && (
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-[80px]" />
      )}
    </div>
  )
}
