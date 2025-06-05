"use client"

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Text, Float } from "@react-three/drei"
import * as THREE from "three"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import FloatingChatButton from "@/components/floating-chat-button"
import FloatingAnalyzerButton from "@/components/floating-analyzer-button"

// Mining machine component with accurate details
function MiningMachine({ position = [0, 0, 0], functionName = "", symbol = "", symbolColor = "#ffffff" }) {
  const groupRef = useRef<THREE.Group>(null!)
  const machineRef = useRef<THREE.Group>(null!)
  const glowingEdgesRef = useRef<THREE.LineSegments>(null!)

  // Create dot pattern texture
  const dotTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Black background
      ctx.fillStyle = "#0a0a18"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw dots
      ctx.fillStyle = "#ffffff"
      const spacing = 8
      for (let y = 0; y < canvas.height; y += spacing) {
        for (let x = 0; x < canvas.width; x += spacing) {
          if (Math.random() > 0.6) {
            const size = Math.random() * 1 + 0.5
            ctx.globalAlpha = Math.random() * 0.3 + 0.1
            ctx.beginPath()
            ctx.arc(x, y, size, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Very subtle floating animation
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.03
    }

    // Pulsing glow effect for edges
    if (glowingEdgesRef.current && glowingEdgesRef.current.material) {
      const material = glowingEdgesRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.7 + Math.sin(t * 1.5) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Function name text above */}
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.18}
        color="#dddddd"
        font="/fonts/GeistMono-Light.ttf"
        anchorX="center"
        anchorY="middle"
      >
        {functionName}
      </Text>

      <group ref={machineRef}>
        {/* Base platform with glow */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <boxGeometry args={[1.6, 0.1, 1.6]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Platform glow */}
        <mesh position={[0, -0.54, 0]}>
          <boxGeometry args={[1.65, 0.01, 1.65]} />
          <meshBasicMaterial color="#8b5cf6" opacity={0.5} transparent />
        </mesh>

        {/* Main cube - dark material */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color="#0a0a18" metalness={0.5} roughness={0.2} />
        </mesh>

        {/* Dot pattern sides */}
        {[
          [0, 0, 0.61, 0, 0, 0], // front
          [0, 0, -0.61, 0, Math.PI, 0], // back
          [0.61, 0, 0, 0, Math.PI / 2, 0], // right
          [-0.61, 0, 0, 0, -Math.PI / 2, 0], // left
          [0, 0.61, 0, -Math.PI / 2, 0, 0], // top
          [0, -0.61, 0, Math.PI / 2, 0, 0], // bottom
        ].map(([x, y, z, rotX, rotY, rotZ], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[rotX, rotY, rotZ]}>
            <planeGeometry args={[1.19, 1.19]} />
            <meshBasicMaterial map={dotTexture} transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Glowing edges */}
        <lineSegments ref={glowingEdgesRef}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.22, 1.22, 1.22)]} />
          <lineBasicMaterial color="#a78bfa" transparent opacity={0.8} />
        </lineSegments>

        {/* Crypto symbol (floating inside) */}
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={[0, 0, 0]}>
            <pointLight intensity={1.5} distance={1.5} color={symbolColor} />
            <Text
              fontSize={0.5}
              color={symbolColor}
              font="/fonts/Inter-Bold.ttf"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#ffffff"
            >
              {symbol}
            </Text>
          </group>
        </Float>
      </group>
    </group>
  )
}

// Grid floor with better detail
function GridFloor() {
  const gridRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Very subtle movement effect for the grid
    if (gridRef.current) {
      gridRef.current.position.z = Math.sin(t * 0.1) * 0.1
    }
  })

  return (
    <group ref={gridRef} position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper args={[50, 50, "#4c1d95", "#2e1065"]} />
      <mesh rotation={[0, 0, 0]} position={[0, 0, -0.1]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#070318" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

// Connection lines between machines
function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Pulse the opacity of the lines
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Line && child.material instanceof THREE.LineBasicMaterial) {
          child.material.opacity = 0.4 + Math.sin(t * 0.5 + i * 0.2) * 0.2
        }
      })
    }
  })

  return (
    <group ref={linesRef}>
      {/* Line from left to center */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            array={new Float32Array([-4, -0.5, 0, 0, -0.5, 0])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
      </line>

      {/* Line from center to right */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, -0.5, 0, 4, -0.5, 0])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
      </line>
    </group>
  )
}

// Scene component with three mining machines
function StakingScene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <spotLight position={[0, 10, 5]} intensity={0.3} angle={0.3} penumbra={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.2} color="#8b5cf6" />
      <pointLight position={[5, 5, -5]} intensity={0.2} color="#8b5cf6" />

      {/* Connection lines between machines */}
      <ConnectionLines />

      {/* Ethereum Mining Machine */}
      <MiningMachine position={[-4, 0, 0]} functionName="stakeTokens()" symbol="Ξ" symbolColor="#c0c0ff" />

      {/* Near & Infinity Mining Machine */}
      <MiningMachine position={[0, 0, 0]} functionName="checkBlockCreation()" symbol="∞" symbolColor="#a78bfa" />

      {/* X Mining Machine */}
      <MiningMachine position={[4, 0, 0]} functionName="getRewards()" symbol="✕" symbolColor="#ffffff" />

      <GridFloor />
    </>
  )
}

// Stars background component
function StarsBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}
    </div>
  )
}

export default function StakingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="bg-[#070318] text-white min-h-screen overflow-hidden relative font-extralight">
      {/* Stars background */}
      <StarsBackground />

      {/* Main content layout matching the reference image */}
      <div className="relative z-10 container mx-auto px-4 pt-8 min-h-screen">
        {/* Header with STAKENT badge */}
        <div className="flex items-start mb-8">
          <Badge className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-light">
            LYXAI
          </Badge>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Left side content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight mb-6 text-white leading-tight">
              Meet the Staking
              <br />
              Rewards
              <br />
              <span className="text-white">Verified Providers</span>
            </h1>

            <p className="text-zinc-400 text-lg mb-8 font-extralight max-w-lg">
              Stake with more confidence and save time in Due-Diligence by Delegating to Verified Provider
            </p>

            <div className="flex gap-4">
              <Link
                href="/providers"
                className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
              >
                <span className="font-light">View All Providers</span>
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 7H17V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link
                href="/"
                className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
              >
                <span className="font-light">Learn More</span>
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 7H17V17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right side content */}
          <div className="flex flex-col justify-center items-end">
            <div className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 p-6 max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 16L9 19L18 10"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3 className="text-4xl font-light text-white">+20% Rewards</h3>
              </div>
              <p className="text-zinc-300 font-extralight mb-4">
                Our trusted suppliers offer unrivaled options for your staking, and we back it up with numbers
              </p>
              <h4 className="text-xl font-light text-purple-300">Carefree Staking</h4>
            </div>
          </div>
        </div>

        {/* 3D scene container - positioned at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[60vh] z-10">
          <Canvas camera={{ position: [0, 1.5, 7], fov: 45 }}>
            <StakingScene />
            <Environment preset="night" />
          </Canvas>
        </div>
      </div>

      {/* Back to home link */}
      <div className="fixed top-8 right-8 z-20">
        <Link
          href="/"
          className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center hover:bg-white/10 transition-all duration-300"
        >
          <span className="font-light">Back to Home</span>
        </Link>
      </div>

      {/* Floating buttons */}
      <FloatingChatButton />
      <FloatingAnalyzerButton />
    </div>
  )
}
