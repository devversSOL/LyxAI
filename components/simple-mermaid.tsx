"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import mermaid from "mermaid"

interface SimpleMermaidProps {
  chart: string
  className?: string
}

const SimpleMermaid: React.FC<SimpleMermaidProps> = ({ chart, className = "" }) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
    })
  }, [])

  useEffect(() => {
    if (chartRef.current && chart) {
      chartRef.current.innerHTML = chart
      mermaid.init(undefined, chartRef.current)
    }
  }, [chart])

  return <div ref={chartRef} className={`mermaid ${className}`} />
}

export default SimpleMermaid
