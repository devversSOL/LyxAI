"use client"

import type React from "react"

interface SVGDiagramProps {
  title: string
  children: React.ReactNode
}

function SVGDiagram({ title, children }: SVGDiagramProps) {
  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <svg viewBox="0 0 800 400" className="w-full h-auto" style={{ maxHeight: "400px" }}>
          {children}
        </svg>
      </div>
    </div>
  )
}

export function WhaleTrackerFlowSVG() {
  return (
    <SVGDiagram title="Whale Tracker Data Flow">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#7c3aed", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Boxes */}
      <rect x="50" y="50" width="120" height="60" rx="8" fill="url(#grad1)" stroke="#ffffff" strokeWidth="2" />
      <text x="110" y="85" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        Discord Alert
      </text>

      <rect x="220" y="50" width="120" height="60" rx="8" fill="url(#grad1)" stroke="#ffffff" strokeWidth="2" />
      <text x="280" y="85" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        Webhook
      </text>

      <rect x="390" y="50" width="120" height="60" rx="8" fill="url(#grad1)" stroke="#ffffff" strokeWidth="2" />
      <text x="450" y="85" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        Parse Message
      </text>

      <polygon points="580,50 650,80 580,110 510,80" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
      <text x="580" y="85" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        Valid Whale?
      </text>

      <rect x="220" y="180" width="120" height="60" rx="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
      <text x="280" y="215" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        Store Data
      </text>

      <rect x="390" y="180" width="120" height="60" rx="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
      <text x="450" y="215" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        Discard
      </text>

      <rect x="220" y="310" width="120" height="60" rx="8" fill="url(#grad1)" stroke="#ffffff" strokeWidth="2" />
      <text x="280" y="345" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        Update UI
      </text>

      {/* Arrows */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
        </marker>
      </defs>

      <line x1="170" y1="80" x2="220" y2="80" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="340" y1="80" x2="390" y2="80" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="510" y1="80" x2="510" y2="80" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowhead)" />

      <line x1="550" y1="110" x2="280" y2="180" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="610" y1="110" x2="450" y2="180" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />

      <line x1="280" y1="240" x2="280" y2="310" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Labels */}
      <text x="480" y="150" fill="#10b981" fontSize="10" fontWeight="bold">
        Yes
      </text>
      <text x="530" y="150" fill="#ef4444" fontSize="10" fontWeight="bold">
        No
      </text>
    </SVGDiagram>
  )
}

export function TokenAnalysisFlowSVG() {
  return (
    <SVGDiagram title="Token Analysis Flow">
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#1d4ed8", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* User Input */}
      <rect x="50" y="50" width="100" height="50" rx="8" fill="url(#grad2)" stroke="#ffffff" strokeWidth="2" />
      <text x="100" y="80" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        User Input
      </text>

      {/* Database Check */}
      <polygon points="200,50 270,75 200,100 130,75" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
      <text x="200" y="80" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        Check DB
      </text>

      {/* Cached Result */}
      <rect x="320" y="30" width="100" height="50" rx="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
      <text x="370" y="60" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        Cached Result
      </text>

      {/* Fetch APIs */}
      <rect x="320" y="120" width="100" height="50" rx="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
      <text x="370" y="150" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        Fetch APIs
      </text>

      {/* AI Analysis */}
      <rect x="470" y="120" width="100" height="50" rx="8" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
      <text x="520" y="150" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        AI Analysis
      </text>

      {/* Final Result */}
      <rect x="620" y="75" width="100" height="50" rx="8" fill="url(#grad2)" stroke="#ffffff" strokeWidth="2" />
      <text x="670" y="105" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        Final Result
      </text>

      {/* Arrows */}
      <line x1="150" y1="75" x2="130" y2="75" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="270" y1="60" x2="320" y2="55" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="270" y1="90" x2="320" y2="145" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="420" y1="145" x2="470" y2="145" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="420" y1="55" x2="620" y2="100" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="570" y1="145" x2="620" y2="110" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Labels */}
      <text x="280" y="45" fill="#10b981" fontSize="9" fontWeight="bold">
        Found
      </text>
      <text x="280" y="110" fill="#f59e0b" fontSize="9" fontWeight="bold">
        Not Found
      </text>
    </SVGDiagram>
  )
}
