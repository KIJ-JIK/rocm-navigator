"use client";

import * as React from "react";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function InputGroup({ className = "", children, ...props }: InputGroupProps) {
  return (
    <div
      className={`relative flex items-center h-10 w-full rounded-lg border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-white/40 focus-within:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface InputGroupInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  nativeInput?: boolean;
}

export function InputGroupInput({ className = "", nativeInput, ...props }: InputGroupInputProps) {
  return (
    <input
      className={`flex-1 bg-transparent border-0 p-0 outline-none focus:outline-none focus:ring-0 text-sm w-full ${className}`}
      {...props}
    />
  );
}

export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "inline-start" | "inline-end";
}

export function InputGroupAddon({ className = "", align = "inline-end", children, ...props }: InputGroupAddonProps) {
  return (
    <div className={`flex items-center ${align === "inline-start" ? "mr-2" : "ml-2"} ${className}`} {...props}>
      {children}
    </div>
  );
}
