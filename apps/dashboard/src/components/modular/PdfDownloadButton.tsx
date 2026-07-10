"use client";

import React from "react";

export interface PdfDownloadButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * PdfDownloadButton Component
 * Download audit logs button links.
 */
export default function PdfDownloadButton({ className = "", children }: PdfDownloadButtonProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">PdfDownloadButton Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Download audit logs button links.</p>
      {children}
    </div>
  );
}
