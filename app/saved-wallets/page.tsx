import SavedWalletsManager from "@/components/saved-wallets-manager"

export default function SavedWalletsPage() {
  return (
    <div className="min-h-screen bg-[#070318] text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-light mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
          Saved Wallets
        </h1>

        <div className="bg-[#0a0a18]/80 border border-purple-900/30 rounded-lg p-6">
          <SavedWalletsManager />
        </div>
      </div>
    </div>
  )
}
