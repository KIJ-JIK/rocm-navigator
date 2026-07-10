"use client";

import React from "react";

export interface PluginCardProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * PluginCard Component
 * Modular plugin selector item display.
 */
export default function PluginCard({ className = "", children }: PluginCardProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">PluginCard Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Modular plugin selector item display.</p>
      {children}
    </div>
  );
}
