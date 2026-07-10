"use client";

import React from "react";

export interface EditorPanelProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * EditorPanel Component
 * Comparative CUDA-to-HIP code editor layout.
 */
export default function EditorPanel({ className = "", children }: EditorPanelProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">EditorPanel Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Comparative CUDA-to-HIP code editor layout.</p>
      {children}
    </div>
  );
}
