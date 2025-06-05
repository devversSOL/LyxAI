"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Copy, ExternalLink, Webhook } from "lucide-react"
import WebhookWhaleFeed from "@/components/webhook-whale-feed"

export default function WebhookTestPage() {
  const [webhookUrl, setWebhookUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Generate the webhook URL based on the current hostname
    const protocol = window.location.protocol
    const host = window.location.host
    const url = `${protocol}//${host}/api/discord-webhook`
    setWebhookUrl(url)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-4xl font-bold">Discord Webhook Integration</h1>

      <Card className="bg-blue-900/20 border-blue-500/50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Webhook className="mr-2 h-5 w-5" />
            Discord Webhook Setup
          </CardTitle>
          <CardDescription>Follow these steps to set up your Discord webhook integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Step 1: Create a webhook in Discord</h3>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Go to your Discord server</li>
              <li>Right-click on the channel you want to receive messages from</li>
              <li>Select "Edit Channel"</li>
              <li>Go to "Integrations" tab</li>
              <li>Click "Webhooks" and then "New Webhook"</li>
              <li>Give your webhook a name (e.g., "Whale Alert Webhook")</li>
              <li>Click "Copy Webhook URL" (you'll need this in step 2)</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Step 2: Set up a webhook forwarder</h3>
            <p>
              Discord webhooks can only send data to a public URL. You need to set up a service that will forward
              webhook data from Discord to your application.
            </p>
            <p>Your webhook endpoint URL is:</p>
            <div className="flex items-center mt-2">
              <code className="bg-black/30 p-2 rounded flex-grow overflow-x-auto">{webhookUrl}</code>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 border-blue-500/50 hover:bg-blue-900/30"
                onClick={copyToClipboard}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <p className="mt-4">Options for webhook forwarding:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>
                <strong>For production:</strong> Deploy your app to Vercel or another hosting service to get a public
                URL
              </li>
              <li>
                <strong>For development:</strong> Use a service like ngrok or localtunnel to expose your local server
                <ul className="list-disc list-inside pl-4 mt-1">
                  <li>
                    <a
                      href="https://ngrok.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      ngrok <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/localtunnel/localtunnel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      localtunnel <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Use a webhook relay service:</strong> Services like Pipedream or Hookdeck can forward webhooks
                <ul className="list-disc list-inside pl-4 mt-1">
                  <li>
                    <a
                      href="https://pipedream.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      Pipedream <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://hookdeck.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center"
                    >
                      Hookdeck <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Step 3: Test your webhook</h3>
            <p>
              After setting up the webhook and forwarder, send a test message in your Discord channel. The message
              should appear in the feed below.
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-md p-4 mt-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-yellow-400 mt-1 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Important Note</p>
                  <p className="text-sm mt-1">
                    This implementation stores webhook messages in memory. If you restart your server, all received
                    messages will be lost. For a production application, you should store messages in a database.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="feed">
        <TabsList className="bg-[#1a1a3a]/50 backdrop-blur-md border border-white/10 p-1 mb-6">
          <TabsTrigger value="feed" className="data-[state=active]:bg-purple-900/50">
            Webhook Feed
          </TabsTrigger>
          <TabsTrigger value="setup" className="data-[state=active]:bg-purple-900/50">
            Advanced Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <WebhookWhaleFeed />
        </TabsContent>

        <TabsContent value="setup">
          <Card className="bg-[#1a1a3a]/30 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle>Advanced Webhook Configuration</CardTitle>
              <CardDescription>
                Additional information for setting up and customizing your webhook integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Webhook Security</h3>
                <p className="mb-2">
                  For production use, you should add security to your webhook endpoint to ensure only Discord can send
                  data to it. Discord provides a signing secret that you can use to verify incoming requests.
                </p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>In your webhook settings in Discord, find the "Signing Secret" section</li>
                  <li>
                    Copy the secret and add it to your environment variables as <code>DISCORD_WEBHOOK_SECRET</code>
                  </li>
                  <li>
                    Update your webhook endpoint to verify the signature:
                    <pre className="bg-black/30 p-3 rounded mt-2 overflow-x-auto text-sm">
                      {`// In your webhook route handler
const signature = request.headers.get('x-signature-ed25519');
const timestamp = request.headers.get('x-signature-timestamp');
const body = await request.text();

// Verify the signature using the webhook secret
const isValid = verifyDiscordSignature(signature, timestamp, body);
if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}`}
                    </pre>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Storing Webhook Data</h3>
                <p className="mb-2">
                  The current implementation stores webhook data in memory, which means it will be lost when the server
                  restarts. For a production application, you should store the data in a database.
                </p>
                <p>Here's how you might modify the webhook endpoint to store data in a database:</p>
                <pre className="bg-black/30 p-3 rounded mt-2 overflow-x-auto text-sm">
                  {`// In your webhook route handler
import { db } from '@/app/api/db';

// Process the webhook payload
const message = {
  id: payload.id || \`webhook-\${Date.now()}\`,
  content: payload.content || "",
  timestamp: payload.timestamp || new Date().toISOString(),
  // ... other fields
};

// Store in database instead of memory
await db.insert('discord_messages', message);

// When fetching
const messages = await db.query('SELECT * FROM discord_messages ORDER BY timestamp DESC LIMIT 100');`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Custom Webhook Parsing</h3>
                <p className="mb-2">
                  You may need to customize the parsing logic to match the specific format of your Discord messages. The
                  current implementation uses a generic parser that works with common Discord message formats.
                </p>
                <p>
                  To customize the parsing, modify the <code>parseWhaleActivity</code> function in{" "}
                  <code>discord-service.ts</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
