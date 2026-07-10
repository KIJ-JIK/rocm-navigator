"use client";

import React from "react";

export interface MetricsGridProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * MetricsGrid Component
 * Overall system speed, lines count, and success rate grid.
 */
export default function MetricsGrid({ className = "", children }: MetricsGridProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">MetricsGrid Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Overall system speed, lines count, and success rate grid.</p>
      {children}
    </div>
  );
}
