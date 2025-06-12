"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

export function SecurityAssessmentFramework() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
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

      mermaid.render(`security-framework-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Security Assessment Framework</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function VulnerabilityDetectionProcess() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
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

      mermaid.render(`vulnerability-detection-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Vulnerability Detection Process</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function RiskScoringMatrix() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
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

      mermaid.render(`risk-scoring-matrix-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Risk Scoring Matrix</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function InteractiveChatAnalysis() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        stateDiagram-v2
            [*] --> ContractInput
            ContractInput --> Analyzing: Valid contract address
            ContractInput --> Error: Invalid address
            
            Analyzing --> SecurityScan: Fetch contract data
            SecurityScan --> AIAnalysis: Security patterns found
            AIAnalysis --> ReportGeneration: Analysis complete
            ReportGeneration --> ChatReady: Report displayed
            
            ChatReady --> UserQuestion: User asks about contract
            UserQuestion --> AIResponse: Process question
            AIResponse --> ChatReady: Display answer
            
            ChatReady --> NewAnalysis: Analyze different contract
            NewAnalysis --> ContractInput: Reset for new input
            
            Error --> ContractInput: Try again
      `

      mermaid.render(`interactive-chat-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Interactive Chat Analysis</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}
