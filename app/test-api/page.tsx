"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function TestApiPage() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const testApi = async () => {
    setIsLoading(true)
    setError("")
    setResponse("")

    try {
      const res = await fetch("/api/analyze-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: input || "What can you tell me about Solana?",
            },
          ],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.details || data.error || "Unknown error")
      }

      setResponse(data.response || JSON.stringify(data))
    } catch (err: any) {
      console.error("API test error:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>API Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="mb-2">Enter a test message:</p>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What can you tell me about Solana?"
                className="mb-2"
              />
              <Button onClick={testApi} disabled={isLoading}>
                {isLoading ? "Testing..." : "Test API"}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-md">
                <h3 className="font-bold text-red-400 mb-2">Error:</h3>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {response && (
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-md">
                <h3 className="font-bold text-green-400 mb-2">Response:</h3>
                <p className="text-sm whitespace-pre-wrap">{response}</p>
              </div>
            )}

            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-md">
              <h3 className="font-bold text-blue-400 mb-2">Environment Variables Status:</h3>
              <p className="text-sm">
                API keys are configured server-side for security. The API routes will use the OPENAI_API_KEY environment
                variable.
              </p>
              <p className="text-sm mt-2 text-yellow-400">
                Security Note: API keys should never be exposed in client-side code. All API calls are now handled
                securely through server-side code.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
