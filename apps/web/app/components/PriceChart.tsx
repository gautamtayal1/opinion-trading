"use client"

import React from 'react'
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = () => {
  const data = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2024, 0, 1, i).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    price: (Math.random() * 10).toFixed(1),
  }));
  return (
    <div><div className="gradient-border card-shine rounded-xl bg-black/40 p-6">
    <h2 className="mb-6 text-xl font-bold">Price History</h2>
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="hsl(var(--muted))" />
          <YAxis stroke="hsl(var(--muted))" />
          <Tooltip 
            contentStyle={{ 
              background: 'hsl(var(--background))',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '0.5rem'
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div></div>
  )
}

export default PriceChart