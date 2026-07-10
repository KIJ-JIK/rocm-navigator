"use client";

import React from "react";

export interface HistoricalDiffProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * HistoricalDiff Component
 * Comparative pass-by-pass diff highlighter.
 */
export default function HistoricalDiff({ className = "", children }: HistoricalDiffProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">HistoricalDiff Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Comparative pass-by-pass diff highlighter.</p>
      {children}
    </div>
  );
}
