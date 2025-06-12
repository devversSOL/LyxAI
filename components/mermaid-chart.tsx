"use client"

import { useEffect, useRef, useState } from "react"

interface MermaidChartProps {
  chart: string
  title?: string
}

export default function MermaidChart({ chart, title }: MermaidChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMermaid = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Import mermaid dynamically
        const { default: mermaid } = await import("mermaid")

        // Configure mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#a855f7",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#7c3aed",
            lineColor: "#6366f1",
            sectionBkgColor: "#1f2937",
            altSectionBkgColor: "#374151",
            gridColor: "#4b5563",
            secondaryColor: "#ec4899",
            tertiaryColor: "#10b981",
            background: "#111827",
            mainBkg: "#111827",
            secondBkg: "#1f2937",
            tertiaryBkg: "#374151",
          },
          flowchart: {
            htmlLabels: true,
            curve: "basis",
          },
        })

        if (ref.current) {
          // Clear any existing content
          ref.current.innerHTML = ""

          // Create a unique ID
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

          // Create a temporary div for rendering
          const tempDiv = document.createElement("div")
          tempDiv.innerHTML = `<div class="mermaid">${chart}</div>`

          // Render the chart
          const { svg } = await mermaid.render(id, chart)

          if (ref.current) {
            ref.current.innerHTML = svg
            setIsLoading(false)
          }
        }
      } catch (err) {
        console.error("Mermaid error:", err)
        setError("Failed to render diagram")
        setIsLoading(false)
      }
    }

    loadMermaid()
  }, [chart])

  return (
    <div className="my-6">
      {title && <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>}
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-gray-400">Loading diagram...</span>
          </div>
        )}
        {error && (
          <div className="text-red-400 text-center py-8">
            <p>{error}</p>
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm">Show source</summary>
              <pre className="mt-2 text-xs bg-gray-800 p-2 rounded overflow-x-auto">{chart}</pre>
            </details>
          </div>
        )}
        <div ref={ref} className={isLoading || error ? "hidden" : "block"} />
      </div>
    </div>
  )
}
