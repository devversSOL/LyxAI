"use client"

import { useEffect, useRef } from "react"

// This component creates a stylized background texture that resembles blockchain/digital patterns
export default function BlockchainDisplay({ className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Draw digital pattern that resembles the dot pattern on the mining machines
    const drawPattern = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#070318"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid size
      const cellSize = 15
      const rows = Math.ceil(canvas.height / cellSize)
      const cols = Math.ceil(canvas.width / cellSize)

      // Draw dots
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Random appearance for dots
          if (Math.random() > 0.7) {
            const brightness = Math.random() * 0.4 + 0.1
            ctx.fillStyle = `rgba(138, 43, 226, ${brightness})`

            const dotSize = Math.random() * 2 + 1
            ctx.beginPath()
            ctx.arc(x * cellSize + Math.random() * 4, y * cellSize + Math.random() * 4, dotSize, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Horizontal lines
      for (let y = 0; y < rows; y += 10) {
        if (Math.random() > 0.7) {
          ctx.strokeStyle = `rgba(138, 43, 226, ${Math.random() * 0.2 + 0.05})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(0, y * cellSize)
          ctx.lineTo(canvas.width, y * cellSize)
          ctx.stroke()
        }
      }
    }

    // Initial draw
    drawPattern()

    // Animation loop - subtly change pattern over time
    let frameId: number
    const animate = () => {
      // Only redraw occasionally for subtle change
      if (Math.random() > 0.95) {
        drawPattern()
      }
      frameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`fixed inset-0 z-0 pointer-events-none opacity-30 ${className}`} />
}
