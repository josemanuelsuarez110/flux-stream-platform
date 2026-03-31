"use client"

import React, { useState, useEffect } from 'react'
import { 
  Zap, 
  ShieldAlert, 
  Database, 
  Clock, 
  BarChart3, 
  Layers, 
  Terminal,
  Cpu,
  Workflow,
  Github
} from 'lucide-react'

export default function FluxStreamDashboard() {
  const [events, setEvents] = useState<{id: string, card: string, amount: number, status: string}[]>([])
  const [activeTab, setActiveTab] = useState('architecture')

  // Simulate real-time event ingestion
  useEffect(() => {
    const interval = setInterval(() => {
      const isFraud = Math.random() < 0.1
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        card: `**** ${Math.floor(1000 + Math.random() * 9000)}`,
        amount: parseFloat((Math.random() * 1000).toFixed(2)),
        status: isFraud ? 'FRAUD_SUSPECTED' : 'CLEAN'
      }
      setEvents(prev => [newEvent, ...prev].slice(0, 5))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen cyber-grid relative pt-12 pb-24 px-6 md:px-12 lg:px-24">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] -z-10" />

      {/* Navigation Branding */}
      <nav className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter neon-text-purple">FluxStream</span>
        </div>
        <div className="flex gap-6 items-center">
            <span className="text-sm font-mono text-cyan-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                LIVE PIPELINE
            </span>
            <a href="https://github.com" className="hover:text-purple-400 transition-colors">
                <Github size={20} />
            </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-semibold text-purple-400 mb-6 tracking-widest uppercase">
          Production-Ready Streaming Engine
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Real-time <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Fraud Detection</span> at Scale.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
          Architecting massive event throughput with Apache Kafka and Spark Streaming. FluxStream detects fraudulent patterns in milliseconds using sliding windows and stateful analysis.
        </p>
        <div className="flex gap-4">
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20">
                View Architecture
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
                Project Documentation
            </button>
        </div>
      </section>

      {/* Main Feature Tabs */}
      <div className="mb-8 flex gap-4 border-b border-white/10">
        {['architecture', 'streaming_logs', 'infrastructure'].map((tab) => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm font-medium transition-all ${activeTab === tab ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
                {tab.toUpperCase().replace('_', ' ')}
            </button>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Real-time Ticker */}
        <div className="lg:col-span-1">
            <div className="flux-card p-6 h-full border-cyan-500/20">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Terminal size={18} className="text-cyan-400" />
                        EVENT_RAW_STREAM
                    </h3>
                    <div className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">6 PARTITIONS</div>
                </div>
                <div className="space-y-4">
                    {events.map((ev) => (
                        <div key={ev.id} className={`p-4 rounded-lg border leading-tight transition-all ${ev.status === 'FRAUD_SUSPECTED' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-mono text-xs text-slate-500">{ev.id}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${ev.status === 'FRAUD_SUSPECTED' ? 'bg-red-500/20 text-red-500 pulse-fraud' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                    {ev.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-sm font-bold text-slate-300">{ev.card}</div>
                                    <div className="text-[10px] text-slate-500">VISA • MERCHANT: GENERIC</div>
                                </div>
                                <div className="text-lg font-bold text-slate-100">${ev.amount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Architecture Diagram Visualization */}
        <div className="lg:col-span-2">
            <div className="flux-card p-8 h-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-1">System Architecture Flow</h3>
                        <p className="text-xs text-slate-500">Event-Driven / Medallion Streaming Logic</p>
                    </div>
                    <div className="flex gap-2">
                        {['Kafka', 'Spark', 'Airflow'].map(tag => (
                            <span key={tag} className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">{tag}</span>
                        ))}
                    </div>
                </div>
                
                {/* Simplified Architecture Flow Visual */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-12 px-6 bg-black/20 rounded-2xl border border-white/5">
                    <div className="text-center group">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/10 mx-auto">
                            <Cpu className="text-cyan-400" />
                        </div>
                        <span className="text-xs font-bold block">PRODUCERS</span>
                        <span className="text-[10px] text-slate-500 uppercase">Simulated Events</span>
                    </div>

                    <div className="h-0.5 w-12 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 hidden md:block" />

                    <div className="text-center group">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/10 mx-auto">
                            <Layers className="text-purple-400" />
                        </div>
                        <span className="text-xs font-bold block">KAFKA CLUSTER</span>
                        <span className="text-[10px] text-slate-500 uppercase">Input Topic</span>
                    </div>

                    <div className="h-0.5 w-12 bg-gradient-to-r from-purple-500/50 to-cyan-500/50 hidden md:block" />

                    <div className="text-center group">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-purple-500/30 mx-auto shadow-xl shadow-purple-500/10">
                            <Zap className="text-purple-300" size={32} />
                        </div>
                        <span className="text-xs font-extrabold block text-purple-300">SPARK ENGINE</span>
                        <span className="text-[10px] text-slate-500 uppercase">Fraud Windowing</span>
                    </div>

                    <div className="h-0.5 w-12 bg-gradient-to-r from-cyan-500/50 to-slate-500/50 hidden md:block" />

                    <div className="text-center group">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/10 mx-auto">
                            <Database className="text-slate-400" />
                        </div>
                        <span className="text-xs font-bold block text-slate-300">STORAGE SINK</span>
                        <span className="text-[10px] text-slate-500 uppercase">Delta Lake</span>
                    </div>
                </div>

                {/* Tech Deep Dive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h4 className="flex items-center gap-2 text-sm font-bold mb-2">
                             <Clock size={16} className="text-purple-400" /> 
                             Watermarking (5m)
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Handling late data using event-time processing. Spark drops state for events that arrive past the trailing threshold to preserve cluster memory.
                        </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h4 className="flex items-center gap-2 text-sm font-bold mb-2">
                             <BarChart3 size={16} className="text-cyan-400" />
                             Sliding Windows
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Detecting transaction bursts by card_id. Current logic monitors 1-minute windows with 30-second overlaps to identify fraud clusters.
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Footer / Contact */}
      <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-sm font-mono tracking-tighter uppercase whitespace-nowrap">
            Designed for: High-Performance Data Engineering Portfolio
        </div>
        <div className="flex gap-6">
            {['Architecture', 'Kafka', 'Spark'].map(link => (
                <a key={link} href="#" className="text-xs text-slate-600 hover:text-purple-400 uppercase font-bold tracking-widest transition-colors">{link}</a>
            ))}
        </div>
      </footer>
    </main>
  )
}
