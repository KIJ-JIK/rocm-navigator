"use client";

import React from "react";

export interface VsCodeSidebarProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * VsCodeSidebar Component
 * Sidebar simulating visual layout of VS Code extension.
 */
export default function VsCodeSidebar({ className = "", children }: VsCodeSidebarProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">VsCodeSidebar Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Sidebar simulating visual layout of VS Code extension.</p>
      {children}
    </div>
  );
}
