"use client"

import { useEffect, useRef } from "react"

interface GeometricShapeProps {
  className?: string
}

export default function GeometricShape({ className = "" }: GeometricShapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create irregular polygon shape
    const drawPolygon = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      size: number,
      rotation: number,
      sides: number,
      irregularity: number,
    ) => {
      ctx.beginPath()

      for (let i = 0; i < sides; i++) {
        const angle = rotation + (Math.PI * 2 * i) / sides
        // Add irregularity to the radius
        const radius = size * (1 + (Math.random() * 2 - 1) * irregularity)
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
    }

    let rotation = 0
    const size = Math.min(canvas.width, canvas.height) * 0.4
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Slowly rotate the shapes
      rotation += 0.001

      // Draw outer polygon
      ctx.strokeStyle = "rgba(138, 43, 226, 0.15)"
      ctx.lineWidth = 1
      drawPolygon(ctx, centerX, centerY, size, rotation, 8, 0.1)
      ctx.stroke()

      // Draw middle polygon
      ctx.strokeStyle = "rgba(138, 43, 226, 0.1)"
      ctx.lineWidth = 1
      drawPolygon(ctx, centerX, centerY, size * 0.85, -rotation * 0.7, 7, 0.15)
      ctx.stroke()

      // Draw inner polygon
      ctx.strokeStyle = "rgba(138, 43, 226, 0.2)"
      ctx.lineWidth = 1
      drawPolygon(ctx, centerX, centerY, size * 0.6, rotation * 1.3, 6, 0.2)
      ctx.stroke()

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`fixed inset-0 z-0 pointer-events-none ${className}`} />
}
