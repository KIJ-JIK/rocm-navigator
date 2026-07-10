"use client";

import React from "react";

export interface AuthFormProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * AuthForm Component
 * JWT authorization forms fields.
 */
export default function AuthForm({ className = "", children }: AuthFormProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">AuthForm Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">JWT authorization forms fields.</p>
      {children}
    </div>
  );
}
