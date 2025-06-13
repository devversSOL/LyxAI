"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

interface SimpleMermaidProps {
  chart: string
  className?: string
}

export default function SimpleMermaid({ chart, className = "" }: SimpleMermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize Mermaid with dark theme and better sizing
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "inherit",
      // Make diagrams fill available space better
      gantt: {
        useWidth: 1000,
      },
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
      },
      sequence: {
        useMaxWidth: false,
        width: 1000,
      },
    })

    // Render the Mermaid diagram
    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = `<pre class="mermaid w-full">${chart}</pre>`

      try {
        mermaid.contentLoaded()
      } catch (error) {
        console.error("Mermaid rendering error:", error)
        mermaidRef.current.innerHTML = `<div class="p-4 bg-red-900/20 border border-red-500 rounded-md">
          <p class="text-red-400">Error rendering diagram: ${error instanceof Error ? error.message : String(error)}</p>
        </div>`
      }
    }
  }, [chart])

  return (
    <div className={`my-6 p-4 bg-zinc-800/50 rounded-lg overflow-x-auto ${className}`}>
      <div ref={mermaidRef} className="w-full" />
    </div>
  )
}
