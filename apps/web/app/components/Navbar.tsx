'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const {status} = useSession();

  return (
    <nav className="border-b border-purple-500/20 bg-[hsl(var(--background))]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">Probably</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="rounded-lg px-4 py-2 text-[hsl(var(--muted))] transition-colors hover:text-white"
            >
              Home
            </Link>
            <Link 
              href="/events" 
              className="rounded-lg px-4 py-2 text-[hsl(var(--muted))] transition-colors hover:text-white"
            >
              Events
            </Link>
            <Link 
              href="/portfolio" 
              className="rounded-lg px-4 py-2 text-[hsl(var(--muted))] transition-colors hover:text-white"
            >
              Portfolio
            </Link>
            {status === 'unauthenticated' ? (
            <Link href="/auth">
            <button 
              className="glow rounded-lg bg-[hsl(var(--primary))] px-4 py-2 font-medium text-white transition-all hover:bg-[hsl(var(--primary-hover))] hover:scale-105"
              >
              Sign In
            </button>
            </Link>
            ) : (
              <button 
              className="glow rounded-lg bg-[hsl(var(--primary))] px-4 py-2 font-medium text-white transition-all hover:bg-[hsl(var(--primary-hover))] hover:scale-105"
              onClick={() => signOut({callbackUrl: '/'})}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}