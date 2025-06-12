"use client"

import { useEffect, useRef, useState } from "react"

interface MermaidDiagramProps {
  chart: string
  title?: string
  className?: string
}

export function MermaidDiagram({ chart, title, className = "" }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const renderDiagram = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamic import to ensure it works in client-side
        const mermaid = (await import("mermaid")).default

        // Initialize mermaid with dark theme
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
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
          },
        })

        if (ref.current && mounted) {
          // Clear previous content
          ref.current.innerHTML = ""

          // Generate unique ID
          const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

          try {
            // Render the diagram
            const { svg } = await mermaid.render(id, chart)

            if (ref.current && mounted) {
              ref.current.innerHTML = svg
              setIsLoading(false)
            }
          } catch (renderError) {
            console.error("Mermaid render error:", renderError)
            if (mounted) {
              setError("Failed to render diagram")
              setIsLoading(false)
            }
          }
        }
      } catch (importError) {
        console.error("Mermaid import error:", importError)
        if (mounted) {
          setError("Failed to load diagram library")
          setIsLoading(false)
        }
      }
    }

    renderDiagram()

    return () => {
      mounted = false
    }
  }, [chart])

  if (error) {
    return (
      <div className={`my-6 ${className}`}>
        {title && <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">Error: {error}</p>
          <details className="mt-2">
            <summary className="text-sm text-red-300 cursor-pointer">Show diagram source</summary>
            <pre className="text-xs text-red-200 mt-2 overflow-x-auto">{chart}</pre>
          </details>
        </div>
      </div>
    )
  }

  return (
    <div className={`my-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10 overflow-x-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-gray-400">Rendering diagram...</span>
          </div>
        )}
        <div ref={ref} className="mermaid-container" />
      </div>
    </div>
  )
}
