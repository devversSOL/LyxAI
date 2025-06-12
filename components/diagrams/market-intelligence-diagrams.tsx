"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

export function MarketAnalysisEngine() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        flowchart TD
            A[Raw Market Data] --> B[Price Analysis]
            A --> C[Volume Analysis]
            A --> D[Liquidity Analysis]
            
            B --> E[Price Trends]
            B --> F[Support/Resistance]
            C --> G[Volume Patterns]
            C --> H[Trading Activity]
            D --> I[Liquidity Depth]
            D --> J[Slippage Analysis]
            
            E --> K[Market Insights]
            F --> K
            G --> K
            H --> K
            I --> K
            J --> K
            
            K --> L[Dashboard Widgets]
      `

      mermaid.render(`market-analysis-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Market Analysis Engine</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function RealTimeDataFlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        sequenceDiagram
            participant DS as Data Sources
            participant AG as Aggregator
            participant PROC as Processor
            participant CACHE as Cache
            participant WS as WebSocket
            participant UI as Dashboard
            
            loop Every 30 seconds
                DS->>AG: Market data
                AG->>PROC: Aggregate data
                PROC->>PROC: Calculate metrics
                PROC->>CACHE: Update cache
                CACHE->>WS: Broadcast changes
                WS->>UI: Real-time updates
                UI->>UI: Update charts/widgets
            end
      `

      mermaid.render(`realtime-data-flow-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Real-time Data Flow</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function FilterAndSearchSystem() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        stateDiagram-v2
            [*] --> AllTokens
            AllTokens --> Filtering: Apply filters
            AllTokens --> Searching: Search query
            
            Filtering --> FilteredView: Filters applied
            Searching --> SearchResults: Search executed
            
            FilteredView --> CombinedView: Add search
            SearchResults --> CombinedView: Add filters
            
            CombinedView --> AllTokens: Clear all
            FilteredView --> AllTokens: Clear filters
            SearchResults --> AllTokens: Clear search
            
            CombinedView --> TokenDetails: Select token
            FilteredView --> TokenDetails: Select token
            SearchResults --> TokenDetails: Select token
            
            TokenDetails --> AllTokens: Back to dashboard
      `

      mermaid.render(`filter-search-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Filter and Search System</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function ExportFunctionality() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        graph TD
            A[Export Request] --> B{Export Type?}
            B -->|CSV| C[Generate CSV]
            B -->|JSON| D[Generate JSON]
            B -->|PDF| E[Generate PDF Report]
            
            C --> F[Format Data]
            D --> G[Structure JSON]
            E --> H[Create PDF Layout]
            
            F --> I[Download CSV]
            G --> J[Download JSON]
            H --> K[Download PDF]
            
            L[Current Filters] --> M[Apply to Export]
            M --> F
            M --> G
            M --> H
      `

      mermaid.render(`export-functionality-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Export Functionality</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function PerformanceMonitoring() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        graph LR
            A[Dashboard Load] --> B[Performance Monitor]
            B --> C[Measure Metrics]
            C --> D[Load Time]
            C --> E[Render Time]
            C --> F[API Response Time]
            
            D --> G{Load > 3s?}
            E --> H{Render > 1s?}
            F --> I{API > 2s?}
            
            G -->|Yes| J[Optimize Loading]
            H -->|Yes| K[Optimize Rendering]
            I -->|Yes| L[Cache API Calls]
            
            J --> M[Better UX]
            K --> M
            L --> M
      `

      mermaid.render(`performance-monitoring-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Performance Monitoring</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}
