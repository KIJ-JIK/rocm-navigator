"use client";

import * as React from "react";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Field({ className = "", children, ...props }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function FieldLabel({ className = "", children, ...props }: FieldLabelProps) {
  return (
    <label className={`text-xs font-medium tracking-wide ${className}`} {...props}>
      {children}
    </label>
  );
}
