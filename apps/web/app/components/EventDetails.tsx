"use client"

import axios from 'axios';
import { Calendar, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Event {
  id?: string;
  title?: string;
  description?: string;
  end_date?: Date;
  slug?: string;
}

const EventDetails = ({slug}: {slug: string}) => {
  const [event, setEvent] = useState<Event | null>(null)

  useEffect(() => {
    const getEvent = async() => {
        const res = await axios.post("http://localhost:8080/event/slug", {
        slug
      }, {
        withCredentials: true,
      })
      setEvent(res.data.event)
    }
    getEvent()
  }, [slug])

  return (
    <div>
      <div className="gradient-border card-shine rounded-xl bg-black/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-[hsl(var(--muted))]">
            <Calendar className="mr-1 h-4 w-4" />
            {event?.end_date?.toString().slice(0, 10)}
          </div>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">{event?.title}</h1>
        </div>
        <p className="text-[hsl(var(--muted))]">
          {event?.description}
        </p>
      </div>
    </div>
  )
}

export default EventDetails