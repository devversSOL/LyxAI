import Link from "next/link"
import { getDocsByCategory } from "@/lib/docs"
import { FileText } from "lucide-react"

export default async function DocsPage() {
  const docsByCategory = await getDocsByCategory()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">LyxAI Documentation</h1>
          <p className="text-xl text-zinc-400 max-w-2xl">Comprehensive guide to the LyxAI Solana analytics platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Getting Started Section */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs/getting-started/user-interface"
                  className="flex items-center text-purple-400 hover:text-purple-300"
                >
                  <FileText size={18} className="mr-2" />
                  <span>User Interface Guide</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Features Section */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs/features/whale-tracker"
                  className="flex items-center text-purple-400 hover:text-purple-300"
                >
                  <FileText size={18} className="mr-2" />
                  <span>Whale Tracker</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/features/wallet-analyzer"
                  className="flex items-center text-purple-400 hover:text-purple-300"
                >
                  <FileText size={18} className="mr-2" />
                  <span>Wallet Analyzer</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/features/coin-analyzer"
                  className="flex items-center text-purple-400 hover:text-purple-300"
                >
                  <FileText size={18} className="mr-2" />
                  <span>Coin Analyzer</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/features/narrative-analysis"
                  className="flex items-center text-purple-400 hover:text-purple-300"
                >
                  <FileText size={18} className="mr-2" />
                  <span>Narrative Analysis</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Section */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4">Technical</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs/technical/architecture"
                  className="flex items-center text-purple-400 hover:text-purple-300"
                >
                  <FileText size={18} className="mr-2" />
                  <span>System Architecture</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
