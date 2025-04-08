import React from 'react'

const Orderbook = () => {
  const orderBook = {
    yes: [
      { price: 0.68, quantity: 1200 },
      { price: 0.67, quantity: 2500 },
      { price: 0.66, quantity: 1800 },
      { price: 0.65, quantity: 3000 },
    ],
    no: [
      { price: 0.32, quantity: 1500 },
      { price: 0.33, quantity: 2200 },
      { price: 0.34, quantity: 1900 },
      { price: 0.35, quantity: 2800 },
    ],
  };
  return (
    <div>
      <div className="gradient-border card-shine rounded-xl bg-black/40 p-6">
              <h2 className="mb-6 text-xl font-bold">Order Book</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {/* YES Orders */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-green-400">YES Orders</h3>
                  <div className="space-y-2">
                    {orderBook.yes.map((order, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-green-500/10 p-3">
                        <span className="font-medium text-green-400">${order.price.toFixed(2)}</span>
                        <span className="text-[hsl(var(--muted))]">{order.quantity.toLocaleString()} shares</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* NO Orders */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-red-400">NO Orders</h3>
                  <div className="space-y-2">
                    {orderBook.no.map((order, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-red-500/10 p-3">
                        <span className="font-medium text-red-400">${order.price.toFixed(2)}</span>
                        <span className="text-[hsl(var(--muted))]">{order.quantity.toLocaleString()} shares</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
    </div>
  )
}

export default Orderbook