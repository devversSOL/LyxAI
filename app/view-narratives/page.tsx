"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ViewNarrativesPage() {
  const [narratives, setNarratives] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNarratives = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/get-narratives")
      const data = await response.json()
      setNarratives(data.narratives || [])
    } catch (error) {
      console.error("Failed to fetch narratives:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNarratives()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stored Token Narratives</h1>
        <Button onClick={fetchNarratives} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <div className="grid gap-4">
        {narratives.map((narrative, index) => (
          <Card key={narrative.address || index}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{narrative.name}</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {narrative.address?.substring(0, 8)}...
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{narrative.short_summary}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Risk Score: {narrative.risk_score || "N/A"}</span>
                  <span>Total %: {narrative.total_percentage || "N/A"}</span>
                  <span>Created: {new Date(narrative.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {narratives.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No token narratives found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
