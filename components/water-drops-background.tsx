"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, MeshTransmissionMaterial, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

function WaterDrop({ position = [0, 0, 0], size = 1, speed = 1, delay = 0 }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const initialPosition = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + delay

    // Gentle floating motion
    meshRef.current.position.y = initialPosition.y + Math.sin(t * 0.5) * 0.5

    // Slow rotation
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2
    meshRef.current.rotation.y = Math.sin(t * 0.2) * 0.3
    meshRef.current.rotation.z = Math.sin(t * 0.4) * 0.1
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.5}
        roughness={0.05}
        clearcoat={0.1}
        clearcoatRoughness={0.1}
        transmission={0.95}
        ior={1.5}
        chromaticAberration={0.06}
        anisotropy={0.1}
        distortion={0.4}
        distortionScale={0.3}
        temporalDistortion={0.3}
        metalness={0.1}
        attenuationColor="#a5f3fc"
        color="#22d3ee"
        attenuationDistance={0.2}
        opacity={0.8}
      />
    </mesh>
  )
}

function WaterPrism({ position = [0, 0, 0], size = 1, speed = 1, delay = 0 }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const initialPosition = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + delay

    // Gentle floating motion
    meshRef.current.position.y = initialPosition.y + Math.sin(t * 0.4) * 0.3
    meshRef.current.position.x = initialPosition.x + Math.sin(t * 0.3) * 0.2

    // Slow rotation
    meshRef.current.rotation.x = t * 0.1
    meshRef.current.rotation.y = t * 0.15
    meshRef.current.rotation.z = t * 0.05
  })

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.5}
        roughness={0.05}
        clearcoat={0.1}
        clearcoatRoughness={0.1}
        transmission={0.95}
        ior={1.5}
        chromaticAberration={0.06}
        anisotropy={0.1}
        distortion={0.4}
        distortionScale={0.3}
        temporalDistortion={0.3}
        metalness={0.1}
        attenuationColor="#bfdbfe"
        color="#60a5fa"
        attenuationDistance={0.2}
        opacity={0.8}
      />
    </mesh>
  )
}

function Scene() {
  // Create an array of water drops with different positions, sizes, and animation parameters
  const waterDrops = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10 - 5],
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 10,
      key: `drop-${i}`,
    }))
  }, [])

  // Create an array of water prisms with different positions, sizes, and animation parameters
  const waterPrisms = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10 - 5],
      size: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 10,
      key: `prism-${i}`,
    }))
  }, [])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={45} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.1} />

      {/* Colored point lights for the glass effect */}
      <pointLight position={[0, 0, 5]} intensity={1} color="#22d3ee" />
      <pointLight position={[5, 5, 0]} intensity={0.5} color="#60a5fa" />

      {/* Water drops */}
      {waterDrops.map((drop) => (
        <WaterDrop
          key={drop.key}
          position={drop.position as [number, number, number]}
          size={drop.size}
          speed={drop.speed}
          delay={drop.delay}
        />
      ))}

      {/* Water prisms */}
      {waterPrisms.map((prism) => (
        <WaterPrism
          key={prism.key}
          position={prism.position as [number, number, number]}
          size={prism.size}
          speed={prism.speed}
          delay={prism.delay}
        />
      ))}

      {/* Environment for reflections */}
      <Environment preset="city" />
    </>
  )
}

export default function WaterDropsBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  )
}
