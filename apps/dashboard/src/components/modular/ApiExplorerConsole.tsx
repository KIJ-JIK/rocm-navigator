"use client";

import React from "react";

export interface ApiExplorerConsoleProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * ApiExplorerConsole Component
 * FastAPI endpoints interactive test benches.
 */
export default function ApiExplorerConsole({ className = "", children }: ApiExplorerConsoleProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">ApiExplorerConsole Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">FastAPI endpoints interactive test benches.</p>
      {children}
    </div>
  );
}
