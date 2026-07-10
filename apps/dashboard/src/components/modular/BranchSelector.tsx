"use client";

import React from "react";

export interface BranchSelectorProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * BranchSelector Component
 * Repository branch selectors menus.
 */
export default function BranchSelector({ className = "", children }: BranchSelectorProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">BranchSelector Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Repository branch selectors menus.</p>
      {children}
    </div>
  );
}
