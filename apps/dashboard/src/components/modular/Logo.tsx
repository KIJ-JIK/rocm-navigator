"use client";

import React from "react";

export interface LogoProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Logo Component
 * n8 custom workspace branding logo icon.
 */
export default function Logo({ className = "", children }: LogoProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">Logo Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">n8 custom workspace branding logo icon.</p>
      {children}
    </div>
  );
}
