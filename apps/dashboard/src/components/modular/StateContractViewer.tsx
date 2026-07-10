"use client";

import React from "react";

export interface StateContractViewerProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * StateContractViewer Component
 * Live state variable contract explorer.
 */
export default function StateContractViewer({ className = "", children }: StateContractViewerProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">StateContractViewer Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Live state variable contract explorer.</p>
      {children}
    </div>
  );
}
