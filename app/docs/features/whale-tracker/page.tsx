import DocPageTemplate from "@/components/doc-page-template"
import { SimpleMermaid } from "@/components/simple-mermaid"

export default function WhaleTrackerPage() {
  return (
    <DocPageTemplate title="Whale Tracker">
      <div className="space-y-6">
        <p>
          The Whale Tracker feature allows you to monitor large transactions (whales) on the Solana blockchain in
          real-time. This powerful tool helps you identify significant market movements before they impact token prices.
        </p>

        <h2 className="text-2xl font-semibold mt-8">How It Works</h2>
        <p>
          Our system continuously monitors the Solana blockchain for transactions exceeding certain thresholds. When a
          whale transaction is detected, it's immediately displayed in the dashboard with relevant details.
        </p>

        <SimpleMermaid
          chart={`
            graph TD
              A["Blockchain Events"] -->|"Monitor"| B["Transaction Filter"]
              B -->|"Large Tx Detected"| C["Whale Analysis"]
              C --> D["Dashboard Display"]
              C --> E["Alert System"]
          `}
          caption="Whale Tracker Data Flow"
        />

        <h2 className="text-2xl font-semibold mt-8">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Real-time monitoring of large transactions</li>
          <li>Detailed transaction information including wallet addresses and token amounts</li>
          <li>Historical whale activity analysis</li>
          <li>Customizable alerts for specific tokens or transaction sizes</li>
          <li>Integration with market data to correlate whale activity with price movements</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">Using the Whale Tracker</h2>
        <p>
          The Whale Tracker dashboard displays the most recent whale transactions by default. You can filter
          transactions by token, amount, or time period using the controls at the top of the dashboard.
        </p>

        <p>
          Click on any transaction to view more details, including the sender and receiver addresses, transaction hash,
          and associated market data.
        </p>
      </div>
    </DocPageTemplate>
  )
}
