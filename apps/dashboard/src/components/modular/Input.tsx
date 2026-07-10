"use client";

import React from "react";

export interface InputProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Input Component
 * Glassmorphism form text inputs.
 */
export default function Input({ className = "", children }: InputProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">Input Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Glassmorphism form text inputs.</p>
      {children}
    </div>
  );
}
