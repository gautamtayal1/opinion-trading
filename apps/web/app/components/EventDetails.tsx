import React from 'react'
import { Calendar, TrendingUp, Users } from 'lucide-react';

const EventDetails = () => {
  return (
    <div>
      <div className="gradient-border card-shine rounded-xl bg-black/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-400">
            Crypto
          </span>
          <div className="flex items-center text-sm text-[hsl(var(--muted))]">
            <Calendar className="mr-1 h-4 w-4" />
            Dec 31, 2024
          </div>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Bitcoin Price Q4 2024</h1>
        </div>
        <p className="text-[hsl(var(--muted))]">
          Will Bitcoin reach $100,000 by the end of Q4 2024? This market will resolve to YES if the price of Bitcoin reaches or exceeds $100,000 at any point before December 31, 2024.
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-[hsl(var(--muted))]">
          <span>Pool: <span className="text-white">$5.2M</span></span>
          <span>Volume: <span className="text-white">$12.8M</span></span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="text-white">28.3K participants</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default EventDetails