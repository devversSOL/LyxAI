import Link from "next/link"
import { Home } from "lucide-react"
import { WhaleTrackerFlowSVG, TokenAnalysisFlowSVG } from "@/components/svg-diagrams"

export default function SVGTest() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4">
            <Home size={16} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-4">SVG Diagram Test</h1>
          <p className="text-zinc-300">Testing custom SVG-based diagrams as an alternative to Mermaid</p>
        </div>

        <WhaleTrackerFlowSVG />
        <TokenAnalysisFlowSVG />

        <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-white/10">
          <h3 className="font-semibold mb-2">✅ SVG Diagrams</h3>
          <p className="text-sm text-zinc-300">
            These are custom SVG diagrams that should render immediately without any JavaScript loading issues. They're
            fully responsive and use LyxAI's color scheme.
          </p>
        </div>
      </div>
    </div>
  )
}
