"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ApiTestPage() {
  const [apiKey, setApiKey] = useState("")
  const [tokenAddress, setTokenAddress] = useState("5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp")
  const [chatMessage, setChatMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [tokenResponse, setTokenResponse] = useState<any>(null)
  const [socialResponse, setSocialResponse] = useState<any>(null)
  const [chatResponse, setChatResponse] = useState<any>(null)
  const [searchResponse, setSearchResponse] = useState<any>(null)

  const [loading, setLoading] = useState({
    token: false,
    social: false,
    chat: false,
    search: false,
  })

  // Function to make API requests
  const makeRequest = async (endpoint: string, method: string, body?: any) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (apiKey) {
        headers["X-API-Key"] = apiKey
      }

      const options: RequestInit = {
        method,
        headers,
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      return await response.json()
    } catch (error) {
      console.error("API request error:", error)
      return { success: false, error: "Request failed", message: String(error) }
    }
  }

  // Test token analysis API
  const testTokenAnalysis = async () => {
    setLoading((prev) => ({ ...prev, token: true }))
    try {
      const result = await makeRequest("/api/v1/analyze-token", "POST", { address: tokenAddress })
      setTokenResponse(result)
    } finally {
      setLoading((prev) => ({ ...prev, token: false }))
    }
  }

  // Test social data API
  const testSocialData = async () => {
    setLoading((prev) => ({ ...prev, social: true }))
    try {
      const result = await makeRequest(`/api/v1/token-social/${tokenAddress}`, "GET")
      setSocialResponse(result)
    } finally {
      setLoading((prev) => ({ ...prev, social: false }))
    }
  }

  // Test chat API
  const testChatApi = async () => {
    setLoading((prev) => ({ ...prev, chat: true }))
    try {
      const result = await makeRequest("/api/v1/chat", "POST", {
        messages: [{ role: "user", content: chatMessage }],
      })
      setChatResponse(result)
    } finally {
      setLoading((prev) => ({ ...prev, chat: false }))
    }
  }

  // Test token search API
  const testTokenSearch = async () => {
    setLoading((prev) => ({ ...prev, search: true }))
    try {
      const result = await makeRequest(`/api/v1/tokens?query=${encodeURIComponent(searchQuery)}`, "GET")
      setSearchResponse(result)
    } finally {
      setLoading((prev) => ({ ...prev, search: false }))
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">API Test Console</h1>

      <div className="mb-6">
        <Label htmlFor="api-key">API Key (optional for testing)</Label>
        <Input
          id="api-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          className="max-w-md"
        />
        <p className="text-sm text-gray-500 mt-1">Leave blank to use the default test key</p>
      </div>

      <Tabs defaultValue="token">
        <TabsList className="mb-4">
          <TabsTrigger value="token">Token Analysis</TabsTrigger>
          <TabsTrigger value="social">Social Data</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="search">Token Search</TabsTrigger>
        </TabsList>

        <TabsContent value="token">
          <Card>
            <CardHeader>
              <CardTitle>Test Token Analysis API</CardTitle>
              <CardDescription>Analyze a token by its address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="token-address">Token Address</Label>
                  <Input
                    id="token-address"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Enter token address"
                  />
                </div>

                <Button onClick={testTokenAnalysis} disabled={loading.token}>
                  {loading.token ? "Loading..." : "Analyze Token"}
                </Button>

                {tokenResponse && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Response:</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                      {JSON.stringify(tokenResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Test Social Data API</CardTitle>
              <CardDescription>Get social media data for a token</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="social-token-address">Token Address</Label>
                  <Input
                    id="social-token-address"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Enter token address"
                  />
                </div>

                <Button onClick={testSocialData} disabled={loading.social}>
                  {loading.social ? "Loading..." : "Get Social Data"}
                </Button>

                {socialResponse && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Response:</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                      {JSON.stringify(socialResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Test Chat API</CardTitle>
              <CardDescription>Generate a response to a user message</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="chat-message">Message</Label>
                  <Textarea
                    id="chat-message"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Enter your message"
                    rows={4}
                  />
                </div>

                <Button onClick={testChatApi} disabled={loading.chat || !chatMessage}>
                  {loading.chat ? "Loading..." : "Send Message"}
                </Button>

                {chatResponse && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Response:</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                      {JSON.stringify(chatResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Test Token Search API</CardTitle>
              <CardDescription>Search for tokens by name, symbol, or address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search-query">Search Query</Label>
                  <Input
                    id="search-query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter search query"
                  />
                </div>

                <Button onClick={testTokenSearch} disabled={loading.search}>
                  {loading.search ? "Loading..." : "Search Tokens"}
                </Button>

                {searchResponse && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Response:</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                      {JSON.stringify(searchResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
