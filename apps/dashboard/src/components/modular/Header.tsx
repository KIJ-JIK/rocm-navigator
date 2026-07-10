"use client";

import React from "react";

export interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Header Component
 * Sticky top dashboard metadata navigation banner.
 */
export default function Header({ className = "", children }: HeaderProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">Header Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Sticky top dashboard metadata navigation banner.</p>
      {children}
    </div>
  );
}
