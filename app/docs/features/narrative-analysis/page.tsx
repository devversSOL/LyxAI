"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import SimpleMermaid from "@/components/simple-mermaid"

export default function NarrativeAnalysisPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
        <Link href="/docs" className="hover:text-white flex items-center gap-1">
          <ChevronLeft size={16} />
          <span>Documentation</span>
        </Link>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-6">📊 Narrative Analysis</h1>

        <p className="text-xl text-zinc-300 mb-8">
          The Narrative Analysis feature helps you understand market sentiment, identify emerging trends, and track
          narrative shifts in the crypto market.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">How It Works</h2>
        <SimpleMermaid
          chart={`
graph TD
    A["Social Media Data"] --> B["Data Collection"]
    B --> C["Text Processing"]
    C --> D["Sentiment Analysis"]
    C --> E["Topic Extraction"]
    C --> F["Entity Recognition"]
    
    D --> G["Sentiment Aggregation"]
    E --> H["Topic Clustering"]
    F --> I["Entity Linking"]
    
    G --> J["Sentiment Dashboard"]
    H --> K["Trend Identification"]
    I --> L["Entity Network"]
    
    J --> M["Narrative Analysis Dashboard"]
    K --> M
    L --> M
`}
        />

        <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 mb-6 text-zinc-300">
          <li>Real-time sentiment analysis across multiple social platforms</li>
          <li>Topic extraction and trend identification</li>
          <li>Entity recognition and relationship mapping</li>
          <li>Narrative shift detection and alerting</li>
          <li>Historical sentiment analysis and comparison</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Data Sources</h2>
        <p className="text-zinc-300 mb-4">
          The Narrative Analysis feature aggregates data from multiple social media platforms and crypto communities:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Twitter/X</h3>
            <p className="text-zinc-300 text-sm">Real-time tweets and engagement metrics</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Discord</h3>
            <p className="text-zinc-300 text-sm">Community discussions and announcements</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Telegram</h3>
            <p className="text-zinc-300 text-sm">Group chats and project channels</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Reddit</h3>
            <p className="text-zinc-300 text-sm">Subreddit discussions and sentiment</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Sentiment Analysis Methodology</h2>
        <p className="text-zinc-300 mb-4">
          Our sentiment analysis uses advanced natural language processing techniques to evaluate text across multiple
          dimensions:
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-zinc-800/50 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Dimension</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Measurement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Polarity</td>
                <td className="px-4 py-2 border-t border-zinc-700">Positive vs. negative sentiment</td>
                <td className="px-4 py-2 border-t border-zinc-700">-1.0 to 1.0 scale</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Intensity</td>
                <td className="px-4 py-2 border-t border-zinc-700">Strength of sentiment expressed</td>
                <td className="px-4 py-2 border-t border-zinc-700">0.0 to 1.0 scale</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Subjectivity</td>
                <td className="px-4 py-2 border-t border-zinc-700">Opinion vs. factual content</td>
                <td className="px-4 py-2 border-t border-zinc-700">0.0 to 1.0 scale</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-zinc-700">Emotion</td>
                <td className="px-4 py-2 border-t border-zinc-700">Specific emotions detected</td>
                <td className="px-4 py-2 border-t border-zinc-700">Joy, fear, anger, surprise, etc.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Trend Identification Process</h2>
        <SimpleMermaid
          chart={`
sequenceDiagram
    participant Data as Data Collection
    participant Process as Text Processing
    participant Topic as Topic Modeling
    participant Trend as Trend Analysis
    participant Alert as Alert System
    
    Data->>Process: Raw Social Data
    Process->>Topic: Processed Text
    Topic->>Topic: LDA Topic Modeling
    Topic->>Topic: Keyword Extraction
    Topic->>Trend: Topic Clusters
    
    Trend->>Trend: Time Series Analysis
    Trend->>Trend: Velocity Calculation
    Trend->>Trend: Volume Analysis
    
    Trend->>Alert: Emerging Trends
    Alert->>Alert: Threshold Evaluation
    Alert->>Alert: Notification Generation
`}
        />

        <h2 className="text-2xl font-bold mt-8 mb-4">Using the Narrative Analysis Dashboard</h2>
        <div className="bg-zinc-800/50 p-6 rounded-lg mb-8">
          <ol className="list-decimal pl-6 mb-0 text-zinc-300">
            <li className="mb-2">Select a token or topic to analyze</li>
            <li className="mb-2">View the sentiment overview across different platforms</li>
            <li className="mb-2">Explore trending topics and emerging narratives</li>
            <li className="mb-2">Analyze sentiment changes over time</li>
            <li className="mb-2">Set up alerts for significant narrative shifts</li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Market Sentiment Tracking</h3>
            <p className="text-zinc-300 text-sm">
              Monitor overall market sentiment and identify shifts in investor mood.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Trend Spotting</h3>
            <p className="text-zinc-300 text-sm">
              Identify emerging narratives and trends before they become mainstream.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Project Monitoring</h3>
            <p className="text-zinc-300 text-sm">Track sentiment around specific projects or tokens over time.</p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Competitive Analysis</h3>
            <p className="text-zinc-300 text-sm">Compare sentiment and narrative strength across competing projects.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Technical Implementation</h2>
        <p className="text-zinc-300 mb-6">
          The Narrative Analysis feature leverages advanced natural language processing and machine learning techniques:
        </p>
        <ul className="list-disc pl-6 mb-6 text-zinc-300">
          <li>BERT-based sentiment analysis models fine-tuned for crypto terminology</li>
          <li>Latent Dirichlet Allocation (LDA) for topic modeling</li>
          <li>Named Entity Recognition (NER) for identifying projects, people, and events</li>
          <li>Time series analysis for trend detection and forecasting</li>
          <li>Graph-based algorithms for relationship mapping</li>
        </ul>
      </div>
    </div>
  )
}
