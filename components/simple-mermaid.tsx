"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

interface SimpleMermaidProps {
  chart: string
  caption?: string
  className?: string
}

// Define the component as a named function
export function SimpleMermaid({ chart, caption, className = "" }: SimpleMermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const chartId = useRef(`mermaid-${Math.random().toString(36).substring(2, 11)}`)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "inherit",
    })

    if (mermaidRef.current) {
      try {
        mermaid.render(chartId.current, chart.trim(), (svgCode) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svgCode
          }
        })
      } catch (error) {
        console.error("Mermaid rendering error:", error)
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<div class="text-red-500 p-4 border border-red-500 rounded">
            Error rendering diagram. Please check the syntax.
          </div>`
        }
      }
    }
  }, [chart])

  return (
    <div className={`my-8 ${className}`}>
      <div ref={mermaidRef} className="bg-zinc-900 p-4 rounded-lg overflow-auto" data-testid="mermaid-diagram" />
      {caption && <p className="text-center text-sm text-zinc-400 mt-2">{caption}</p>}
    </div>
  )
}

// Also export the same component as default
export default SimpleMermaid
