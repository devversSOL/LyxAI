"use client"

import { useEffect, useRef } from "react"

interface LightningProps {
  className?: string
}

export default function LightningEffect({ className = "" }: LightningProps) {
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

    // Lightning class
    class Lightning {
      x: number
      y: number
      targetX: number
      targetY: number
      speed: number
      alpha: number
      lineWidth: number
      color: string
      segments: number[][]
      lifespan: number
      maxLifespan: number
      hue: number

      constructor() {
        // Random starting position on the edges
        const side = Math.floor(Math.random() * 4)

        if (side === 0) {
          // top
          this.x = Math.random() * canvas.width
          this.y = -20
        } else if (side === 1) {
          // right
          this.x = canvas.width + 20
          this.y = Math.random() * canvas.height
        } else if (side === 2) {
          // bottom
          this.x = Math.random() * canvas.width
          this.y = canvas.height + 20
        } else {
          // left
          this.x = -20
          this.y = Math.random() * canvas.height
        }

        // Random target position
        this.targetX = Math.random() * canvas.width
        this.targetY = Math.random() * canvas.height

        this.speed = 0.05 + Math.random() * 0.05
        this.alpha = 0.5 + Math.random() * 0.5
        this.lineWidth = 1 + Math.random() * 2
        this.hue = 260 + Math.random() * 40 // Purple hue range
        this.color = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`
        this.segments = []
        this.maxLifespan = 60 + Math.random() * 60
        this.lifespan = this.maxLifespan

        // Generate lightning path
        this.generatePath()
      }

      generatePath() {
        this.segments = [[this.x, this.y]]
        let currentX = this.x
        let currentY = this.y
        const distX = this.targetX - this.x
        const distY = this.targetY - this.y
        const steps = 10 + Math.floor(Math.random() * 5)

        for (let i = 0; i < steps; i++) {
          const progress = i / steps

          // Add some randomness to the path
          const randomX = (Math.random() - 0.5) * 100 * (1 - progress)
          const randomY = (Math.random() - 0.5) * 100 * (1 - progress)

          currentX = this.x + distX * progress + randomX
          currentY = this.y + distY * progress + randomY

          this.segments.push([currentX, currentY])
        }

        // Ensure the last point is the target
        this.segments.push([this.targetX, this.targetY])
      }

      update() {
        this.lifespan--
        return this.lifespan > 0
      }

      draw(ctx: CanvasRenderingContext2D) {
        const fadeRatio = this.lifespan / this.maxLifespan
        const alpha = this.alpha * fadeRatio

        ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`
        ctx.lineWidth = this.lineWidth
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.beginPath()
        ctx.moveTo(this.segments[0][0], this.segments[0][1])

        for (let i = 1; i < this.segments.length; i++) {
          ctx.lineTo(this.segments[i][0], this.segments[i][1])
        }

        ctx.stroke()

        // Add glow effect
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.8)`
        ctx.shadowBlur = 15
        ctx.strokeStyle = `hsla(${this.hue + 20}, 100%, 80%, ${alpha * 0.7})`
        ctx.lineWidth = this.lineWidth * 0.5
        ctx.stroke()

        ctx.shadowBlur = 0
      }
    }

    // Overlay lightning class
    class OverlayLightning {
      points: { x: number; y: number; vx: number; vy: number }[]
      alpha: number
      lineWidth: number
      hue: number
      lifespan: number
      maxLifespan: number

      constructor() {
        this.points = []
        const numPoints = 5 + Math.floor(Math.random() * 5)

        // Create random points
        for (let i = 0; i < numPoints; i++) {
          this.points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
          })
        }

        this.alpha = 0.3 + Math.random() * 0.3
        this.lineWidth = 0.5 + Math.random() * 1
        this.hue = 260 + Math.random() * 40
        this.maxLifespan = 120 + Math.random() * 60
        this.lifespan = this.maxLifespan
      }

      update() {
        // Move points
        for (const point of this.points) {
          point.x += point.vx
          point.y += point.vy

          // Bounce off edges
          if (point.x < 0 || point.x > canvas.width) point.vx *= -1
          if (point.y < 0 || point.y > canvas.height) point.vy *= -1
        }

        this.lifespan--
        return this.lifespan > 0
      }

      draw(ctx: CanvasRenderingContext2D) {
        const fadeRatio = this.lifespan / this.maxLifespan
        const alpha = this.alpha * fadeRatio

        ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`
        ctx.lineWidth = this.lineWidth
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.beginPath()
        ctx.moveTo(this.points[0].x, this.points[0].y)

        // Draw lines between points
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y)
        }

        ctx.stroke()

        // Add glow effect
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.8)`
        ctx.shadowBlur = 10
        ctx.strokeStyle = `hsla(${this.hue + 20}, 100%, 80%, ${alpha * 0.5})`
        ctx.lineWidth = this.lineWidth * 0.3
        ctx.stroke()

        ctx.shadowBlur = 0
      }
    }

    const lightnings: Lightning[] = []
    const overlayLightnings: OverlayLightning[] = []
    let lastLightningTime = 0
    let lastOverlayTime = 0

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create new lightning occasionally
      if (timestamp - lastLightningTime > 2000 + Math.random() * 3000) {
        lightnings.push(new Lightning())
        lastLightningTime = timestamp
      }

      // Create new overlay lightning occasionally
      if (timestamp - lastOverlayTime > 4000 + Math.random() * 5000) {
        overlayLightnings.push(new OverlayLightning())
        lastOverlayTime = timestamp
      }

      // Update and draw all lightnings
      for (let i = lightnings.length - 1; i >= 0; i--) {
        const isAlive = lightnings[i].update()

        if (isAlive) {
          lightnings[i].draw(ctx)
        } else {
          lightnings.splice(i, 1)
        }
      }

      // Update and draw all overlay lightnings
      for (let i = overlayLightnings.length - 1; i >= 0; i--) {
        const isAlive = overlayLightnings[i].update()

        if (isAlive) {
          overlayLightnings[i].draw(ctx)
        } else {
          overlayLightnings.splice(i, 1)
        }
      }

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
