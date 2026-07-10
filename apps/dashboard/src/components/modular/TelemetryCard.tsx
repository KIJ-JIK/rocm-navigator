"use client";

import React from "react";

export interface TelemetryCardProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * TelemetryCard Component
 * Single telemetry readout tracking grid boxes.
 */
export default function TelemetryCard({ className = "", children }: TelemetryCardProps) {
  return (
    <div className={`p-2 rounded border border-zinc-900 bg-zinc-950/40 text-xs text-zinc-400 font-sans ${className}`}>
      <span className="font-bold text-zinc-200 uppercase tracking-wide block mb-1 text-[9px]">TelemetryCard Component</span>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Single telemetry readout tracking grid boxes.</p>
      {children}
    </div>
  );
}
