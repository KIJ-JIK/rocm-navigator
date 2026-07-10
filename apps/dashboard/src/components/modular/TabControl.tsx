"use client";

import React from "react";

export interface TabControlProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * TabControl Component
 * Toggle controls between editor and runs logs.
 */
export default function TabControl({ className = "", children }: TabControlProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">TabControl Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Toggle controls between editor and runs logs.</p>
      {children}
    </div>
  );
}
