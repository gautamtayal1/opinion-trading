
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Calendar } from 'lucide-react';

import prisma from '@repo/db/client';

export default async function Events() {
  const events = await prisma.event.findMany()
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
            return (
              <div
                key={event.id}
                className="card-shine gradient-border group cursor-pointer rounded-xl bg-black/40 p-6 transition-all hover:scale-[1.02]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-[hsl(var(--muted))]">
                    <Calendar className="mr-1 h-4 w-4" />
                    12 Mar
                  </div>
                </div>
                
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                    {/* <Icon className="h-6 w-6" /> */}
                  </div>
                  <h3 className="text-xl font-bold">{event.title}</h3>
                </div>
                
                <p className="mb-6 text-[hsl(var(--muted))]">{event.description}</p>
                
                <div className="flex items-end justify-between text-sm">
                  <Link href={`/events/${event.slug}`}>
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