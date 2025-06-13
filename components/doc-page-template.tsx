import type React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface DocPageTemplateProps {
  title: string
  children: React.ReactNode
}

// Create the component function
export function DocPageTemplate({ title, children }: DocPageTemplateProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/docs" className="hover:text-white">
            Documentation
          </Link>
          <ChevronRight size={14} />
          <span className="text-white">{title}</span>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-purple max-w-none">
          <h1 className="text-4xl font-bold mb-6">{title}</h1>
          {children}
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/docs" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
            ← Back to Documentation
          </Link>
        </div>
      </div>
    </div>
  )
}

// Also export as default for backward compatibility
export default DocPageTemplate
