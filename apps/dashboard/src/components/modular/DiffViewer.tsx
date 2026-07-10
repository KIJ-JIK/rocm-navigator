"use client";

import React from "react";

export interface DiffViewerProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * DiffViewer Component
 * Side-by-side comparative syntax changes highlighting panel.
 */
export default function DiffViewer({ className = "", children }: DiffViewerProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">DiffViewer Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Side-by-side comparative syntax changes highlighting panel.</p>
      {children}
    </div>
  );
}
