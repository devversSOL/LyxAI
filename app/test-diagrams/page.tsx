import Link from "next/link"
import { Home } from "lucide-react"
import {
  WhaleTrackerDataFlow,
  TokenFilteringProcess,
  RealTimeUpdateMechanism,
} from "@/components/diagrams/whale-tracker-diagrams"
import {
  SmartDatabasePriority,
  MultiSourceDataIntegration,
  RiskAssessmentAlgorithm,
  ChatInterfaceFlow,
} from "@/components/diagrams/token-analyzer-diagrams"

export default function TestDiagrams() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4">
            <Home size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">🧪 Diagram Testing</h1>
          <p className="text-zinc-300">Testing all Mermaid diagrams to ensure proper rendering</p>
        </div>

        {/* Whale Tracker Diagrams */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">🐋 Whale Tracker Diagrams</h2>
          <WhaleTrackerDataFlow />
          <TokenFilteringProcess />
          <RealTimeUpdateMechanism />
        </section>

        {/* Token Analyzer Diagrams */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">🤖 Token Analyzer Diagrams</h2>
          <SmartDatabasePriority />
          <MultiSourceDataIntegration />
          <RiskAssessmentAlgorithm />
          <ChatInterfaceFlow />
        </section>

        {/* Status */}
        <section className="mt-12 p-6 bg-gray-900/50 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold mb-4">✅ Diagram Status</h3>
          <p className="text-zinc-300">
            All diagrams should render as visual flowcharts, sequence diagrams, and state diagrams. If you see raw text
            instead of graphics, there may be a JavaScript loading issue.
          </p>
        </section>
      </div>
    </div>
  )
}
