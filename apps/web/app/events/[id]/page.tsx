"use client"

import { useState, useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSockets";
import { useParams } from "next/navigation";
import EventDetails from "../../components/EventDetails";
import PlaceOrder from "../../components/PlaceOrder";
import Navbar from "../../components/Navbar";
import Orderbook from "../../components/Orderbook";
import PriceChart from "../../components/PriceChart";
import axios from "axios";

export default function Home() {
  console.log("Component rendered");
  
  const { isConnected, subscribe, unsubscribe } = useWebSocket(`ws://35.188.12.120:8081`);
  const [marketDepth, setMarketDepth] = useState([]);
  const [marketInit, setMarketInit] = useState({ currentPrice: 5, bids: [], asks: [] });
  const param = useParams();
  
  const market = param.id as string;
  useEffect(() => {
    if (!market || !isConnected) return;
  
    const handler = (data: any) => {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        console.log(parsedData);
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
  }, [isConnected, subscribe, unsubscribe, market]);

  useEffect(() => {
    const fetchDepth = async () => {
      const res = await axios.post(`http://35.188.12.120:8080/depth`, {
        eventSlug: market
      },)
      setMarketInit(res.data)
    }
    fetchDepth()
  }, [])
  
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <EventDetails slug={market} />
            {/* Price Chart */}
            <PriceChart />
            {/* Order Book */}
            <Orderbook depthSocket={marketDepth} depthInit={marketInit}/>
          </div>
          {/* Place Order */}
          <PlaceOrder/>
        </div>
      </main>
    </div>
  );  
  
}

