import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import SimpleMermaid from "@/components/simple-mermaid"

export default function ContractAnalyzerDocs() {
  const securityAssessmentFlow = `
    sequenceDiagram
      participant U as User
      participant CA as Contract Analyzer
      participant SC as Solscan
      participant AI as AI Engine
      participant DB as Database
      
      U->>CA: Submit Contract Address
      CA->>SC: Fetch Program Data
      SC-->>CA: Program Bytecode & Metadata
      
      CA->>CA: Static Code Analysis
      CA->>AI: Analyze for Vulnerabilities
      AI-->>CA: Security Assessment
      
      CA->>CA: Calculate Risk Score
      CA->>DB: Store Analysis Results
      CA-->>U: Display Security Report
  `

  const riskScoringMatrix = `
    graph TD
      A[Contract Analysis] --> B{Authority Checks}
      A --> C{Reentrancy Guards}
      A --> D{Input Validation}
      A --> E{Access Controls}
      
      B -->|Present| F[+3 Security Points]
      B -->|Missing| G[-5 Security Points]
      C -->|Implemented| H[+2 Security Points]
      C -->|Missing| I[-3 Security Points]
      D -->|Proper| J[+2 Security Points]
      D -->|Insufficient| K[-2 Security Points]
      E -->|Robust| L[+3 Security Points]
      E -->|Weak| M[-4 Security Points]
      
      F --> N[Calculate Total Score]
      G --> N
      H --> N
      I --> N
      J --> N
      K --> N
      L --> N
      M --> N
      
      N --> O{Total Score}
      O -->|>= 8| P[🟢 Low Risk]
      O -->|4-7| Q[🟡 Medium Risk]
      O -->|0-3| R[🟠 High Risk]
      O -->|< 0| S[🔴 Critical Risk]
  `

  const vulnerabilityDetection = `
    flowchart LR
      A[Contract Bytecode] --> B[Static Analysis]
      A --> C[Dynamic Analysis]
      A --> D[Pattern Matching]
      
      B --> E[Code Structure]
      B --> F[Function Analysis]
      C --> G[Execution Paths]
      C --> H[State Changes]
      D --> I[Known Vulnerabilities]
      D --> J[Suspicious Patterns]
      
      E --> K[Security Scorer]
      F --> K
      G --> K
      H --> K
      I --> K
      J --> K
      
      K --> L[Risk Categories]
      L --> M[Final Security Score]
  `

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4">
            <Home size={16} />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/docs" className="hover:text-white">
              Documentation
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">Contract Analyzer</span>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-purple max-w-none">
          <h1 className="text-4xl font-bold mb-6">🔍 Contract Analyzer</h1>

          <p className="text-xl text-zinc-300 mb-8">
            Comprehensive Solana smart contract analysis tool with AI-powered security assessment and vulnerability
            detection.
          </p>

          <h2 className="text-2xl font-bold mb-4">Security Assessment Process</h2>
          <p className="text-zinc-300 mb-4">
            The complete flow from contract submission to security report generation:
          </p>

          <SimpleMermaid chart={securityAssessmentFlow} />

          <h3 className="text-xl font-semibold mb-4">Key Features</h3>
          <ul className="text-zinc-300 space-y-2 mb-6">
            <li>
              <strong>AI-Powered Insights:</strong> Deep contract analysis using advanced AI
            </li>
            <li>
              <strong>Security Assessment:</strong> Identifies potential risks and vulnerabilities in Solana contracts
            </li>
            <li>
              <strong>Interactive Chat:</strong> Real-time conversation about contract details
            </li>
            <li>
              <strong>Risk Scoring:</strong> Quantified risk assessment for informed decisions
            </li>
            <li>
              <strong>Solana-Specific Analysis:</strong> Tailored for Solana program architecture
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Vulnerability Detection Framework</h2>
          <p className="text-zinc-300 mb-4">
            Multi-layered approach to identify security vulnerabilities and suspicious patterns:
          </p>

          <SimpleMermaid chart={vulnerabilityDetection} />

          <h2 className="text-2xl font-bold mb-4">Risk Scoring Matrix</h2>
          <p className="text-zinc-300 mb-4">
            How the system calculates security scores based on various contract analysis factors:
          </p>

          <SimpleMermaid chart={riskScoringMatrix} />

          <h3 className="text-xl font-semibold mb-4">Security Factors Analyzed</h3>
          <ul className="text-zinc-300 space-y-2 mb-6">
            <li>
              <strong>Authority Checks:</strong> Proper permission and authority validation
            </li>
            <li>
              <strong>Reentrancy Guards:</strong> Protection against reentrancy attacks
            </li>
            <li>
              <strong>Input Validation:</strong> Proper sanitization and validation of inputs
            </li>
            <li>
              <strong>Access Controls:</strong> Robust access control mechanisms
            </li>
            <li>
              <strong>Code Quality:</strong> Overall code structure and best practices
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-4">Analysis Capabilities</h3>
          <ul className="text-zinc-300 space-y-2 mb-6">
            <li>
              <strong>Static Analysis:</strong> Code structure and pattern analysis
            </li>
            <li>
              <strong>Dynamic Analysis:</strong> Execution path and state change analysis
            </li>
            <li>
              <strong>Pattern Matching:</strong> Known vulnerability and suspicious pattern detection
            </li>
            <li>
              <strong>AI Assessment:</strong> Advanced AI-powered security evaluation
            </li>
          </ul>
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
