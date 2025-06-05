"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, Twitter } from "lucide-react"

interface XSentimentProps {
  tokenSymbol: string
  tokenName?: string
  twitterHandle?: string
}

interface SentimentData {
  overallSentiment: number // -100 to 100
  sentimentBreakdown: {
    positive: number
    neutral: number
    negative: number
  }
  topPositiveTweets: Array<{
    text: string
    sentiment: number
    likes: number
    retweets: number
    date: string
  }>
  topNegativeTweets: Array<{
    text: string
    sentiment: number
    likes: number
    retweets: number
    date: string
  }>
  sentimentTrend: Array<{
    date: string
    sentiment: number
  }>
  keyTopics: Array<{
    topic: string
    sentiment: number
    volume: number
  }>
}

export default function XSentimentAnalyzer({ tokenSymbol, tokenName, twitterHandle }: XSentimentProps) {
  const [loading, setLoading] = useState(true)
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchSentimentData()
  }, [tokenSymbol, twitterHandle])

  const fetchSentimentData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch Twitter data for sentiment analysis
      const response = await fetch("/api/x-sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenSymbol,
          tokenName,
          twitterHandle: twitterHandle || tokenSymbol,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error fetching sentiment data: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to analyze X sentiment")
      }

      setSentimentData(data.sentimentData)
    } catch (error: any) {
      console.error("Error fetching X sentiment:", error)
      setError(error.message || "An error occurred while analyzing X sentiment")
    } finally {
      setLoading(false)
    }
  }

  // Function to get sentiment color
  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 50) return "text-green-400"
    if (sentiment >= 0) return "text-blue-400"
    if (sentiment >= -50) return "text-yellow-400"
    return "text-red-400"
  }

  // Function to get sentiment label
  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 75) return "Very Positive"
    if (sentiment >= 50) return "Positive"
    if (sentiment >= 25) return "Somewhat Positive"
    if (sentiment >= 0) return "Neutral-Positive"
    if (sentiment >= -25) return "Neutral-Negative"
    if (sentiment >= -50) return "Somewhat Negative"
    if (sentiment >= -75) return "Negative"
    return "Very Negative"
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0a0a18] border border-purple-900/30 rounded-lg p-8">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
        <p className="text-purple-300">Analyzing X sentiment for {tokenName || tokenSymbol}...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0a0a18] border border-red-900/30 rounded-lg p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-300 mb-2">Error analyzing X sentiment</p>
        <p className="text-sm text-red-200/70">{error}</p>
        <Button variant="outline" className="mt-4 border-red-500/30 hover:bg-red-900/20" onClick={fetchSentimentData}>
          Retry Analysis
        </Button>
      </div>
    )
  }

  if (!sentimentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0a0a18] border border-purple-900/30 rounded-lg p-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-yellow-300">No X sentiment data available for {tokenName || tokenSymbol}</p>
        <Button
          variant="outline"
          className="mt-4 border-purple-500/30 hover:bg-purple-900/20"
          onClick={fetchSentimentData}
        >
          Run Analysis
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a18] text-white rounded-lg overflow-hidden border border-purple-900/30">
      <div className="p-6 border-b border-purple-900/30 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light mb-2">X Sentiment Analysis: {tokenName || tokenSymbol}</h2>
          <p className="text-purple-300 text-sm">AI-powered analysis of X (Twitter) sentiment</p>
        </div>
        <Twitter className="h-8 w-8 text-blue-400" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
        <TabsList className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 p-1 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900/50">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tweets" className="data-[state=active]:bg-purple-900/50">
            Top Tweets
          </TabsTrigger>
          <TabsTrigger value="topics" className="data-[state=active]:bg-purple-900/50">
            Key Topics
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-purple-900/50">
            Sentiment Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-light">Overall Sentiment</CardTitle>
                <CardDescription>X sentiment analysis for {tokenName || tokenSymbol}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6">
                  <div className={`text-6xl font-bold mb-2 ${getSentimentColor(sentimentData.overallSentiment)}`}>
                    {sentimentData.overallSentiment > 0 ? "+" : ""}
                    {sentimentData.overallSentiment}
                  </div>
                  <div className={`text-xl ${getSentimentColor(sentimentData.overallSentiment)}`}>
                    {getSentimentLabel(sentimentData.overallSentiment)}
                  </div>

                  <div className="w-full h-4 bg-white/10 rounded-full mt-8 mb-2 overflow-hidden">
                    <div className="flex h-full">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${sentimentData.sentimentBreakdown.positive}%` }}
                      ></div>
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${sentimentData.sentimentBreakdown.neutral}%` }}
                      ></div>
                      <div
                        className="bg-red-500 h-full"
                        style={{ width: `${sentimentData.sentimentBreakdown.negative}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between w-full text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Positive: {sentimentData.sentimentBreakdown.positive}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Neutral: {sentimentData.sentimentBreakdown.neutral}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Negative: {sentimentData.sentimentBreakdown.negative}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-light">Sentiment Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    {sentimentData.overallSentiment >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-zinc-300">
                      {sentimentData.overallSentiment >= 50
                        ? "Very strong positive sentiment indicates high community confidence"
                        : sentimentData.overallSentiment >= 0
                          ? "Moderately positive sentiment suggests cautious optimism"
                          : sentimentData.overallSentiment >= -50
                            ? "Slightly negative sentiment indicates some community concerns"
                            : "Strongly negative sentiment suggests significant community issues"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        sentimentData.sentimentBreakdown.negative > 40
                          ? "text-red-400"
                          : sentimentData.sentimentBreakdown.negative > 20
                            ? "text-yellow-400"
                            : "text-green-400"
                      } mt-0.5 flex-shrink-0`}
                    />
                    <span className="text-zinc-300">
                      {sentimentData.sentimentBreakdown.negative > 40
                        ? "High negative sentiment requires immediate community management"
                        : sentimentData.sentimentBreakdown.negative > 20
                          ? "Moderate negative sentiment suggests addressing community concerns"
                          : "Low negative sentiment indicates healthy community perception"}
                    </span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10">
                    <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                    <ul className="space-y-2 text-sm text-zinc-300">
                      {sentimentData.overallSentiment >= 50 ? (
                        <>
                          <li>• Leverage positive sentiment for community expansion</li>
                          <li>• Highlight positive community feedback in marketing</li>
                          <li>• Continue current community engagement strategy</li>
                        </>
                      ) : sentimentData.overallSentiment >= 0 ? (
                        <>
                          <li>• Address specific community concerns</li>
                          <li>• Increase transparency in communications</li>
                          <li>• Highlight project milestones and achievements</li>
                        </>
                      ) : (
                        <>
                          <li>• Urgently address negative sentiment drivers</li>
                          <li>• Increase community engagement and support</li>
                          <li>• Consider a community AMA to address concerns</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tweets" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-light">Top Positive Tweets</CardTitle>
                <CardDescription>Most influential positive mentions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentimentData.topPositiveTweets.map((tweet, index) => (
                    <div key={index} className="p-3 bg-green-900/10 border border-green-500/30 rounded-lg">
                      <p className="text-zinc-300 mb-2">{tweet.text}</p>
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Sentiment: +{tweet.sentiment}</span>
                        <span>
                          ❤️ {tweet.likes} | 🔄 {tweet.retweets}
                        </span>
                        <span>{new Date(tweet.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-light">Top Negative Tweets</CardTitle>
                <CardDescription>Most influential negative mentions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentimentData.topNegativeTweets.map((tweet, index) => (
                    <div key={index} className="p-3 bg-red-900/10 border border-red-500/30 rounded-lg">
                      <p className="text-zinc-300 mb-2">{tweet.text}</p>
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Sentiment: {tweet.sentiment}</span>
                        <span>
                          ❤️ {tweet.likes} | 🔄 {tweet.retweets}
                        </span>
                        <span>{new Date(tweet.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="mt-0">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-light">Key Topics</CardTitle>
              <CardDescription>Most discussed topics and their sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentimentData.keyTopics.map((topic, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      topic.sentiment > 50
                        ? "bg-green-900/10 border-green-500/30"
                        : topic.sentiment > 0
                          ? "bg-blue-900/10 border-blue-500/30"
                          : topic.sentiment > -50
                            ? "bg-yellow-900/10 border-yellow-500/30"
                            : "bg-red-900/10 border-red-500/30"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{topic.topic}</h3>
                      <span className={`text-sm ${getSentimentColor(topic.sentiment)}`}>
                        {topic.sentiment > 0 ? "+" : ""}
                        {topic.sentiment}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          topic.sentiment > 50
                            ? "bg-green-500"
                            : topic.sentiment > 0
                              ? "bg-blue-500"
                              : topic.sentiment > -50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${Math.abs(topic.sentiment)}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-zinc-400">Volume: {topic.volume} mentions</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-0">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-light">Sentiment Trends</CardTitle>
              <CardDescription>How sentiment has changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-light mb-2">Sentiment Trend Chart</div>
                  <div className="text-sm text-zinc-400">
                    (This would be a chart showing sentiment trends over time)
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Trend Analysis</h3>
                <p className="text-zinc-300">
                  {sentimentData.sentimentTrend[sentimentData.sentimentTrend.length - 1].sentiment >
                  sentimentData.sentimentTrend[0].sentiment
                    ? "Sentiment is improving over time, indicating growing community confidence."
                    : sentimentData.sentimentTrend[sentimentData.sentimentTrend.length - 1].sentiment <
                        sentimentData.sentimentTrend[0].sentiment
                      ? "Sentiment is declining over time, suggesting increasing community concerns."
                      : "Sentiment has remained relatively stable over the analyzed period."}
                </p>

                <div className="pt-4 mt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium mb-2">Key Sentiment Shifts:</h4>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    {sentimentData.sentimentTrend
                      .map((point, index) => {
                        if (index === 0) return null
                        const prevPoint = sentimentData.sentimentTrend[index - 1]
                        const change = point.sentiment - prevPoint.sentiment
                        if (Math.abs(change) < 10) return null

                        return (
                          <li key={index} className="flex items-center gap-2">
                            {change > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-400" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-400" />
                            )}
                            <span>
                              {new Date(point.date).toLocaleDateString()}: {change > 0 ? "+" : ""}
                              {change} point shift
                            </span>
                          </li>
                        )
                      })
                      .filter(Boolean)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
