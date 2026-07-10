"use client";

import React from "react";

export interface WalkthroughPopupProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * WalkthroughPopup Component
 * Judge presentation tour guides panels.
 */
export default function WalkthroughPopup({ className = "", children }: WalkthroughPopupProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">WalkthroughPopup Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Judge presentation tour guides panels.</p>
      {children}
    </div>
  );
}
