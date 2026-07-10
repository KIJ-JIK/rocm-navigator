"use client";

import React from "react";

export interface ExplainCardProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * ExplainCard Component
 * Explainability reasoning metadata summaries.
 */
export default function ExplainCard({ className = "", children }: ExplainCardProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">ExplainCard Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Explainability reasoning metadata summaries.</p>
      {children}
    </div>
  );
}
