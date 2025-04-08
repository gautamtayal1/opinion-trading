'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Calendar, TrendingUp, ArrowUp, ArrowDown, X, AlertCircle, CheckCircle2 } from 'lucide-react';

// Mock data for user's orders
const userOrders = [
  {
    id: 1,
    eventTitle: "Bitcoin Price Q4 2024",
    category: "Crypto",
    type: "YES",
    price: 0.68,
    quantity: 1000,
    filled: 800,
    status: "partial", // "filled", "partial", "pending", "cancelled"
    date: "2024-03-15",
    icon: TrendingUp,
  },
  {
    id: 2,
    eventTitle: "US Election 2024",
    category: "Politics",
    type: "NO",
    price: 0.45,
    quantity: 500,
    filled: 500,
    status: "filled",
    date: "2024-03-14",
    icon: TrendingUp,
  },
  {
    id: 3,
    eventTitle: "Tesla Stock Performance",
    category: "Stocks",
    type: "YES",
    price: 0.72,
    quantity: 300,
    filled: 0,
    status: "pending",
    date: "2024-03-16",
    icon: TrendingUp,
  },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'filled'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled':
        return 'text-green-400';
      case 'partial':
        return 'text-yellow-400';
      case 'pending':
        return 'text-blue-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-[hsl(var(--muted))]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'filled':
        return 'Filled';
      case 'partial':
        return 'Partially Filled';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filteredOrders = userOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'partial'].includes(order.status);
    if (activeTab === 'filled') return order.status === 'filled';
    return true;
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">My Portfolio</h1>
          <p className="text-[hsl(var(--muted))]">Manage your predictions and track your performance</p>
        </div>

        {/* Portfolio Stats */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {[
            { label: 'Total Value', value: '$12,450.00' },
            { label: 'Active Positions', value: '8' },
            { label: 'Realized P/L', value: '+$2,830.00' },
          ].map((stat, index) => (
            <div key={index} className="gradient-border card-shine rounded-xl bg-black/40 p-6">
              <p className="text-sm text-[hsl(var(--muted))]">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="gradient-border card-shine rounded-xl bg-black/40 p-6">
          {/* Tabs */}
          <div className="mb-6 flex space-x-4">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'active', label: 'Active' },
              { id: 'filled', label: 'Filled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-[hsl(var(--muted))] hover:bg-purple-500/10 hover:text-purple-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20 text-left text-sm text-[hsl(var(--muted))]">
                  <th className="pb-4">Event</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Quantity</th>
                  <th className="pb-4">Filled</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredOrders.map((order) => {
                  const Icon = order.icon;
                  return (
                    <tr key={order.id} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{order.eventTitle}</p>
                            <p className="text-sm text-[hsl(var(--muted))]">{order.category}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                          order.type === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.type}
                        </span>
                      </td>
                      <td className="font-medium">${order.price.toFixed(2)}</td>
                      <td>{order.quantity.toLocaleString()}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-purple-500/20">
                            <div
                              className="h-full bg-purple-500"
                              style={{ width: `${(order.filled / order.quantity) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-[hsl(var(--muted))]">
                            {((order.filled / order.quantity) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {order.status === 'filled' && <CheckCircle2 className="h-4 w-4" />}
                          {order.status === 'partial' && <AlertCircle className="h-4 w-4" />}
                          {order.status === 'pending' && <Calendar className="h-4 w-4" />}
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="text-[hsl(var(--muted))]">{order.date}</td>
                      <td>
                        {['pending', 'partial'].includes(order.status) && (
                          <button className="rounded-lg bg-red-500/20 px-3 py-1 text-sm font-medium text-red-400 opacity-0 transition-all hover:bg-red-500/30 group-hover:opacity-100">
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}