"use client";

import React from "react";

export interface DemoOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * DemoOverlay Component
 * Interactive mock simulation replay screen overlay.
 */
export default function DemoOverlay({ className = "", children }: DemoOverlayProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">DemoOverlay Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Interactive mock simulation replay screen overlay.</p>
      {children}
    </div>
  );
}
