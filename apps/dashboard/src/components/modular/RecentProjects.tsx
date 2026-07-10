"use client";

import React from "react";

export interface RecentProjectsProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * RecentProjects Component
 * Historical migration uploads catalog list.
 */
export default function RecentProjects({ className = "", children }: RecentProjectsProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">RecentProjects Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Historical migration uploads catalog list.</p>
      {children}
    </div>
  );
}
