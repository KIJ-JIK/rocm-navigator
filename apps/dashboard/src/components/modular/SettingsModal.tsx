"use client";

import React from "react";

export interface SettingsModalProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * SettingsModal Component
 * Developer settings configurations slide-over.
 */
export default function SettingsModal({ className = "", children }: SettingsModalProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">SettingsModal Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Developer settings configurations slide-over.</p>
      {children}
    </div>
  );
}
