"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SavedWallet } from "@/types/wallet"
import { getSavedWallets, saveWallet, searchWallets } from "@/app/actions/wallet-actions"
import { Loader2, Plus, Search, ExternalLink, Wallet, Tag, Copy, Check, Calendar, MapPin } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function SavedWalletsManager() {
  const [newWallet, setNewWallet] = useState({
    address: "",
    name: "",
    description: "",
    tags: [] as string[],
    x_account: "",
  })
  const [wallets, setWallets] = useState<SavedWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Form state
  const [tagInput, setTagInput] = useState("")
  const [formError, setFormError] = useState("")

  // Load wallets on component mount
  useEffect(() => {
    loadWallets()
  }, [])

  // Load all wallets
  const loadWallets = async () => {
    setLoading(true)
    const result = await getSavedWallets()
    if (result.success) {
      setWallets(result.wallets)
    }
    setLoading(false)
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadWallets()
      return
    }

    setLoading(true)
    const result = await searchWallets(searchQuery)
    if (result.success) {
      setWallets(result.wallets)
    }
    setLoading(false)
  }

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle form submission for new wallet
  const handleSubmit = async () => {
    setFormError("")

    if (!newWallet.address) {
      setFormError("Wallet address is required")
      return
    }

    if (!newWallet.description) {
      setFormError("Description is required")
      return
    }

    const result = await saveWallet({
      address: newWallet.address,
      name: newWallet.name || undefined,
      description: newWallet.description,
      tags: newWallet.tags.length > 0 ? newWallet.tags : undefined,
      x_account: newWallet.x_account || undefined,
    })

    if (result.success) {
      // Reset form and close dialog
      setNewWallet({
        address: "",
        name: "",
        description: "",
        tags: [],
        x_account: "",
      })
      setIsAddDialogOpen(false)

      // Reload wallets
      await loadWallets()
    } else {
      setFormError(result.error || "Failed to save wallet")
    }
  }

  // Handle adding a tag to new wallet
  const handleAddTag = () => {
    if (!tagInput.trim()) return

    setNewWallet({
      ...newWallet,
      tags: [...newWallet.tags, tagInput.trim()],
    })

    setTagInput("")
  }

  // Handle removing a tag from new wallet
  const handleRemoveTag = (tag: string) => {
    setNewWallet({
      ...newWallet,
      tags: newWallet.tags.filter((t) => t !== tag),
    })
  }

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Saved Wallets</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Wallet</DialogTitle>
              <DialogDescription>Save a wallet address with description for future reference.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Wallet Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="address"
                  placeholder="Enter Solana wallet address"
                  value={newWallet.address}
                  onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name (Optional)
                </label>
                <Input
                  id="name"
                  placeholder="E.g., My Trading Wallet"
                  value={newWallet.name}
                  onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for this wallet"
                  value={newWallet.description}
                  onChange={(e) => setNewWallet({ ...newWallet, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags (Optional)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {newWallet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newWallet.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-xs hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="x-account" className="text-sm font-medium">
                  X Account (Optional)
                </label>
                <Input
                  id="x-account"
                  placeholder="E.g., @traderpow"
                  value={newWallet.x_account || ""}
                  onChange={(e) => setNewWallet({ ...newWallet, x_account: e.target.value })}
                />
              </div>
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Wallet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search wallets by address, name or description"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Wallets</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : wallets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No wallets found matching your search." : "No wallets saved yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wallets.map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Wallet Card Component with click-to-copy functionality and X profile preview
function WalletCard({ wallet }: { wallet: SavedWallet }) {
  const [copied, setCopied] = useState(false)

  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Extract username from X account (remove @ if present)
  const getXUsername = (xAccount: string) => {
    return xAccount.replace("@", "").trim()
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">{wallet.name || formatAddress(wallet.address)}</CardTitle>
            <CardDescription
              className="flex items-center gap-1 mt-1 cursor-pointer hover:text-blue-500 transition-colors group"
              onClick={() => copyToClipboard(wallet.address)}
              title="Click to copy full address"
            >
              <Wallet className="h-3 w-3" />
              {formatAddress(wallet.address)}
              {copied ? (
                <Check className="h-3 w-3 text-green-500 ml-1" />
              ) : (
                <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">{wallet.description}</p>

        {wallet.tags && wallet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            <Tag className="h-3 w-3 text-gray-400 mr-1" />
            {wallet.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {wallet.x_account && (
          <div className="flex items-center gap-1 mt-3">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 text-sm text-blue-500 hover:underline">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    role="img"
                    viewBox="0 0 24 24"
                    className="h-3 w-3 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"></path>
                  </svg>
                  {wallet.x_account}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="rounded-lg overflow-hidden">
                  {/* Header Image */}
                  <div className="h-24 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                    <img
                      src={`/placeholder.svg?height=96&width=320&query=crypto trading header image`}
                      alt="Profile header"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="bg-gray-900 text-white p-4">
                    {/* Profile Picture and X Logo */}
                    <div className="flex justify-between items-start">
                      <div className="relative -mt-12 mb-2">
                        <div className="h-16 w-16 rounded-full border-4 border-gray-900 overflow-hidden">
                          <img
                            src={`/placeholder.svg?height=64&width=64&query=crypto trader profile picture`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-white fill-current">
                        <g>
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </g>
                      </svg>
                    </div>

                    {/* Name and Username */}
                    <div className="mb-2">
                      <h3 className="font-bold text-lg">{wallet.name || "Crypto Trader"}</h3>
                      <p className="text-gray-400">@{getXUsername(wallet.x_account)}</p>
                    </div>

                    {/* Bio */}
                    <p className="text-sm mb-3">
                      {wallet.description || "Crypto trader and analyst. Sharing insights on the latest market trends."}
                    </p>

                    {/* Stats */}
                    <div className="flex text-sm text-gray-400 gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>Crypto World</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined 2023</span>
                      </div>
                    </div>

                    {/* Following/Followers */}
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-bold text-white">247</span>{" "}
                        <span className="text-gray-400">Following</span>
                      </div>
                      <div>
                        <span className="font-bold text-white">5.2K</span>{" "}
                        <span className="text-gray-400">Followers</span>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <a
                      href={`https://twitter.com/${getXUsername(wallet.x_account)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full mt-3 py-2 text-center rounded-full border border-gray-600 text-white hover:bg-gray-800 transition-colors"
                    >
                      See profile on X
                    </a>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex gap-2 w-full">
          <a
            href={`https://solscan.io/account/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700"
          >
            Solscan <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={`https://explorer.solana.com/address/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700"
          >
            Explorer <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={`https://gmgn.ai/sol/address/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700 ml-auto"
          >
            GMGN.ai <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
