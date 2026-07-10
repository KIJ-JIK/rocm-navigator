"use client";

import React from "react";

export interface LogFrameProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * LogFrame Component
 * Single log event formatter.
 */
export default function LogFrame({ className = "", children }: LogFrameProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">LogFrame Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Single log event formatter.</p>
      {children}
    </div>
  );
}
