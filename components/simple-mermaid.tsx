"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

interface SimpleMermaidProps {
  chart: string
  className?: string
}

// Export both as default and named export to support both import styles
export function SimpleMermaid({ chart, className = "" }: SimpleMermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return // Skip on server-side

    try {
      // Initialize Mermaid with dark theme and better sizing
      mermaid.initialize({
        startOnLoad: false, // We'll render manually
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "inherit",
      })

      // Render the Mermaid diagram
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `<div class="mermaid">${chart}</div>`
        mermaid.run()
      }
    } catch (error) {
      console.error("Mermaid initialization error:", error)
      if (mermaidRef.current) {
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

// Also export as default
export default SimpleMermaid
