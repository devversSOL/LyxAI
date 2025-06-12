"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

export function TrendingScoreAlgorithm() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        flowchart TD
            A[Token Data] --> B[Volume Change %]
            A --> C[Price Change %]
            A --> D[Transaction Count]
            A --> E[Unique Traders]
            
            B --> F{Volume Increase?}
            F -->|>50%| G[+3 Points]
            F -->|20-50%| H[+2 Points]
            F -->|<20%| I[+1 Point]
            
            C --> J{Price Movement?}
            J -->|>10%| K[+2 Points]
            J -->|5-10%| L[+1 Point]
            J -->|<5%| M[+0 Points]
            
            D --> N[Transaction Score]
            E --> O[Trader Score]
            
            G --> P[Calculate Final Score]
            H --> P
            I --> P
            K --> P
            L --> P
            M --> P
            N --> P
            O --> P
            
            P --> Q[Trending Rank]
      `

      mermaid.render(`trending-score-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Trending Score Algorithm</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function RealTimeUpdateMechanism() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        sequenceDiagram
            participant S as Scheduler
            participant API as Trending API
            participant EXT as External APIs
            participant CACHE as Redis Cache
            participant UI as Frontend
            
            loop Every 5 minutes
                S->>API: Trigger update
                API->>EXT: Fetch latest data
                EXT-->>API: Market data
                API->>API: Calculate trending scores
                API->>CACHE: Update cache
                CACHE-->>UI: Push update via WebSocket
                UI-->>UI: Refresh conveyor display
            end
      `

      mermaid.render(`realtime-trending-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Real-time Update Mechanism</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function ConveyorAnimationSystem() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        stateDiagram-v2
            [*] --> Loading
            Loading --> Animating: Data loaded
            
            Animating --> Paused: User hovers
            Paused --> Animating: Mouse leaves
            
            Animating --> Updating: New data received
            Updating --> Animating: Update complete
            
            Animating --> Error: API failure
            Error --> Loading: Retry
      `

      mermaid.render(`conveyor-animation-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Conveyor Animation System</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}

export function PerformanceOptimization() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const chart = `
        graph LR
            A[Trending Data] --> B[Virtualization]
            B --> C[Visible Items Only]
            C --> D[Smooth Scrolling]
            
            E[Animation Loop] --> F[RequestAnimationFrame]
            F --> G[GPU Acceleration]
            G --> H[Transform3D]
            
            I[Data Updates] --> J[Debounced Updates]
            J --> K[Batch DOM Changes]
            K --> L[Minimal Reflows]
            
            C --> M[Optimized Rendering]
            H --> M
            L --> M
      `

      mermaid.render(`performance-optimization-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [])

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Performance Optimization</h3>
      <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
        <div ref={ref} />
      </div>
    </div>
  )
}
