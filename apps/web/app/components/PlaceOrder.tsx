"use client"

import React, { useState } from 'react'
import { ArrowUp, ArrowDown, CheckCircle2, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'

const PlaceOrder = () => {
  const [betType, setBetType] = useState<'yes' | 'no'>('yes')
  const [price, setPrice] = useState('5.0')
  const [quantity, setQuantity] = useState('1')
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const { data: session } = useSession()
  const params = useParams()
  const market = params.id as string

  const handlePlaceOrder = async() => {
    if(!session?.user.id) {
      return signIn()
    }
    try {
      setOrderStatus('idle')
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/create`, 
        {
          userId: session?.user.id,
          market,
          price: Number(price),
          quantity: Number(quantity),
          side: betType,
          type: "CREATE_ORDER"
        }, {
          withCredentials: true
        }
      )
      
      console.log('Order response:', response.data)
      setOrderStatus('success')

    } catch (error) {
      setOrderStatus('error')
      console.error('Order placement failed:', error)
    }
  }

  if (orderStatus === 'success') {
    return (
      <div className="lg:col-span-1">
        <div className="gradient-border card-shine sticky top-24 rounded-xl bg-black/40 p-6">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h2 className="text-xl font-bold">Order Submitted</h2>
          </div>
        </div>
      </div>
    )
  }

  if (orderStatus === 'error') {
    return (
      <div className="lg:col-span-1">
        <div className="gradient-border card-shine sticky top-24 rounded-xl bg-black/40 p-6">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-xl font-bold">Order Failed</h2>
            <button
              onClick={() => setOrderStatus('idle')}
              className="mt-4 rounded-xl bg-[hsl(var(--primary))] px-6 py-2 font-semibold transition-all hover:bg-[hsl(var(--primary-hover))]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

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
              Price (1-10)
            </label>
            <div 
              className="flex w-full items-center rounded-lg border border-purple-500/20 bg-black/20 text-white outline-none focus-within:border-purple-500/50"
            >
              <button
                className="px-3 py-3 hover:text-purple-400 text-xl"
                onClick={() => {
                  const newPrice = Math.max(1, Number(price) - 0.5);
                  setPrice(newPrice.toFixed(1));
                }}
              >
                -
              </button>
              <input
                value={price}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0.1 && val <= 10) {
                    setPrice(e.target.value);
                  }
                }}
                step="0.1"
                min="0.1"
                max="10"
                className="w-full bg-transparent text-center outline-none"
              />
              <button
                className="px-3 py-3 hover:text-purple-400 text-xl"
                onClick={() => {
                  const newPrice = Math.min(10, Number(price) + 0.5);
                  setPrice(newPrice.toFixed(1));
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm text-[hsl(var(--muted))]">
              Quantity
            </label>
            <div
              className="flex w-full items-center rounded-lg border border-purple-500/20 bg-black/20 text-white outline-none focus-within:border-purple-500/50"
            >
              <button
                className="px-3 py-3 hover:text-purple-400 text-xl"
                onClick={() => {
                  const newQuantity = Math.max(1, Number(quantity) - 1);
                  setQuantity(newQuantity.toString());
                }}
              >
                -
              </button>
              <input
                value={quantity} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1) {
                    setQuantity(e.target.value);
                  }
                }}
                min="1"
                className="w-full bg-transparent text-center outline-none"
              />
              <button
                className="px-3 py-3 hover:text-purple-400 text-xl"
                onClick={() => {
                  const newQuantity = Number(quantity) + 1;
                  setQuantity(newQuantity.toString());
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="mb-6 rounded-lg bg-purple-500/10 p-4">
            <div className="flex items-center justify-between text-sm text-[hsl(var(--muted))]">
              <span>Total Cost</span>
              <span className="text-lg font-bold text-white">
              ₹{(Number(price) * Number(quantity)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="glow w-full rounded-xl bg-[hsl(var(--primary))] py-4 text-lg font-semibold transition-all hover:bg-[hsl(var(--primary-hover))] hover:scale-[1.02]"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
