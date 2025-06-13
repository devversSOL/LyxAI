import Link from "next/link"
import { ChevronRight, Home, Search, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Define our documentation structure manually since we're moving away from MD files
const docsByCategory = {
  "getting-started": [{ slug: "getting-started/user-interface", title: "User Interface Guide" }],
  features: [
    { slug: "features/whale-tracker", title: "Whale Tracker" },
    { slug: "features/wallet-analyzer", title: "Wallet Analyzer" },
    { slug: "features/coin-analyzer", title: "Coin Analyzer" },
    { slug: "features/narrative-analysis", title: "Narrative Analysis" },
  ],
  technical: [{ slug: "technical/architecture", title: "System Architecture" }],
}

export default function DocsPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-zinc-900/50 border-r border-white/10 p-4 overflow-y-auto">
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Home size={18} />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="search"
              placeholder="Search documentation..."
              className="pl-8 bg-zinc-800/50 border-zinc-700"
            />
          </div>
        </div>

        <nav>
          {Object.entries(docsByCategory).map(([category, docs]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
                {category.replace("-", " ")}
              </h3>
              <ul className="space-y-1">
                {docs.map((doc) => (
                  <li key={doc.slug}>
                    <Link
                      href={`/docs/${doc.slug}`}
                      className="block px-3 py-2 rounded-md hover:bg-zinc-800/50 text-sm"
                      prefetch={false} // Disable prefetching to prevent excessive navigation
                    >
                      {doc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="md:hidden">
                <Home size={20} />
              </Link>
              <h1 className="text-xl font-medium">LyxAI Documentation</h1>
            </div>
            <Button variant="outline" size="sm" className="md:hidden">
              Menu
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">Documentation</span>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">LyxAI Documentation</h1>
            <p className="text-xl text-zinc-300 mb-8">Comprehensive guide to the LyxAI Solana analytics platform</p>
          </div>

          {/* Documentation Categories */}
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(docsByCategory).map(([category, docs]) => (
              <div key={category} className="bg-zinc-900/30 rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-3 capitalize">{category.replace("-", " ")}</h2>
                <ul className="space-y-2">
                  {docs.slice(0, 4).map((doc) => (
                    <li key={doc.slug}>
                      <Link
                        href={`/docs/${doc.slug}`}
                        className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                        prefetch={false} // Disable prefetching to prevent excessive navigation
                      >
                        <FileText size={16} />
                        {doc.title}
                      </Link>
                    </li>
                  ))}
                  {docs.length > 4 && <li className="text-sm text-zinc-500">+{docs.length - 4} more...</li>}
                </ul>
              </div>
            ))}
          </div>
        </main>

        <footer className="border-t border-white/10 p-6 text-center text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} LyxAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
