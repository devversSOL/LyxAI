"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Globe, AlertTriangle, Lightbulb } from "lucide-react"

interface NarrativeAnalysisProps {
  tokenSymbol: string
  tokenName?: string
  tokenAddress?: string
  initialData?: any
}

interface NarrativeData {
  summary: string
  narrativeScore: {
    overall: number
    originality: number
    timeliness: number
    coherence: number
    sustainability: number
    resonance: number
  }
  culturalContext: {
    description: string
    references: string[]
  }
  memeticAnalysis: {
    viralityScore: number
    spreadFactors: string[]
    barriers: string[]
  }
  keyThemes: string[]
}

export default function NarrativeAnalysisDashboard({
  tokenSymbol,
  tokenName,
  tokenAddress,
  initialData,
}: NarrativeAnalysisProps) {
  const [loading, setLoading] = useState(!initialData)
  const [activeTab, setActiveTab] = useState("narrative")
  const [analysisData, setAnalysisData] = useState<NarrativeData | null>(initialData || null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData) {
      fetchAnalysisData()
    }
  }, [tokenSymbol, tokenAddress, initialData])

  const fetchAnalysisData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch social media data for the token
      const socialResponse = await fetch(`/api/token-social/${tokenAddress || tokenSymbol}`)
      const socialData = await socialResponse.json()

      if (!socialData.success) {
        throw new Error(socialData.error || "Failed to fetch social data")
      }

      // Extract text content from social media posts
      const textContent = socialData.data.posts.map((post: any) => post.text).join("\n\n")

      // Send the text for sentiment analysis
      const analysisResponse = await fetch("/api/sentiment-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textContent,
          tokenSymbol,
          tokenName,
          sources: ["Twitter", "Reddit", "News Articles"],
        }),
      })

      const analysisResult = await analysisResponse.json()

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || "Failed to analyze sentiment")
      }

      setAnalysisData(analysisResult.analysis)
    } catch (error: any) {
      console.error("Error fetching analysis data:", error)
      setError(error.message || "An error occurred while analyzing the token")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0a0a18] border border-purple-900/30 rounded-lg p-8">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
        <p className="text-purple-300">Analyzing {tokenName || tokenSymbol} narrative and sentiment...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0a0a18] border border-red-900/30 rounded-lg p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-300 mb-2">Error analyzing token</p>
        <p className="text-sm text-red-200/70">{error}</p>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0a0a18] border border-purple-900/30 rounded-lg p-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-yellow-300">No analysis data available for {tokenName || tokenSymbol}</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a18] text-white rounded-lg overflow-hidden border border-purple-900/30">
      <div className="p-6 border-b border-purple-900/30">
        <h2 className="text-2xl font-light mb-2">Narrative Analysis: {tokenName || tokenSymbol}</h2>
        <p className="text-purple-300 text-sm">AI-powered analysis of token narrative and sentiment</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
        <TabsList className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 p-1 mb-6">
          <TabsTrigger value="narrative" className="data-[state=active]:bg-purple-900/50">
            Narrative Analysis
          </TabsTrigger>
          <TabsTrigger value="cultural" className="data-[state=active]:bg-purple-900/50">
            Cultural Context
          </TabsTrigger>
          <TabsTrigger value="memetic" className="data-[state=active]:bg-purple-900/50">
            Memetic Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="narrative" className="mt-0 space-y-6">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-light">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300">{analysisData.summary}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {analysisData.keyThemes.map((theme, index) => (
                  <Badge key={index} className="bg-purple-900/50 text-purple-200 px-3 py-1">
                    {theme}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 md:col-span-2 relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-light">Narrative Score</CardTitle>
                <CardDescription>Overall assessment of the token's narrative</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="absolute top-6 right-6 text-5xl font-bold text-green-400">
                  {analysisData.narrativeScore.overall}/10
                </div>
                <div className="space-y-4 mt-4">
                  <ScoreBar label="Originality" value={analysisData.narrativeScore.originality} />
                  <ScoreBar label="Timeliness" value={analysisData.narrativeScore.timeliness} />
                  <ScoreBar label="Coherence" value={analysisData.narrativeScore.coherence} />
                  <ScoreBar label="Sustainability" value={analysisData.narrativeScore.sustainability} />
                  <ScoreBar label="Resonance" value={analysisData.narrativeScore.resonance} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-light">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">
                      {analysisData.narrativeScore.originality > 7
                        ? "Highly original narrative with distinctive positioning"
                        : "Standard narrative that follows established patterns"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">
                      {analysisData.narrativeScore.sustainability > 7
                        ? "Sustainable long-term narrative potential"
                        : "May face narrative challenges over time"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">
                      {analysisData.narrativeScore.resonance > 7
                        ? "Strong resonance with target audience"
                        : "Limited audience connection and engagement"}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cultural" className="mt-0">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-light">Cultural Context</CardTitle>
              <CardDescription>The token's cultural significance and references</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-6">{analysisData.culturalContext.description}</p>

              <div className="mt-4">
                <h4 className="text-sm text-purple-300 mb-2">Cultural References</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisData.culturalContext.references.map((reference, index) => (
                    <Badge key={index} variant="outline" className="bg-[#1a1a3a]/50 border-purple-500/30">
                      <Globe className="h-3 w-3 mr-1" />
                      {reference}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memetic" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-light">Memetic Analysis</CardTitle>
                <CardDescription>Viral potential assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg">Virality Score:</span>
                  <span className="text-2xl font-bold text-blue-400">
                    {analysisData.memeticAnalysis.viralityScore}/10
                  </span>
                </div>

                <div className="w-full h-3 bg-white/10 rounded-full mb-6">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${analysisData.memeticAnalysis.viralityScore * 10}%` }}
                  ></div>
                </div>

                <p className="text-sm text-zinc-400 mb-4">
                  {analysisData.memeticAnalysis.viralityScore >= 8
                    ? "High viral potential with strong memetic elements"
                    : analysisData.memeticAnalysis.viralityScore >= 5
                      ? "Moderate viral potential with some memetic elements"
                      : "Low viral potential with limited memetic elements"}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-light">Spread Factors</CardTitle>
                  <CardDescription>Elements that enhance viral spread</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisData.memeticAnalysis.spreadFactors.map((factor, index) => (
                      <div key={index} className="p-2 bg-green-900/20 border border-green-500/30 rounded-md">
                        <span className="text-green-300">{factor}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-light">Barriers</CardTitle>
                  <CardDescription>Factors limiting viral potential</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisData.memeticAnalysis.barriers.map((barrier, index) => (
                      <div key={index} className="p-2 bg-red-900/20 border border-red-500/30 rounded-md">
                        <span className="text-red-300">{barrier}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper component for score bars
function ScoreBar({ label, value }: { label: string; value: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500"
    if (score >= 6) return "bg-blue-500"
    if (score >= 4) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className="text-sm font-medium">{value}/10</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full">
        <div className={`h-full rounded-full ${getScoreColor(value)}`} style={{ width: `${value * 10}%` }}></div>
      </div>
    </div>
  )
}
