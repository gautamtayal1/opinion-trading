"use client"

import { useState, useEffect } from "react";
import { useWebSocket } from "./hooks/useWebSockets";

export default function Home() {
  const { isConnected, messages, subscribe, unsubscribe } = useWebSocket('ws://localhost:8081');
  const [orderUpdates, setOrderUpdates] = useState<any[]>([]);
  
  // Subscribe to orderbook updates when connected
  useEffect(() => {
    if (isConnected) {
      // Subscribe to BTC-USD orderbook channel
      subscribe("BTC-USD", (data) => {
        try {
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          setOrderUpdates(prev => [...prev, parsedData]);
        } catch (err) {
          console.error("Error parsing order data:", err);
        }
      });
      
      // Clean up subscription when component unmounts
      return () => {
        unsubscribe("BTC-USD");
      };
    }
  }, [isConnected, subscribe, unsubscribe]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orderbook</h1>
      
      <div className="mb-4">
        <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Display order updates */}
        <div className="border p-4 rounded-lg bg-gray-50 h-80 overflow-y-auto">
          <h2 className="font-bold mb-2">Order Updates:</h2>
          {orderUpdates.map((order, idx) => (
            <div key={idx} className="mb-2 p-2 bg-white rounded shadow">
              <pre className="whitespace-pre-wrap break-words text-sm">
                {JSON.stringify(order, null, 2)}
              </pre>
            </div>
          ))}
        </div>
        
        {/* Display all WebSocket messages for debugging */}
        <div className="border p-4 rounded-lg bg-gray-50 h-80 overflow-y-auto">
          <h2 className="font-bold mb-2">All Messages:</h2>
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-2 p-2 bg-white rounded shadow">
              <pre className="whitespace-pre-wrap break-words text-sm">
                {typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
