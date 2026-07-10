"use client";

import React from "react";

export interface ConsoleProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Console Component
 * Live scrolling agent execution console terminal.
 */
export default function Console({ className = "", children }: ConsoleProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">Console Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Live scrolling agent execution console terminal.</p>
      {children}
    </div>
  );
}
