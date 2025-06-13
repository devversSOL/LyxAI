"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

interface SimpleMermaidProps {
  chart: string
  className?: string
}

export default function SimpleMermaid({ chart, className = "" }: SimpleMermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 11)}`

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return

    // Function to render the diagram
    const renderDiagram = () => {
      if (!mermaidRef.current || !window.mermaid) return

      try {
        // Clear previous content
        mermaidRef.current.innerHTML = `<div class="mermaid" id="${uniqueId}">${chart}</div>`

        // Initialize mermaid with dark theme
        window.mermaid.initialize({
          startOnLoad: true,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "inherit",
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

        // Render the diagram
        window.mermaid.run()
      } catch (error) {
        console.error("Mermaid rendering error:", error)
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div class="p-4 bg-red-900/20 border border-red-500 rounded-md">
              <p class="text-red-400">Error rendering diagram: ${error instanceof Error ? error.message : String(error)}</p>
            </div>
          `
        }
      }
    }

    // If mermaid is already loaded, render immediately
    if (window.mermaid) {
      renderDiagram()
    } else {
      // Otherwise wait for the script to load
      window.addEventListener("mermaid-loaded", renderDiagram)
    }

    return () => {
      window.removeEventListener("mermaid-loaded", renderDiagram)
    }
  }, [chart, uniqueId])

  return (
    <>
      {/* Load mermaid script if not already loaded */}
      {typeof window !== "undefined" && !window.mermaid && (
        <Script
          src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            window.dispatchEvent(new Event("mermaid-loaded"))
          }}
        />
      )}
      <div className={`my-6 p-4 bg-zinc-800/50 rounded-lg overflow-x-auto ${className}`}>
        <div ref={mermaidRef} className="w-full min-h-[100px] flex items-center justify-center">
          <div className="animate-pulse text-zinc-400">Loading diagram...</div>
        </div>
      </div>
    </>
  )
}

// Also export as named export
export { SimpleMermaid }

// Add mermaid to the window object type
declare global {
  interface Window {
    mermaid: any
  }
}
