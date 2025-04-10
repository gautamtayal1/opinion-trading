import React from 'react'

const Orderbook = ({depthSocket, depthInit}: {depthSocket: any, depthInit: any}) => {
  console.log(depthSocket)
  console.log(depthInit)
  const orderBook = {
    yes: depthSocket?.b ? Array.from(depthSocket.b).map((order: any) => ({
      price: order[0],
      quantity: order[1]
    })) : 
    (depthInit?.bids || []).map((order: any) => ({
      price: order[0],
      quantity: order[1]
    })),
      no: depthSocket?.a ? Array.from(depthSocket.a).map((order: any) => ({
        price: order[0],
        quantity: order[1]
      })) : 
    (depthInit?.asks || []).map((order: any) => ({
      price: order[0],
      quantity: order[1]
    }))
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
                        <span className="font-medium text-green-400">₹{order.price}</span>
                        <span className="text-[hsl(var(--muted))]">{order.quantity} orders</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-red-400">NO Orders</h3>
                  <div className="space-y-2">
                    {orderBook.no.map((order, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-red-500/10 p-3">
                        <span className="font-medium text-red-400">₹{order.price}</span>
                        <span className="text-[hsl(var(--muted))]">{order.quantity} orders</span>
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