"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

export function DatabaseOperations() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        sequenceDiagram
            participant U as User
            participant UI as Frontend
            participant API as API Route
            participant DB as Supabase
            participant V as Validator
            
            U->>UI: Add New Wallet
            UI->>V: Validate Address Format
            V-->>UI: Validation Result
            
            alt Valid Address
                UI->>API: POST /api/saved-wallets
                API->>DB: INSERT wallet record
                DB-->>API: Success response
                API-->>UI: Wallet saved
                UI-->>U: Show success message
            else Invalid Address
                UI-->>U: Show error message
            end
      `

      mermaid.render(`database-operations-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Database Operations</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function WalletAnalysisIntegration() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        flowchart LR
            A[Saved Wallet] --> B[Quick Actions]
            B --> C[Analyze Wallet]
            B --> D[View Transactions]
            B --> E[Track Performance]
            
            C --> F[Wallet Info API]
            D --> G[Transaction History]
            E --> H[Performance Metrics]
            
            F --> I[Display Analysis]
            G --> J[Show Transactions]
            H --> K[Show Charts]
            
            I --> L[User Dashboard]
            J --> L
            K --> L
      `

      mermaid.render(`wallet-analysis-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Wallet Analysis Integration</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function BulkOperations() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        graph TD
            A[Bulk Action] --> B{Operation Type?}
            B -->|Import| C[Parse CSV/JSON]
            B -->|Export| D[Generate File]
            B -->|Delete Multiple| E[Batch Delete]
            
            C --> F[Validate Each Address]
            F --> G{All Valid?}
            G -->|Yes| H[Batch Insert]
            G -->|No| I[Show Validation Errors]
            
            D --> J[Query All Wallets]
            J --> K[Format Data]
            K --> L[Download File]
            
            E --> M[Confirm Selection]
            M --> N[Batch Delete]
            N --> O[Update UI]
            
            H --> O
            L --> P[User Downloads]
      `

      mermaid.render(`bulk-operations-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Bulk Operations</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function SearchAndFilterSystem() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        stateDiagram-v2
            [*] --> AllWallets
            AllWallets --> Searching: User types in search
            AllWallets --> Filtering: User applies filter
            
            Searching --> FilteredResults: Search executed
            Filtering --> FilteredResults: Filter applied
            
            FilteredResults --> AllWallets: Clear filters
            FilteredResults --> Searching: Modify search
            FilteredResults --> Filtering: Change filter
            
            FilteredResults --> WalletSelected: User clicks wallet
            WalletSelected --> WalletDetails: Show details
            WalletDetails --> AllWallets: Back to list
      `

      mermaid.render(`search-filter-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Search and Filter System</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}
