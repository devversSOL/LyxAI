"use client"

import { useEffect, useState } from "react"
import SimpleMermaid from "./simple-mermaid"

interface MermaidRendererProps {
  content: string
}

export default function MermaidRenderer({ content }: MermaidRendererProps) {
  const [parts, setParts] = useState<Array<{ type: "text" | "mermaid"; content: string }>>([])

  useEffect(() => {
    // Extract mermaid diagrams from content
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g
    let lastIndex = 0
    const contentParts = []
    let match

    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = content

    // Get the text content to work with
    const textContent = tempDiv.textContent || ""

    while ((match = mermaidRegex.exec(textContent)) !== null) {
      // Add text before the mermaid block
      if (match.index > lastIndex) {
        contentParts.push({
          type: "text",
          content: content.substring(lastIndex, match.index),
        })
      }

      // Add the mermaid block
      contentParts.push({
        type: "mermaid",
        content: match[1].trim(),
      })

      lastIndex = match.index + match[0].length
    }

    // Add any remaining text
    if (lastIndex < content.length) {
      contentParts.push({
        type: "text",
        content: content.substring(lastIndex),
      })
    }

    setParts(contentParts)
  }, [content])

  return (
    <div className="mermaid-renderer">
      {parts.map((part, index) =>
        part.type === "text" ? (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: part.content }}
            className="prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white prose-code:text-purple-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10"
          />
        ) : (
          <div key={index} className="my-8 bg-gray-900/50 rounded-lg p-4 border border-white/10">
            <SimpleMermaid chart={part.content} />
          </div>
        ),
      )}
    </div>
  )
}
