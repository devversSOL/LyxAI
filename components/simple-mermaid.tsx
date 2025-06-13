"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface SimpleMermaidProps {
  chart: string
  className?: string
}

// Initialize mermaid with dark theme configuration
if (typeof window !== "undefined") {
  mermaid.initialize({
    startOnLoad: true,
    theme: "dark",
    securityLevel: "loose",
    themeVariables: {
      primaryColor: "#a855f7",
      primaryTextColor: "#ffffff",
      primaryBorderColor: "#7c3aed",
      lineColor: "#6366f1",
      secondaryColor: "#ec4899",
      tertiaryColor: "#10b981",
      background: "#18181b",
      mainBkg: "#27272a",
      nodeBorder: "#4c1d95",
      clusterBkg: "#1e1b4b",
      clusterBorder: "#4338ca",
      titleColor: "#f5f5f5",
      edgeLabelBackground: "#27272a",
      textColor: "#f5f5f5",
    },
  })
}

export default function SimpleMermaid({ chart, className = "" }: SimpleMermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const renderChart = async () => {
      if (!mermaidRef.current) return

      try {
        mermaidRef.current.innerHTML = chart
        await mermaid.run({
          nodes: [mermaidRef.current],
        })
        setRendered(true)
      } catch (err) {
        console.error("Mermaid rendering error:", err)
        setError("Failed to render diagram. Please check the syntax.")
      }
    }

    // Small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      renderChart()
    }, 100)

    return () => clearTimeout(timer)
  }, [chart])

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-200">
        <p className="font-medium">Error rendering diagram:</p>
        <p className="text-sm mt-1">{error}</p>
        <pre className="mt-2 p-2 bg-black/30 rounded text-xs overflow-x-auto">{chart}</pre>
      </div>
    )
  }

  return (
    <div
      className={`mermaid-wrapper ${className} ${rendered ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
    >
      <div ref={mermaidRef} className="mermaid bg-zinc-900/30 p-4 rounded-lg overflow-x-auto"></div>
    </div>
  )
}

// Also export as named export for flexibility
export { SimpleMermaid }
