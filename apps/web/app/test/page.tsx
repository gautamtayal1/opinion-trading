'use client';

import { ArrowRight, Sparkles, Zap, BarChart3, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Hero Section */}
      <div className="hero-gradient">
        <header className="container mx-auto px-4 py-32">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1">
              <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-400">The Future of Predictions</span>
            </div>
            <h1 className="mb-6 text-7xl font-bold tracking-tight glow-text">
              Bet on What's
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent"> Next</span>
            </h1>
            <p className="mb-8 max-w-2xl text-xl text-[hsl(var(--muted))]">
              Join the next generation of predictors. Use data-driven insights to forecast outcomes and earn rewards.
            </p>
            <div className="flex gap-4">
              <button className="glow rounded-xl bg-[hsl(var(--primary))] px-8 py-4 text-lg font-semibold transition-all hover:bg-[hsl(var(--primary-hover))] hover:scale-105">
                Start Predicting
              </button>
              <button className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-8 py-4 text-lg font-semibold transition-all hover:bg-purple-500/20">
                Learn More
              </button>
            </div>

            {/* Market Preview */}
            <div className="mt-20 w-full max-w-4xl">
              <div className="gradient-border card-shine rounded-2xl bg-black/40 p-8 backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Featured Market</h3>
                  <span className="rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-400">Live</span>
                </div>
                <p className="mb-6 text-xl font-medium">Will BTC hit $100K by 2025?</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/20 to-green-500/10 p-6 text-left transition-all hover:scale-[1.02]">
                    <div className="mb-2 text-2xl font-bold text-green-400">YES</div>
                    <div className="text-sm text-[hsl(var(--muted))]">Current Odds</div>
                    <div className="text-3xl font-bold text-green-400">64%</div>
                  </button>
                  <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500/20 to-red-500/10 p-6 text-left transition-all hover:scale-[1.02]">
                    <div className="mb-2 text-2xl font-bold text-red-400">NO</div>
                    <div className="text-sm text-[hsl(var(--muted))]">Current Odds</div>
                    <div className="text-3xl font-bold text-red-400">36%</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Features */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Why Choose Probably</h2>
            <p className="text-[hsl(var(--muted))]">Built for the future of prediction markets</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: 'Advanced Analytics',
                description: 'Real-time data and market insights to inform your predictions',
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Secure Platform',
                description: 'Enterprise-grade security protecting your assets and data',
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Instant Execution',
                description: 'Lightning-fast trades and immediate settlement',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-shine gradient-border group rounded-xl bg-black/40 p-8 transition-all hover:scale-[1.02]"
              >
                <div className="mb-4 inline-flex rounded-lg bg-purple-500/20 p-3 text-purple-400">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-[hsl(var(--muted))]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Markets */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Live Markets</h2>
            <p className="text-[hsl(var(--muted))]">Real-time prediction opportunities</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Tesla Stock Price',
                question: 'Will TSLA reach $300 by Q2 2024?',
                yes: '72%',
                no: '28%',
                category: 'Stocks',
                volume: '$1.2M',
              },
              {
                title: 'Ethereum 2.0',
                question: 'ETH 2.0 launch before July 2024?',
                yes: '85%',
                no: '15%',
                category: 'Crypto',
                volume: '$3.4M',
              },
              {
                title: 'Apple AR',
                question: 'Apple AR glasses release in 2024?',
                yes: '45%',
                no: '55%',
                category: 'Tech',
                volume: '$890K',
              },
            ].map((market, index) => (
              <div
                key={index}
                className="card-shine gradient-border group rounded-xl bg-black/40 p-6 transition-all hover:scale-[1.02]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-400">
                    {market.category}
                  </span>
                  <span className="text-sm text-[hsl(var(--muted))]">Vol: {market.volume}</span>
                </div>
                <h3 className="mb-4 text-xl font-bold">{market.title}</h3>
                <p className="mb-6 text-[hsl(var(--muted))]">{market.question}</p>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-lg bg-green-500/10 p-3">
                    <span className="font-medium text-green-400">YES</span>
                    <span className="text-lg font-bold text-green-400">{market.yes}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-red-500/10 p-3">
                    <span className="font-medium text-red-400">NO</span>
                    <span className="text-lg font-bold text-red-400">{market.no}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="card-shine gradient-border rounded-2xl bg-black/40 p-16 text-center">
            <h2 className="mb-6 text-5xl font-bold">
              Ready to Start
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent"> Predicting?</span>
            </h2>
            <p className="mb-8 text-xl text-[hsl(var(--muted))]">
              Join thousands of predictors already earning rewards
            </p>
            <button className="glow group rounded-xl bg-[hsl(var(--primary))] px-8 py-4 text-lg font-semibold transition-all hover:bg-[hsl(var(--primary-hover))] hover:scale-105">
              Get Started Now
              <ArrowRight className="ml-2 inline h-5 w-5 transition-all group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-[hsl(var(--muted))]">
            <a href="#" className="transition hover:text-white">About</a>
            <a href="#" className="transition hover:text-white">Markets</a>
            <a href="#" className="transition hover:text-white">Documentation</a>
            <a href="#" className="transition hover:text-white">Terms</a>
            <a href="#" className="transition hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}