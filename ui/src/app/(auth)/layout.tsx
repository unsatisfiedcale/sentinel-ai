'use client';

import { FC, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INSIGHTS = [
  {
    id: 1,
    region: 'eu-central-1',
    service: 'Redis',
    message: 'latency detected. AI suggests optimizing connection pool settings.',
    color: 'text-indigo-400',
  },
  {
    id: 2,
    region: 'us-east-1',
    service: 'PostgreSQL',
    message: 'high CPU usage. Potential missing index on "orders" table identified.',
    color: 'text-emerald-400',
  },
  {
    id: 3,
    region: 'ap-southeast-1',
    service: 'API Gateway',
    message: '5xx spikes detected. Anomaly aligns with upstream microservice deployment.',
    color: 'text-amber-400',
  },
  {
    id: 4,
    region: 'global-cdn',
    service: 'Edge Cache',
    message: 'cache hit ratio dropped by 15%. Recommend refreshing stale TTL values.',
    color: 'text-rose-400',
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 flex items-stretch font-sans overflow-hidden">
      {/* Left Panel: Branding & Dynamic Insights */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between border-r border-white/[0.02] bg-[#09090b] p-16 py-24 overflow-hidden">
        {/* Sol tarafa sağdaki derinliği katan Işık Katmanı (Glow) */}
        <div className="absolute inset-0 z-0">
          {/* 1. Kareler (Grid) - Bu hafif kalsın diye buna özel opacity verdik */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:45px_45px] opacity-20"></div>

          {/* 2. ANA GLOW (Sağdakiyle aynı güçte) */}
          {/* opacity-20 dışına çıkardık, artık sağdakiyle aynı tonda vuracak */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.07)_0%,transparent_70%)]"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo Section - Positioned more towards the top-left corner */}
          <div className="flex items-center gap-3 -mt-8 -ml-2 mb-auto select-none">
            <div className="relative group">
              <img src="/sentinel-logo.png" alt="SentinelAI Logo" className="relative h-32 w-auto object-contain" />
            </div>
          </div>

          {/* Hero Content Area - Centered vertically in the remaining space */}
          <div className="max-w-xl flex flex-col">
            {/* Observe Section */}
            <div className="mb-20 select-none">
              <h1 className="text-6xl font-bold tracking-tighter leading-[1.05] text-white">
                Observe. Analyze. <br />
                <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-700 bg-clip-text text-transparent">
                  Resolve in Seconds.
                </span>
              </h1>
            </div>

            {/* Dynamic Insight Card Section */}
            <div className="relative h-[180px] mb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={INSIGHTS[index].id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute w-full p-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-xl shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6 select-none">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Live Intelligence</p>
                  </div>

                  <p className="text-xl text-zinc-200 leading-relaxed font-medium select-none">
                    "{INSIGHTS[index].service} anomaly in{' '}
                    <span className={`${INSIGHTS[index].color} font-bold italic`}>{INSIGHTS[index].region}</span>.{' '}
                    {INSIGHTS[index].message}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sub-hero Description */}
            <div className="pt-4 select-none">
              <p className="text-base text-zinc-500 max-w-sm leading-relaxed border-l-2 border-zinc-800 pl-6 italic">
                The only AI-native observability platform built for high-scale microservices.
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-auto pt-16 text-[10px] text-zinc-800 tracking-[0.25em] uppercase font-bold select-none">
            © 2026 Sentinel Labs • Enterprise Grade Observability
          </div>
        </div>
      </div>

      {/* Right Panel: Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#09090b] relative overflow-hidden">
        {/* Sol taraftaki glow ile bütünleşen, çok daha kısık bir mor ışıltı */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08)_0%,transparent_80%)]"></div>

        {/* Form İçeriği */}
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-4 duration-1000 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
