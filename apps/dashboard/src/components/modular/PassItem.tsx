"use client";

import React from "react";

export interface PassItemProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * PassItem Component
 * Individual compiler run details record.
 */
export default function PassItem({ className = "", children }: PassItemProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">PassItem Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Individual compiler run details record.</p>
      {children}
    </div>
  );
}
