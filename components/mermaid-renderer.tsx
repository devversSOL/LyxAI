"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

interface MermaidRendererProps {
  content: string
}

export default function MermaidRenderer({ content }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
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
        mainBkg: "#1f2937",
        secondBkg: "#374151",
        tertiaryBkg: "#4b5563",
      },
    })
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      // Parse the HTML content and render Mermaid diagrams
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = content

      // Find all mermaid chart elements
      const mermaidElements = tempDiv.querySelectorAll(".mermaid-chart")

      mermaidElements.forEach(async (element, index) => {
        const chartCode = element.textContent || ""
        const chartId = `mermaid-${index}-${Date.now()}`

        try {
          const { svg } = await mermaid.render(chartId, chartCode)
          element.innerHTML = svg
          element.classList.add("rendered")
        } catch (error) {
          console.error("Mermaid rendering error:", error)
          element.innerHTML = `<div class="error">Error rendering diagram</div>`
        }
      })

      // Update the container with processed content
      containerRef.current.innerHTML = tempDiv.innerHTML
    }
  }, [content])

  return (
    <div
      ref={containerRef}
      className="prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white prose-code:text-purple-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10"
    />
  )
}
