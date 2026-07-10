"use client";

import React from "react";

export interface SearchInputProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * SearchInput Component
 * Repository and node list filters search bar.
 */
export default function SearchInput({ className = "", children }: SearchInputProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">SearchInput Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Repository and node list filters search bar.</p>
      {children}
    </div>
  );
}
