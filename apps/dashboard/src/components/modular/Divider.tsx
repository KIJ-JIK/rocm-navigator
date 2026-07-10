"use client";

import React from "react";

export interface DividerProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Divider Component
 * Visual layouts separating lines.
 */
export default function Divider({ className = "", children }: DividerProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">Divider Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Visual layouts separating lines.</p>
      {children}
    </div>
  );
}
