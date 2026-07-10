"use client";

import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Separator({ className = "", ...props }: SeparatorProps) {
  return <div className={`h-[1px] w-full ${className}`} {...props} />;
}
