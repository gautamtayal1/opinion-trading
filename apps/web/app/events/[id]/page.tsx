"use client"

import { useState, useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSockets";
import { useParams } from "next/navigation";
import EventDetails from "../../components/EventDetails";
import PlaceOrder from "../../components/PlaceOrder";
import Navbar from "../../components/Navbar";
import Orderbook from "../../components/Orderbook";
import PriceChart from "../../components/PriceChart";

export default function Home() {
  console.log("Component rendered");
  
  const { messages, isConnected, subscribe, unsubscribe } = useWebSocket('ws://localhost:8081');
  const [marketDepth, setMarketDepth] = useState<any[]>([]);
  const param = useParams();
  console.log("Params from useParams:", param);
  
  const market = param.id as string;
  console.log("Market value:", market);
  useEffect(() => {
    if (!market || !isConnected) return;
  
    const handler = (data: any) => {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        setMarketDepth(parsedData);
      } catch (err) {
        console.error("Error parsing market depth:", err);
      }
    };
  
    const success = subscribe(`depth@${market}`, handler);
  
    if (!success) {
      console.warn("WebSocket not ready, retrying subscription...");
      const retry = setTimeout(() => {
        subscribe(`depth@${market}`, handler);
      }, 500);
  
      return () => clearTimeout(retry);
    }
  
    return () => {
      unsubscribe(`depth@${market}`);
    };
  }, [isConnected, market]);
  
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <EventDetails />
            {/* Price Chart */}
            <PriceChart />
            {/* Order Book */}
            <Orderbook />
          </div>
          {/* Place Order */}
          <PlaceOrder />
        </div>
      </main>
    </div>
  );  
  
}

