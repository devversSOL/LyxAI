"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestStorePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testData = {
    address: "CzHc1ugMNhim5JCJC8ebbp4k14jfrbZx1HNcMyEppump",
    name: "OFFICIAL MUSK",
    imageDescription:
      "A stylized portrait of Elon Musk, depicted in black and white, with his name prominently displayed at the top and his signature at the bottom.",
    imageReferences: ["Elon Musk", "OFFICIAL MUSK ($MUSK)"],
    fullAnalysis:
      "The OFFICIAL MUSK token, symbolized as MUSK, encapsulates a unique blend of cryptocurrency enthusiasm, celebrity influence, and meme culture, centered around the figure of Elon Musk.",
    shortSummary:
      "The OFFICIAL MUSK token leverages Elon Musk's complex public image, blending admiration, satire, and political commentary within the crypto meme culture.",
    bundleAnalysis: {
      holderCount: 0,
      isValid: false,
      totalPercentage: 30.249999999999996,
      avgPercentage: 0.42605633802816895,
    },
    riskAssessment: {
      isHighRisk: null,
      riskScore: 75,
    },
  }

  const testStoreEndpoint = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/store-narrative", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to test endpoint", details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Store Narrative Endpoint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Endpoint:</h3>
            <code className="bg-gray-100 p-2 rounded block">POST /api/store-narrative</code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Test Data:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-40">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>

          <Button onClick={testStoreEndpoint} disabled={loading} className="w-full">
            {loading ? "Testing..." : "Test Store Endpoint"}
          </Button>

          {result && (
            <div>
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
