"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Activity, ShieldAlert, Layers } from "lucide-react";

/**
 * ComparisonPage Route Page
 * Side-by-Side Target vs Source Parity Dashboard
 */
export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-zinc-100 font-sans p-8 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]" />
      
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-6 w-6 rounded bg-[#ff6d5a] items-center justify-center font-bold text-white text-xs">
            n8
          </div>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest border-l border-zinc-800 pl-3">ROCm Navigator Routing</span>
        </div>

        <div className="border-b border-zinc-900 pb-4">
          <h1 className="text-2xl font-bold tracking-wide text-zinc-100">COMPARISON SYSTEM</h1>
          <p className="text-xs text-[#ff6d5a] mt-1 font-semibold uppercase tracking-wider">Side-by-Side Target vs Source Parity Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-6 space-y-2">
            <Layers className="h-5 w-5 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Active Pipelines</h3>
            <p className="text-[10px] text-zinc-500 leading-normal">Monitor and manage parallel multi-agent migration workloads.</p>
          </div>
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-6 space-y-2">
            <Cpu className="h-5 w-5 text-[#ff6d5a]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">GPU Resource Bindings</h3>
            <p className="text-[10px] text-zinc-500 leading-normal">Isolate container allocations to specific Instinct compute nodes.</p>
          </div>
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-6 space-y-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Audit Compliance Logs</h3>
            <p className="text-[10px] text-zinc-500 leading-normal">Track security exceptions and boundary scans history.</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-zinc-900 pt-4 flex justify-between items-center text-[10px] text-zinc-500">
        <span>Intellectual Property of Ansh (Product Owner)</span>
        <span>ROCm Navigator v1.0.0</span>
      </footer>
    </div>
  );
}
