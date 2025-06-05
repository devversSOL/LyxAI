"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, MeshTransmissionMaterial } from "@react-three/drei"
import type * as THREE from "three"

function GlassCube({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(t / 4) * 0.3
    meshRef.current.rotation.y = Math.sin(t / 2) * 0.2

    // Add slight position movement
    meshRef.current.position.y = position[1] + Math.sin(t / 3) * 0.2
    meshRef.current.position.x = position[0] + Math.sin(t / 4) * 0.2
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
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
        attenuationColor="#fff"
        color="#8b5cf6"
        attenuationDistance={0.2}
        opacity={0.8}
      />
    </mesh>
  )
}

function GlassPrism({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(t / 3) * 0.2
    meshRef.current.rotation.y = Math.sin(t / 4) * 0.3

    // Add slight position movement
    meshRef.current.position.y = position[1] + Math.sin(t / 2.5) * 0.3
    meshRef.current.position.z = position[2] + Math.sin(t / 3.5) * 0.2
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
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
        attenuationColor="#fff"
        color="#8b5cf6"
        attenuationDistance={0.2}
        opacity={0.8}
      />
    </mesh>
  )
}

function GlassIrregular({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(t / 5) * 0.4
    meshRef.current.rotation.y = Math.sin(t / 3) * 0.3
    meshRef.current.rotation.z = Math.sin(t / 4) * 0.2

    // Add slight position movement
    meshRef.current.position.x = position[0] + Math.sin(t / 2) * 0.3
    meshRef.current.position.z = position[2] + Math.cos(t / 3) * 0.2
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <tetrahedronGeometry args={[1, 0]} />
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
        attenuationColor="#fff"
        color="#a855f7"
        attenuationDistance={0.2}
        opacity={0.8}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.1} />

      {/* Purple point light for the glow effect */}
      <pointLight position={[0, 0, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[5, 5, 0]} intensity={0.5} color="#8b5cf6" />

      <GlassCube position={[3, -1, -5]} scale={2.5} />
      <GlassPrism position={[-3, 2, -8]} scale={3} />
      <GlassCube position={[-5, -3, -10]} scale={4} rotation={[0.5, 0.5, 0]} />
      <GlassIrregular position={[4, 3, -7]} scale={2} />
      <GlassIrregular position={[-2, -2, -6]} scale={1.5} rotation={[0.2, 0.3, 0.1]} />
    </>
  )
}

export default function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Scene />
        <Environment preset="night" />
      </Canvas>

      {/* Additional light effects using CSS */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-700/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-[80px]" />
    </div>
  )
}
