import Link from "next/link"
import { Home } from "lucide-react"
import MermaidChart from "@/components/mermaid-chart"

export default function DiagramTest() {
  const simpleFlowChart = `
    graph TD
        A[Start] --> B{Is it working?}
        B -->|Yes| C[Great!]
        B -->|No| D[Fix it]
        D --> A
        C --> E[End]
  `

  const whaleTrackerFlow = `
    graph TB
        A[Discord Alert] --> B[Webhook]
        B --> C[Parse Message]
        C --> D{Valid Whale?}
        D -->|Yes| E[Store Data]
        D -->|No| F[Discard]
        E --> G[Update UI]
  `

  const sequenceDiagram = `
    sequenceDiagram
        participant U as User
        participant A as API
        participant D as Database
        
        U->>A: Request
        A->>D: Query
        D-->>A: Data
        A-->>U: Response
  `

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4">
            <Home size={16} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-4">Diagram Test</h1>
          <p className="text-zinc-300">Testing Mermaid diagram rendering</p>
        </div>

        <MermaidChart chart={simpleFlowChart} title="Simple Flow Chart" />

        <MermaidChart chart={whaleTrackerFlow} title="Whale Tracker Flow" />

        <MermaidChart chart={sequenceDiagram} title="Sequence Diagram" />

        <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-white/10">
          <h3 className="font-semibold mb-2">Expected Results:</h3>
          <ul className="text-sm text-zinc-300 space-y-1">
            <li>• Diagrams should render as visual flowcharts, not text</li>
            <li>• Dark theme with purple/blue colors</li>
            <li>• Loading spinner while rendering</li>
            <li>• Error message if rendering fails</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
