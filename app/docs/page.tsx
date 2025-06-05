"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Navigation structure for documentation
  const navigation = [
    { title: "Overview", href: "#overview", active: true },
    { title: "Getting Started", href: "#getting-started" },
    { title: "Features", href: "#features" },
    { title: "Technical", href: "#technical" },
    { title: "Resources", href: "#resources" },
  ]

  // Documentation content sections
  const sections = [
    {
      id: "overview",
      title: "Platform Overview",
      content: `
        <h2>LyxAI Platform</h2>
        <p>LyxAI is an AI-powered blockchain analytics platform that provides instant, data-driven insights for cryptocurrency tokens and wallets. The platform leverages advanced AI to analyze blockchain data and deliver actionable intelligence.</p>
        
        <h3>Core Capabilities</h3>
        <ul>
          <li><strong>Token Analysis:</strong> Comprehensive analysis of cryptocurrency tokens including contract details, security risks, and market data.</li>
          <li><strong>AI Chat Assistant:</strong> Natural language interface for blockchain queries and information retrieval.</li>
          <li><strong>Blockchain Visualization:</strong> Interactive visual representations of blockchain data and relationships.</li>
        </ul>
      `,
    },
    {
      id: "getting-started",
      title: "Getting Started",
      content: `
        <h2>Quick Start Guide</h2>
        <p>Getting started with LyxAI is simple and straightforward. This guide will help you navigate the platform and start using its features.</p>
        
        <h3>User Interface</h3>
        <p>The LyxAI interface is designed to be intuitive and user-friendly. The main components include:</p>
        <ul>
          <li><strong>Navigation Bar:</strong> Access different sections of the platform</li>
          <li><strong>Chat Interface:</strong> Interact with the AI assistant</li>
          <li><strong>Token Analyzer:</strong> Input token addresses for analysis</li>
          <li><strong>Dashboard:</strong> View analytics and visualizations</li>
        </ul>
      `,
    },
    {
      id: "features",
      title: "Features",
      content: `
        <h2>Token Analyzer</h2>
        <p>The Token Analyzer is a powerful tool that provides comprehensive analysis of cryptocurrency tokens. It examines contract code, transaction patterns, and market data to deliver insights about token security, functionality, and potential risks.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Contract Analysis:</strong> Examination of smart contract code for security vulnerabilities and functionality</li>
          <li><strong>Risk Assessment:</strong> Evaluation of potential risks associated with the token</li>
          <li><strong>Market Data:</strong> Current and historical price information, liquidity, and trading volume</li>
          <li><strong>Holder Analysis:</strong> Distribution of token holdings and major holder activities</li>
        </ul>
        
        <h2>Chat Assistant</h2>
        <p>The AI-powered Chat Assistant provides a natural language interface for interacting with blockchain data. Users can ask questions about tokens, wallets, transactions, and general blockchain concepts to receive instant, accurate responses.</p>
        
        <h3>Capabilities</h3>
        <ul>
          <li><strong>Token Queries:</strong> Information about specific tokens and their properties</li>
          <li><strong>Wallet Analysis:</strong> Insights about wallet activities and holdings</li>
          <li><strong>Transaction Explanations:</strong> Detailed explanations of blockchain transactions</li>
          <li><strong>Educational Content:</strong> Information about blockchain concepts and terminology</li>
        </ul>
        
        <h2>Blockchain Visualization</h2>
        <p>The Blockchain Visualization tools provide interactive visual representations of blockchain data, making complex information more accessible and understandable.</p>
        
        <h3>Visualization Types</h3>
        <ul>
          <li><strong>Transaction Flows:</strong> Visual mapping of token transfers between wallets</li>
          <li><strong>Token Networks:</strong> Relationship graphs showing connections between tokens and holders</li>
          <li><strong>Time-Series Data:</strong> Historical trends and patterns in token activity</li>
        </ul>
      `,
    },
    {
      id: "technical",
      title: "Technical Documentation",
      content: `
        <h2>Architecture</h2>
        <p>LyxAI is built on a modern, scalable architecture designed for high performance and reliability. The platform consists of several key components:</p>
        
        <h3>Core Components</h3>
        <ul>
          <li><strong>Frontend Application:</strong> React-based user interface with Next.js</li>
          <li><strong>API Layer:</strong> RESTful API services for data access and processing</li>
          <li><strong>AI Engine:</strong> Advanced natural language processing and machine learning models</li>
          <li><strong>Blockchain Indexers:</strong> Systems for extracting and processing blockchain data</li>
          <li><strong>Data Storage:</strong> Distributed databases for storing processed blockchain information</li>
        </ul>
        
        <h2>API Reference</h2>
        <p>LyxAI provides a comprehensive API for integrating blockchain analytics capabilities into your applications.</p>

        <h3>Available Endpoints</h3>
        <ul>
          <li><strong>/api/v1/analyze-token:</strong> Analyze token contracts</li>
          <li><strong>/api/v1/token-social/[address]:</strong> Retrieve social data for tokens</li>
          <li><strong>/api/v1/chat:</strong> Generate AI responses to blockchain queries</li>
          <li><strong>/api/v1/tokens:</strong> Search and list tokens with pagination</li>
        </ul>

        <p>
          <a href="/api-test" className="text-purple-400 hover:text-purple-300">
            Try out the API in our interactive test console →
          </a>
        </p>
        
        <h2>Integration Guide</h2>
        <p>Integrate LyxAI capabilities into your applications using our SDK, widgets, or direct API access.</p>
      `,
    },
    {
      id: "resources",
      title: "Resources",
      content: `
        <h2>FAQ</h2>
        <p>Find answers to commonly asked questions about the LyxAI platform.</p>
        
        <h3>Common Questions</h3>
        <ul>
          <li><strong>How accurate is the token analysis?</strong> LyxAI's token analysis is highly accurate, combining multiple data sources and AI models to provide comprehensive insights.</li>
          <li><strong>Which blockchains are supported?</strong> Currently, LyxAI supports Ethereum, Solana, Binance Smart Chain, and Polygon, with more chains being added regularly.</li>
          <li><strong>How is data security handled?</strong> All user data is encrypted and securely stored. We do not store wallet private keys or sensitive information.</li>
        </ul>
        
        <h2>Glossary</h2>
        <p>A comprehensive glossary of terms used in the LyxAI platform and blockchain technology.</p>
        
        <h2>Release Notes</h2>
        <p>Stay updated with the latest features, improvements, and bug fixes in the LyxAI platform.</p>
      `,
    },
  ]

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav>
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block px-3 py-2 rounded-md ${
                    item.active ? "bg-purple-900/30 text-purple-300" : "hover:bg-zinc-800/50"
                  }`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
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

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-12">
              <h2 className="text-2xl font-medium mb-4 pb-2 border-b border-white/10">{section.title}</h2>
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
            </section>
          ))}
        </main>

        <footer className="border-t border-white/10 p-6 text-center text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} LyxAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
