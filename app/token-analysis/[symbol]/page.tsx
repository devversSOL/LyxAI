import { Suspense } from "react"
import { notFound } from "next/navigation"
import NarrativeAnalysisDashboard from "@/components/narrative-analysis-dashboard"
import XSentimentAnalyzer from "@/components/x-sentiment-analyzer"
import { Loader2 } from "lucide-react"

interface TokenAnalysisPageProps {
  params: {
    symbol: string
  }
}

export default function TokenAnalysisPage({ params }: TokenAnalysisPageProps) {
  const { symbol } = params

  if (!symbol) {
    notFound()
  }

  // Decode the symbol from URL format
  const decodedSymbol = decodeURIComponent(symbol)

  return (
    <div className="bg-[#070318] text-white min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-light mb-2">Token Analysis: {decodedSymbol}</h1>
        <p className="text-zinc-400 mb-12">AI-powered sentiment and narrative analysis</p>

        <div className="space-y-12">
          <Suspense fallback={<AnalysisLoader title="Narrative Analysis" />}>
            <NarrativeAnalysisDashboard tokenSymbol={decodedSymbol} />
          </Suspense>

          <Suspense fallback={<AnalysisLoader title="X Sentiment Analysis" />}>
            <XSentimentAnalyzer tokenSymbol={decodedSymbol} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function AnalysisLoader({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0a0a18] border border-purple-900/30 rounded-lg p-8">
      <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
      <p className="text-purple-300">Loading {title}...</p>
    </div>
  )
}
