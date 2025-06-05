"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, RefreshCw, Info } from "lucide-react"

export default function DiscordTestPage() {
  const [connectionData, setConnectionData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [tokenData, setTokenData] = useState<any>(null)
  const [loadingToken, setLoadingToken] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-discord")
      const data = await response.json()
      setConnectionData(data)

      if (!response.ok) {
        setError(data.error || "Failed to connect to Discord")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const verifyToken = async () => {
    setLoadingToken(true)
    setTokenError(null)

    try {
      const response = await fetch("/api/verify-discord-token")
      const data = await response.json()
      setTokenData(data)

      if (!response.ok) {
        setTokenError(data.error || "Failed to verify Discord token")
      }
    } catch (err) {
      setTokenError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoadingToken(false)
    }
  }

  useEffect(() => {
    testConnection()
    verifyToken()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Discord Integration Status</h1>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This page shows the status of your Discord integration. All systems should be operational.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Token Verification Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Discord Bot Token Verification
              <Button variant="outline" size="sm" onClick={verifyToken} disabled={loadingToken}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingToken ? "animate-spin" : ""}`} />
                {loadingToken ? "Verifying..." : "Verify Token"}
              </Button>
            </CardTitle>
            <CardDescription>
              Checks if your Discord bot token is valid by authenticating with the Discord API
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tokenError ? (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{tokenError}</AlertDescription>
              </Alert>
            ) : tokenData?.success ? (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Token is valid. Bot name: {tokenData.botInfo.username}
                </AlertDescription>
              </Alert>
            ) : null}

            {tokenData && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Token Verification Details:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60 text-sm">
                  {JSON.stringify(tokenData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Test Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Discord API Connection Test
              <Button variant="outline" size="sm" onClick={testConnection} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Testing..." : "Test Connection"}
              </Button>
            </CardTitle>
            <CardDescription>
              Tests if we can connect to Discord and fetch messages from the configured channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : connectionData?.success ? (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Successfully connected to Discord and fetched {connectionData.messageCount} messages.
                </AlertDescription>
              </Alert>
            ) : null}

            {connectionData && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Connection Details:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify(connectionData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if your Discord environment variables are properly configured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <span className="font-mono">DISCORD_BOT_TOKEN</span>
                <div>
                  {process.env.DISCORD_BOT_TOKEN ? (
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓ Set</span>
                      <span className="text-xs text-gray-500">
                        {process.env.DISCORD_BOT_TOKEN.substring(0, 4)}...
                        {process.env.DISCORD_BOT_TOKEN.substring(process.env.DISCORD_BOT_TOKEN.length - 4)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-red-600">✗ Not Set</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border p-3 rounded-md">
                <span className="font-mono">DISCORD_WHALE_CHANNEL_ID</span>
                <div>
                  {process.env.DISCORD_WHALE_CHANNEL_ID ? (
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓ Set</span>
                      <span className="text-xs text-gray-500">{process.env.DISCORD_WHALE_CHANNEL_ID}</span>
                    </div>
                  ) : (
                    <span className="text-red-600">✗ Not Set</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
