'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Calendar, TrendingUp, Gamepad2, Trophy, Users, Zap } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "World Cup Finals 2026",
    category: "Sports",
    description: "Predict the winner of the FIFA World Cup 2026 finals",
    endDate: "Dec 18, 2026",
    totalPool: "$2.5M",
    participants: "12.5K",
    icon: Trophy,
  },
  {
    id: 2,
    title: "Bitcoin Price Q4 2024",
    category: "Crypto",
    description: "Will Bitcoin reach $100,000 by the end of Q4 2024?",
    endDate: "Dec 31, 2024",
    totalPool: "$5.2M",
    participants: "28.3K",
    icon: TrendingUp,
  },
  {
    id: 3,
    title: "US Election 2024",
    category: "Politics",
    description: "Predict the winner of the 2024 US Presidential Election",
    endDate: "Nov 5, 2024",
    totalPool: "$8.1M",
    participants: "45.2K",
    icon: Users,
  },
  {
    id: 4,
    title: "GTA 6 Release Date",
    category: "Gaming",
    description: "Will GTA 6 be released before June 2025?",
    endDate: "June 30, 2025",
    totalPool: "$1.8M",
    participants: "15.7K",
    icon: Gamepad2,
  },
  {
    id: 5,
    title: "Tesla Stock Performance",
    category: "Stocks",
    description: "Will Tesla stock reach $400 by end of Q2 2024?",
    endDate: "June 30, 2024",
    totalPool: "$3.7M",
    participants: "22.1K",
    icon: Zap,
  },
  {
    id: 6,
    title: "Champions League Winner",
    category: "Sports",
    description: "Predict the winner of UEFA Champions League 2024-25",
    endDate: "May 30, 2025",
    totalPool: "$4.2M",
    participants: "31.4K",
    icon: Trophy,
  },
];

export default function Events() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Prediction Events</h1>
          <p className="text-[hsl(var(--muted))]">Explore and participate in prediction markets</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className="card-shine gradient-border group cursor-pointer rounded-xl bg-black/40 p-6 transition-all hover:scale-[1.02]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-400">
                    {event.category}
                  </span>
                  <div className="flex items-center text-sm text-[hsl(var(--muted))]">
                    <Calendar className="mr-1 h-4 w-4" />
                    {event.endDate}
                  </div>
                </div>
                
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{event.title}</h3>
                </div>
                
                <p className="mb-6 text-[hsl(var(--muted))]">{event.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-[hsl(var(--muted))]">
                      Pool: <span className="text-white">{event.totalPool}</span>
                    </span>
                    <span className="text-[hsl(var(--muted))]">
                      Users: <span className="text-white">{event.participants}</span>
                    </span>
                  </div>
                  <Link href={`/events/${event.id}`}>
                  <button className="rounded-lg bg-purple-500/20 px-4 py-1 text-purple-400 transition-all hover:bg-purple-500/30">
                    View Details
                  </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}