"use client"
import { Badge } from "@/components/ui/badge"
import { Check, AlertTriangle, HelpCircle } from "lucide-react"

interface TrendingCoin {
  name: string
  symbol: string
  image: string | null
  rugcheck_status: string
  token_address: string
  trending_rank: number
  price: number
  change_24h: number
}

interface TrendingCoinsConveyorProps {
  coins: TrendingCoin[]
  onCoinClick: (address: string) => void
  speed?: "slow" | "normal" | "fast" | "very-fast"
}

export default function TrendingCoinsConveyor({ coins, onCoinClick, speed = "very-fast" }: TrendingCoinsConveyorProps) {
  const formatPrice = (price: number) => {
    if (price < 0.00001) {
      return price.toExponential(2)
    } else if (price < 0.01) {
      return price.toFixed(6)
    } else if (price < 1) {
      return price.toFixed(4)
    } else {
      return price.toFixed(2)
    }
  }

  const getRugcheckBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "good":
        return (
          <Badge className="bg-green-600/80 hover:bg-green-700 text-white text-xs px-1 py-0">
            <Check size={8} className="mr-0.5" /> Safe
          </Badge>
        )
      case "bad":
        return (
          <Badge className="bg-red-600/80 hover:bg-red-700 text-white text-xs px-1 py-0">
            <AlertTriangle size={8} className="mr-0.5" /> Risk
          </Badge>
        )
      case "unknown":
      default:
        return (
          <Badge className="bg-gray-600/80 hover:bg-gray-700 text-white text-xs px-1 py-0">
            <HelpCircle size={8} className="mr-0.5" /> Unknown
          </Badge>
        )
    }
  }

  // Duplicate the coins array to create seamless loop
  const duplicatedCoins = [...coins, ...coins]

  const getAnimationClass = () => {
    switch (speed) {
      case "slow":
        return "animate-scroll-slow"
      case "fast":
        return "animate-scroll-fast"
      case "very-fast":
        return "animate-scroll-very-fast"
      case "normal":
      default:
        return "animate-scroll-normal"
    }
  }

  return (
    <div className="w-full overflow-hidden relative">
      <div className={`flex space-x-2 ${getAnimationClass()}`}>
        {duplicatedCoins.map((coin, index) => (
          <div
            key={`${coin.token_address}-${index}`}
            onClick={() => onCoinClick(coin.token_address)}
            className="flex-shrink-0 w-60 bg-[#1a1a3a]/40 backdrop-blur-md border border-white/10 rounded-lg p-2 cursor-pointer hover:bg-white/5 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {coin.image && (
                  <img
                    src={coin.image || "/placeholder.svg"}
                    alt={coin.symbol}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                )}
                <div>
                  <div className="text-sm font-medium text-white truncate max-w-[100px]" title={coin.name}>
                    ${coin.symbol}
                  </div>
                  <div className="text-xs text-zinc-400 truncate max-w-[100px]">{coin.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500">#{coin.trending_rank}</div>
                {getRugcheckBadge(coin.rugcheck_status)}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Price:</span>
              <span className="font-medium text-white">${formatPrice(coin.price)}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">24h:</span>
              <span className={`font-medium ${coin.change_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                {coin.change_24h >= 0 ? "+" : ""}
                {coin.change_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
