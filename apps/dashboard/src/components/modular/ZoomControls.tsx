"use client";

import React from "react";

export interface ZoomControlsProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * ZoomControls Component
 * Flow controls for layout canvas scaling.
 */
export default function ZoomControls({ className = "", children }: ZoomControlsProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">ZoomControls Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Flow controls for layout canvas scaling.</p>
      {children}
    </div>
  );
}
