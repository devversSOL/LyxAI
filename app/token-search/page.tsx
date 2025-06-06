"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TokenSearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeToken, setActiveToken] = useState<any>(null)

  const searchTokens = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search-tokens?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      setResults(data.tokens || [])
      setActiveToken(null)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchTokens()
    }
  }

  const viewTokenDetails = (token: any) => {
    setActiveToken(token)
  }

  const getRiskColor = (score: number | null) => {
    if (score === null) return "bg-gray-200 text-gray-800"
    if (score >= 80) return "bg-red-500 text-white"
    if (score >= 60) return "bg-orange-500 text-white"
    if (score >= 40) return "bg-yellow-500 text-black"
    return "bg-green-500 text-white"
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Token Narrative Search</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search by token address or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={searchTokens} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>{results.length} tokens found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {results.map((token) => (
                  <div
                    key={token.address}
                    className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                      activeToken?.address === token.address ? "bg-gray-100 border-l-4 border-blue-500" : ""
                    }`}
                    onClick={() => viewTokenDetails(token)}
                  >
                    <div className="font-medium">{token.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{token.address.substring(0, 12)}...</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className={getRiskColor(token.risk_score)}>
                        Risk: {token.risk_score || "N/A"}
                      </Badge>
                    </div>
                  </div>
                ))}

                {results.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">No results found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {activeToken ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{activeToken.name}</CardTitle>
                    <CardDescription className="font-mono">{activeToken.address}</CardDescription>
                  </div>
                  <Badge className={getRiskColor(activeToken.risk_score)}>
                    Risk Score: {activeToken.risk_score || "N/A"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary">
                  <TabsList className="mb-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="analysis">Full Analysis</TabsTrigger>
                    <TabsTrigger value="data">Raw Data</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Short Summary</h3>
                      <p>{activeToken.short_summary}</p>
                    </div>

                    {activeToken.image_description && (
                      <div>
                        <h3 className="font-semibold mb-2">Image Description</h3>
                        <p>{activeToken.image_description}</p>
                      </div>
                    )}

                    {activeToken.total_percentage && (
                      <div>
                        <h3 className="font-semibold mb-2">Analysis Score</h3>
                        <p>Total Percentage: {activeToken.total_percentage}%</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="analysis">
                    <div className="prose max-w-none">
                      <h3 className="font-semibold mb-2">Full Analysis</h3>
                      <p className="whitespace-pre-wrap">{activeToken.full_analysis}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="data">
                    <div>
                      <h3 className="font-semibold mb-2">Raw Data</h3>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                        {JSON.stringify(activeToken, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <p className="text-gray-500">Select a token to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
