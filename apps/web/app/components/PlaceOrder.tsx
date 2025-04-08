import React, { useState } from 'react'
import { Calendar, TrendingUp, Users, LineChart, ArrowUp, ArrowDown } from 'lucide-react';

const PlaceOrder = () => {
  const [betType, setBetType] = useState<'yes' | 'no'>('yes');
  const [price, setPrice] = useState('0.65');
  const [quantity, setQuantity] = useState('100');
  return (
    <div>
      <div className="lg:col-span-1">
            <div className="gradient-border card-shine sticky top-24 rounded-xl bg-black/40 p-6">
              <h2 className="mb-6 text-xl font-bold">Place Order</h2>
              
              {/* Bet Type Selection */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => setBetType('yes')}
                  className={`flex items-center justify-center gap-2 rounded-lg p-3 font-semibold transition-all ${
                    betType === 'yes'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-black/20 text-[hsl(var(--muted))] hover:bg-black/30'
                  }`}
                >
                  <ArrowUp className="h-4 w-4" />
                  YES
                </button>
                <button
                  onClick={() => setBetType('no')}
                  className={`flex items-center justify-center gap-2 rounded-lg p-3 font-semibold transition-all ${
                    betType === 'no'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-black/20 text-[hsl(var(--muted))] hover:bg-black/30'
                  }`}
                >
                  <ArrowDown className="h-4 w-4" />
                  NO
                </button>
              </div>

              {/* Price Input */}
              <div className="mb-6">
                <label className="mb-2 block text-sm text-[hsl(var(--muted))]">
                  Price (0-1)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  max="1"
                  className="w-full rounded-lg border border-purple-500/20 bg-black/20 p-3 text-white outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Quantity Input */}
              <div className="mb-6">
                <label className="mb-2 block text-sm text-[hsl(var(--muted))]">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-full rounded-lg border border-purple-500/20 bg-black/20 p-3 text-white outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Total */}
              <div className="mb-6 rounded-lg bg-purple-500/10 p-4">
                <div className="flex items-center justify-between text-sm text-[hsl(var(--muted))]">
                  <span>Total Cost</span>
                  <span className="text-lg font-bold text-white">
                    ${(Number(price) * Number(quantity)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button className="glow w-full rounded-xl bg-[hsl(var(--primary))] py-4 text-lg font-semibold transition-all hover:bg-[hsl(var(--primary-hover))] hover:scale-[1.02]">
                Place Order
              </button>
            </div>
          </div>
    </div>
  )
}

export default PlaceOrder