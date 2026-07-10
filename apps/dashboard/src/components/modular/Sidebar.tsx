"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Menu } from "lucide-react";

// 1. Sidebar Context & Hook
interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// 2. Sidebar Provider Component
interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ open, setOpen, isMobile, toggleSidebar }}>
      <div className="flex min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans antialiased overflow-hidden">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

// 3. Sidebar Container Component
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Sidebar({ children, className = "", ...props }: SidebarProps) {
  const { open, isMobile } = useSidebar();

  // Desktop width state transition: 240px (expanded) to 60px (collapsed)
  // Mobile width state: full overlay (240px) or completely hidden (0px)
  const sidebarWidthClass = isMobile
    ? open
      ? "w-[240px] translate-x-0"
      : "w-0 -translate-x-full"
    : open
    ? "w-60"
    : "w-[60px]";

  return (
    <aside
      className={`h-screen bg-zinc-950 border-r border-zinc-900/80 flex flex-col transition-all duration-300 ease-in-out z-50 flex-shrink-0 select-none overflow-hidden ${sidebarWidthClass} ${className}`}
      {...props}
    >
      <div className="flex flex-col h-full w-full overflow-hidden">
        {children}
      </div>
    </aside>
  );
}

// 4. Sidebar Header Component
export function SidebarHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 border-b border-zinc-900/80 flex items-center justify-between flex-shrink-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

// 5. Sidebar Content Component
export function SidebarContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex-1 overflow-y-auto py-4 px-2 space-y-4 scrollbar-none ${className}`} {...props}>
      {children}
    </div>
  );
}

// 6. Sidebar Footer Component
export function SidebarFooter({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-3 border-t border-zinc-900/80 flex flex-col gap-1.5 flex-shrink-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

// 7. Sidebar Group Component
export function SidebarGroup({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`} {...props}>
      {children}
    </div>
  );
}

// 8. Sidebar Group Label Component
export function SidebarGroupLabel({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useSidebar();
  
  if (!open) return null; // Hide labels when sidebar is collapsed

  return (
    <div className={`px-2.5 py-1.5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest ${className}`} {...props}>
      {children}
    </div>
  );
}

// 9. Sidebar Menu Component
export function SidebarMenu({ children, className = "", ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={`flex flex-col gap-1 w-full list-none m-0 p-0 ${className}`} {...props}>
      {children}
    </ul>
  );
}

// 10. Sidebar Menu Item Component
export function SidebarMenuItem({ children, className = "", ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={`w-full list-none ${className}`} {...props}>
      {children}
    </li>
  );
}

// 11. Sidebar Menu Button Component
interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tooltip?: string;
  icon?: React.ReactNode;
}

export function SidebarMenuButton({
  children,
  active = false,
  tooltip,
  icon,
  className = "",
  ...props
}: SidebarMenuButtonProps) {
  const { open } = useSidebar();

  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 outline-none cursor-pointer border border-transparent ${
        active
          ? "bg-zinc-900/80 text-[#871717] border-zinc-900"
          : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/40"
      } ${open ? "justify-start text-left" : "justify-center"} ${className}`}
      title={!open ? tooltip || String(children) : undefined}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {open && <span className="truncate">{children}</span>}
    </button>
  );
}

// 12. Sidebar Rail Component
export function SidebarRail({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { toggleSidebar } = useSidebar();
  return (
    <div
      onClick={toggleSidebar}
      className={`absolute right-0 top-0 bottom-0 w-1 hover:w-1.5 bg-zinc-900/50 hover:bg-[#871717]/40 cursor-col-resize transition-all z-40 ${className}`}
      {...props}
    />
  );
}

// 13. Sidebar Inset
export function SidebarInset({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex-1 flex flex-col h-screen overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
}

// 14. Sidebar Trigger
export function SidebarTrigger({ className = "", ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 cursor-pointer hover:bg-zinc-800 transition-colors flex items-center justify-center outline-none ${className}`}
      {...props}
    >
      <Menu className="h-4 w-4" />
    </button>
  );
}
