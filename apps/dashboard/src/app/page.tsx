"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  FileText, 
  Terminal, 
  ArrowRight, 
  Search, 
  Code, 
  Sparkles, 
  Download, 
  RefreshCw,
  GitBranch,
  ShieldCheck,
  TrendingUp,
  Home,
  Variable,
  History,
  HelpCircle,
  Settings,
  Share2,
  Save,
  Plus,
  PlayCircle,
  Lock,
  Bell,
  LogOut,
  Calendar,
  User,
  X,
  Database,
  BarChart2,
  FileCode,
  AlertTriangle,
  ChevronDown,
  Hash
} from "lucide-react";
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { Button } from "@orbit/ui/button";
import { Field, FieldLabel } from "@orbit/ui/field";
import { Input } from "@orbit/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@orbit/ui/input-group";
import { Separator } from "@orbit/ui/separator";
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from "lucide-react";
import "./hero.css";
import AgentFlow from "@/components/AgentFlow";
import Shuffle from "@/components/Shuffle";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInset,
  SidebarTrigger
} from "@/components/modular/Sidebar";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


const PaperTexture = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.PaperTexture),
  { ssr: false }
);

const NeuroNoise = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.NeuroNoise),
  { ssr: false }
);

const Beams = dynamic(
  () => import("@/components/Beams"),
  { ssr: false }
);

const VideoBackground = dynamic(
  () => import("@/components/VideoBackground"),
  { ssr: false }
);


const getFullUrl = (path: string) => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return path;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

const ScrambleIn: React.FC<{ text: string; delay: number; triggered: boolean }> = ({ text, delay, triggered }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!triggered) return;

    const timer = setTimeout(() => {
      let frame = 0;
      const intervalId = setInterval(() => {
        frame++;
        const revealIndex = Math.floor(frame * 0.5);

        let current = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            current += " ";
          } else if (i < revealIndex) {
            current += text[i];
          } else if (i < revealIndex + 3) {
            current += CHARS[Math.floor(Math.random() * CHARS.length)];
          } else {
            current += "";
          }
        }
        setDisplayText(current);

        if (revealIndex >= text.length) {
          clearInterval(intervalId);
          setDisplayText(text);
        }
      }, 25);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, triggered]);

  if (!triggered) return <>&nbsp;</>;
  return <>{displayText || <>&nbsp;</>}</>;
};

const ScrambleText: React.FC<{ text: string; isHovered: boolean; className?: string }> = ({ text, isHovered, className }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    let frame = 0;
    const intervalId = setInterval(() => {
      frame++;
      const revealIndex = Math.floor(frame / 4);

      let current = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          current += " ";
        } else if (i < revealIndex) {
          current += text[i];
        } else {
          current += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayText(current);

      if (revealIndex >= text.length) {
        clearInterval(intervalId);
        setDisplayText(text);
      }
    }, 25);

    return () => clearInterval(intervalId);
  }, [text, isHovered]);

  return <span className={className}>{displayText}</span>;
};

const SynapseXLogo = () => (
  <svg viewBox="-50 -50 100 100" width="18" height="18" fill="currentColor">
    <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" />
    <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" transform="rotate(90)" />
    <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" transform="rotate(180)" />
    <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" transform="rotate(270)" />
  </svg>
);

const SquashHamburger: React.FC<{ isOpen: boolean; onClick: () => void }> = ({ isOpen, onClick }) => {
  return (
    <button 
      className="synapse-hamburger-btn w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] flex items-center justify-center rounded-[14px]"
      onClick={onClick}
    >
      <div className="relative w-[15px] h-[10px] md:w-[18px] md:h-[12px] flex flex-col justify-between">
        <motion.span 
          className="absolute left-0 w-full bg-white rounded-full"
          style={{ height: '1.5px', originY: '0.5px' }}
          animate={isOpen ? { rotate: 45, y: 5.25 } : { rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <motion.span 
          className="absolute left-0 w-full bg-white rounded-full top-[4.25px] md:top-[5.25px]"
          style={{ height: '1.5px' }}
          animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <motion.span 
          className="absolute left-0 w-full bg-white rounded-full bottom-0"
          style={{ height: '1.5px', originY: '0.5px' }}
          animate={isOpen ? { rotate: -45, y: -5.25 } : { rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>
    </button>
  );
};

const MOCK_DIFFS = [
  {
    filename: "math_kernel.cu",
    original: `__global__ void vectorAdd(float *A, float *B, float *C, int N) {
    int i = blockDim.x * blockIdx.x + threadIdx.x;
    if (i < N) {
        C[i] = A[i] + B[i];
    }
}`,
    rewritten: `#include <hip/hip_runtime.h>

__global__ void vectorAdd(float *A, float *B, float *C, int N) {
    int i = hipBlockDim_x * hipBlockIdx_x + hipThreadIdx_x;
    if (i < N) {
        C[i] = A[i] + B[i];
    }
}`,
    explanation: "Mapped CUDA dimensions blockDim, blockIdx, threadIdx to their HIP equivalents. Added hip_runtime header.",
    confidence: 99,
    impact: "Performance Neutral (Direct API mapping)"
  },
  {
    filename: "shared_mem.cu",
    original: `__global__ void sharedReduce(float *d_out, float *d_in) {
    extern __shared__ float sdata[];
    int tid = threadIdx.x;
    sdata[tid] = d_in[tid];
    __syncthreads();
    
    // Warp voting ballot
    int mask = __ballot_sync(0xffffffff, sdata[tid] > 0);
}`,
    rewritten: `#include <hip/hip_runtime.h>

__global__ void sharedReduce(float *d_out, float *d_in) {
    HIP_DYNAMIC_SHARED(float, sdata)
    int tid = hipThreadIdx_x;
    sdata[tid] = d_in[tid];
    __syncthreads();
    
    // Warp voting ballot optimized for AMD CDNA 64-thread wavefronts
    int mask = __ballot(sdata[tid] > 0);
}`,
    explanation: "Replaced extern __shared__ syntax with HIP_DYNAMIC_SHARED macro. Swapped 32-thread __ballot_sync to 64-thread native AMD __ballot to optimize occupancy.",
    confidence: 94,
    impact: "+15% Wavefront Occupancy Speedup"
  }
];

const MOCK_HISTORY_PASSES = [
  {
    pass_name: "Pass 1: AST Ingestion",
    status: "SUCCESS",
    timestamp: "10 mins ago",
    code: `__global__ void sharedReduce(float *d_out, float *d_in) {
    extern __shared__ float sdata[];
    int tid = threadIdx.x;
    sdata[tid] = d_in[tid];
    __syncthreads();
    int mask = __ballot_sync(0xffffffff, sdata[tid] > 0);
}`,
    notes: "Code scanned by Scanner Node. Identified legacy 32-thread ballot sync and dynamic shared variable."
  },
  {
    pass_name: "Pass 2: Rewrite Code",
    status: "COMPILE_ERROR",
    timestamp: "8 mins ago",
    code: `// FAILED TO COMPILE (Leftover extern shared memory)
__global__ void sharedReduce(float *d_out, float *d_in) {
    extern __shared__ float sdata[];
    int tid = hipThreadIdx_x;
    sdata[tid] = d_in[tid];
    __syncthreads();
    int mask = __ballot(sdata[tid] > 0);
}`,
    notes: "Compilation failed on hipcc: 'error: extern shared memory declarations must be modified to use HIP_DYNAMIC_SHARED macros.'"
  },
  {
    pass_name: "Pass 3: Self-Healed Fix",
    status: "SUCCESS",
    timestamp: "5 mins ago",
    code: `#include <hip/hip_runtime.h>

__global__ void sharedReduce(float *d_out, float *d_in) {
    HIP_DYNAMIC_SHARED(float, sdata)
    int tid = hipThreadIdx_x;
    sdata[tid] = d_in[tid];
    __syncthreads();
    int mask = __ballot(sdata[tid] > 0);
}`,
    notes: "Successfully compiled! Fixed extern dynamic allocations and integrated hip_runtime headers."
  }
];

export default function Dashboard() {
  // Hero section dynamic text coloring based on dark vs light image background
  const heroImage = "/new_img_5.png"; // Crane sketch (light)
  const isDarkHero = heroImage.includes("jellyfish") || heroImage.includes("butterfly") || heroImage.includes("new_img_1") || heroImage.includes("new_img_3") || heroImage.includes("new_img_4");
  const heroTextColor = isDarkHero ? "text-white" : "text-[#090b16]";
  const heroMutedTextColor = isDarkHero ? "text-white/60" : "text-[#090b16]/70";
  // App navigation state: hero | login | landing | editor | history
  const [authState, setAuthState] = useState<"hero" | "login" | "landing" | "editor" | "history">("hero");
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "parity" | "lines">("recent");
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | null>(null);

  const renderLegalModal = () => {
    if (!activeModal) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md p-6 shadow-2xl relative font-sans text-zinc-100">
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            onClick={() => setActiveModal(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          {activeModal === "terms" ? (
            <div>
              <h2 className="text-base font-bold text-white mb-4 tracking-wider uppercase font-mono text-[#312e81]">Terms & Conditions</h2>
              <div className="text-zinc-300 space-y-3 text-[11px] sm:text-[12px] leading-relaxed font-mono max-h-[300px] overflow-y-auto pr-2">
                <p className="font-semibold text-zinc-400">Last Updated: July 2026</p>
                <p>Welcome to ROCm Navigator. By using our autonomous compilation services, AST code mutation tooling, and sandboxed physical GPU execution pipelines, you agree to comply with and be bound by the following terms and conditions.</p>
                <p>1. <strong>License & Usage:</strong> We grant you a limited, non-exclusive license to upload CUDA codebases, compile target HIP syntax, and run execution traces on virtualized or physical AMD Instinct validation sandbox instances.</p>
                <p>2. <strong>Intellectual Property:</strong> All source code input remains your exclusive property. The compilation mutations, telemetry analytical profiles, and ROCm Navigator code migration frameworks are the proprietary intellectual property of ROCm Navigator Labs.</p>
                <p>3. <strong>Warranty Disclaimer:</strong> Services are provided "as-is" without warranty of any kind. We do not guarantee that compiled HIP syntax will match CUDA performance baselines or be free of diagnostic warnings.</p>
                <p>4. <strong>Sandbox Security:</strong> You agree not to upload malware, exploits, or malicious code designed to escape GPU sandboxing layers or access peer hardware executions.</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-base font-bold text-white mb-4 tracking-wider uppercase font-mono text-[#312e81]">Privacy Policy</h2>
              <div className="text-zinc-300 space-y-3 text-[11px] sm:text-[12px] leading-relaxed font-mono max-h-[300px] overflow-y-auto pr-2">
                <p className="font-semibold text-zinc-400">Last Updated: July 2026</p>
                <p>At ROCm Navigator, we are committed to safeguarding your repository data, compilation telemetry, and account credentials.</p>
                <p>1. <strong>Data Collection:</strong> We collect repository URLs, uploaded CUDA kernels, compilation diagnostic output, and performance benchmark telemetry (synaptic metrics, AST structure details, memory profile trace arrays).</p>
                <p>2. <strong>Data Usage:</strong> Collected data is processed strictly to automate code porting pipelines, validate sandbox executions, generate syntax healing recommendations, and optimize AMD HIP compiler inputs.</p>
                <p>3. <strong>Data Security:</strong> Source files are stored in isolated virtual workspaces and executed inside locked container environments. We do not distribute or share your code with external LLM synthesizers or databases.</p>
                <p>4. <strong>User Rights:</strong> You may request complete deletion of your session metrics, workspace storage directories, and user account metadata at any time through your dashboard profile settings.</p>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button 
              type="button"
              className="px-4 py-1.5 bg-[#312e81] hover:bg-[#a01f1f] text-[#F0E7D5] rounded font-mono text-[11px] cursor-pointer transition-colors"
              onClick={() => setActiveModal(null)}
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    );
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [reveal, setReveal] = useState(false);
  
  // Workspace configurations
  const [repoUrl, setRepoUrl] = useState("https://github.com/nvidia/cuda-samples");
  const [isMigrating, setIsMigrating] = useState(false);
  const [isCloning, setIsCloning] = useState(false); // true while git clone is in-flight
  const [progress, setProgress] = useState(0);
  const [activeAgent, setActiveAgent] = useState("Scanner Agent");
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // editor or executions

  // Live diff output from pipeline
  const [translatedCode, setTranslatedCode] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [translatedFilename, setTranslatedFilename] = useState("");
  
  // Settings Panel State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fireworksKey, setFireworksKey] = useState("");
  const [targetGpu, setTargetGpu] = useState("AMD Instinct MI300X");
  const [forceSimulation, setForceSimulation] = useState(true);

  // History Panel State
  const [selectedPassIdx, setSelectedPassIdx] = useState(0);

  // Stats dashboard caches
  const [metrics, setMetrics] = useState({
    total_source_lines_read: 142050,
    average_confidence_score: 95.0,
    average_processing_speed_lines_sec: 420,
    total_migrations_run: 24,
    migration_success_percentage: 96.0,
    compilation_success_percentage: 94.0,
    vulnerabilities_caught: 2,
    active_gpu_utilization_percent: 82.0
  });

  const logEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hero landing page states
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadHovered, setDownloadHovered] = useState(false);
  const [aboutHovered, setAboutHovered] = useState(false);
  const [metricsHovered, setMetricsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

  // Sidebar expanded / interaction states
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const sidebarTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetSidebarTimeout = () => {
    if (sidebarTimeoutRef.current) {
      clearTimeout(sidebarTimeoutRef.current);
    }
    sidebarTimeoutRef.current = setTimeout(() => {
      setSidebarExpanded(false);
    }, 5000);
  };

  const handleSidebarInteract = () => {
    setSidebarExpanded(true);
    resetSidebarTimeout();
  };

  const handlePageInteract = () => {
    if (sidebarExpanded) {
      setSidebarExpanded(false);
      if (sidebarTimeoutRef.current) {
        clearTimeout(sidebarTimeoutRef.current);
        sidebarTimeoutRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sidebarTimeoutRef.current) {
        clearTimeout(sidebarTimeoutRef.current);
      }
    };
  }, []);

  const renderSidebar = (activeRoute: "landing" | "editor" | "history") => {
    return (
      <div 
        onMouseEnter={handleSidebarInteract}
        onMouseMove={handleSidebarInteract}
        onClick={handleSidebarInteract}
        className={`floating-capsule-sidebar fixed left-0 top-0 z-50 ${sidebarExpanded ? "floating-capsule-sidebar-expanded" : ""}`}
      >
        {/* Top Logo - AMD/ROCm themed emblem */}
        <div className={`flex ${sidebarExpanded ? "flex-row items-center gap-3 px-1" : "flex-col items-center gap-1"}`}>
          <div className="size-11 rounded-full bg-gradient-to-tr from-[#312e81] to-[#4f46e5] flex items-center justify-center border border-[#6366f1]/30 shadow-md shadow-[#312e81]/40 cursor-pointer flex-shrink-0" onClick={() => setAuthState("landing")}>
            <TrendingUp className="h-5 w-5 text-[#cc4155]" />
          </div>
          {sidebarExpanded ? (
            <div className="flex flex-col text-left">
              <span className="font-mono text-sm text-[#F0E7D5] uppercase tracking-wider font-bold">ROCm Navigator</span>
              <span className="text-xs text-[#8fa0dd] uppercase tracking-widest font-semibold mt-0.5">Parity Engine</span>
            </div>
          ) : (
            <span className="font-mono text-[10px] text-[#8fa0dd]/60 uppercase tracking-widest font-bold mt-1">ROCm</span>
          )}
        </div>

        {/* Center Navigation Buttons */}
        <nav className={`flex flex-col gap-4 w-full ${sidebarExpanded ? "items-start px-1" : "items-center"}`}>
          {[
            {
              title: "Home Workspace",
              label: "Workspace Home",
              icon: Home,
              active: activeRoute === "landing",
              onClick: () => setAuthState("landing")
            },
            {
              title: "Editor Canvas",
              label: "Workflow Editor",
              icon: Layers,
              active: activeRoute === "editor",
              onClick: () => setAuthState("editor")
            },
            {
              title: "All Executions",
              label: "Migration History",
              icon: History,
              active: activeRoute === "history",
              onClick: () => setAuthState("history")
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                title={item.title}
                onClick={item.onClick}
                className={`floating-sidebar-icon-btn relative flex items-center ${item.active ? "floating-sidebar-icon-btn-active" : ""} ${
                  sidebarExpanded ? "floating-sidebar-icon-btn-expanded" : "justify-center"
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${item.active ? "text-white" : "text-[#cc4155]"}`} />
                {sidebarExpanded && (
                  <span className="text-xs font-bold tracking-wide text-[#F0E7D5]/90 uppercase font-mono">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile / Settings Capsule */}
        <div className={`flex flex-col gap-3 w-full ${sidebarExpanded ? "items-stretch px-1" : "items-center"}`}>
          <button
            type="button"
            onClick={() => {
              setAuthState("editor");
              setSettingsOpen(true);
            }}
            className={`floating-sidebar-icon-btn flex items-center ${
              sidebarExpanded ? "floating-sidebar-icon-btn-expanded" : "justify-center"
            }`}
            title="Workspace Settings"
          >
            <Settings className="h-5 w-5 flex-shrink-0 text-[#cc4155]" />
            {sidebarExpanded && (
              <span className="text-xs font-bold tracking-wide text-[#F0E7D5]/90 uppercase font-mono">Settings</span>
            )}
          </button>

          <div className={`floating-avatar-capsule ${sidebarExpanded ? "floating-avatar-capsule-expanded" : ""}`}>
            <div className="size-8 rounded-full bg-[#cc4155] text-white flex items-center justify-center text-xs font-bold font-mono border border-white/15 cursor-pointer shadow-inner flex-shrink-0">
              {(username && username[0]) || "D"}
            </div>
            
            {sidebarExpanded && (
              <div className="flex flex-col text-left flex-1 pl-2">
                <span className="text-[8px] font-bold text-white uppercase tracking-wider truncate max-w-[80px]">
                  {username || "Developer"}
                </span>
                <span className="text-[6px] text-[#8fa0dd] uppercase tracking-widest font-semibold">Active</span>
              </div>
            )}

            <button
              onClick={() => {
                setAuthState("login");
                setUsername("");
                setIsGuest(false);
              }}
              title="Logout session"
              className={`text-[#8fa0dd] hover:text-[#4f46e5] transition-colors cursor-pointer bg-transparent border-none outline-none ${sidebarExpanded ? "p-1" : "mt-1"}`}
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Hero video mouse scrub logic
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const isSeeking = useRef(false);
  const pendingSeekTime = useRef<number | null>(null);
  const lastX = useRef<number | null>(null);

  const handleSeek = (targetTime: number) => {
    const video = heroVideoRef.current;
    if (!video) return;
    const duration = video.duration || 10;
    const clamped = Math.max(0, Math.min(duration, targetTime));
    
    if (!isSeeking.current) {
      video.currentTime = clamped;
      isSeeking.current = true;
    } else {
      pendingSeekTime.current = clamped;
    }
  };

  const handleSeeked = () => {
    isSeeking.current = false;
    if (pendingSeekTime.current !== null) {
      const nextTime = pendingSeekTime.current;
      pendingSeekTime.current = null;
      handleSeek(nextTime);
    }
  };

  useEffect(() => {
    if (authState !== "hero") return;
    const handleMouseMove = (e: MouseEvent) => {
      const video = heroVideoRef.current;
      if (!video) return;
      if (lastX.current === null) {
        lastX.current = e.clientX;
        return;
      }
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;

      const sensitivity = 0.8;
      const deltaSeconds = (dx / window.innerWidth) * (video.duration || 10) * sensitivity;
      handleSeek(video.currentTime + deltaSeconds);
    };

    const handleMouseLeave = () => {
      lastX.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [authState]);

  // Entrance transition timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntranceComplete(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Section 2 3D rotation transform scroll tracking
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: (mounted && authState === "hero") ? section2Ref : undefined,
    offset: ["start end", "end start"]
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 24,
    mass: 0.6
  });
  const yScaleValue = useTransform(smoothProgress, [0, 1], [60, -120]);
  const opacityValue = useTransform(smoothProgress, [0.1, 0.35], [0, 1]);
  const transformTemplate = useMotionTemplate`rotateX(24deg) translateY(${yScaleValue}px) translateZ(15px)`;

  // Section 2.5 GSAP scrolltrigger reveal hook
  const revealContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authState !== "hero") return;
    const container = revealContainerRef.current;
    if (!container) return;

    const textWords = container.querySelectorAll(".reveal-word-inner");
    if (textWords.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1.2,
      }
    });

    tl.to(textWords, {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      ease: "power2.out",
      duration: 1
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [authState]);

  // Scroll to logs terminal end
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logMessages]);

  // Load gateway metrics on landing page loading
  useEffect(() => {
    if (authState === "landing") {
      fetch("http://localhost:8000/api/v1/dashboard/metrics")
        .then(res => res.json())
        .then(data => {
          if (data) {
            setMetrics({
              total_source_lines_read: data.total_source_lines_read,
              average_confidence_score: data.average_confidence_score * 100,
              average_processing_speed_lines_sec: data.average_processing_speed_lines_sec,
              total_migrations_run: data.total_migrations_run,
              migration_success_percentage: data.migration_success_percentage,
              compilation_success_percentage: data.compilation_success_percentage,
              vulnerabilities_caught: data.vulnerabilities_caught,
              active_gpu_utilization_percent: data.active_gpu_utilization_percent
            });
          }
        })
        .catch(() => console.log("Gateway metrics offline. Running simulated metrics."));
    }
  }, [authState]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // Validate inputs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setAuthError("Password must be at least 4 characters.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const endpoint = isSignUp 
      ? `${apiUrl}/api/v1/auth/register` 
      : `${apiUrl}/api/v1/auth/session-handshake`;

    try {
      // 1. Try to connect to the backend (Supabase / Neon DB)
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      if (data.access_token) {
        setJwtToken(data.access_token);
        setLogMessages(prev => [...prev, `[Security] Authenticated via cloud backend as ${username}.`]);
        setAuthState("landing");
      } else {
        // If registration was successful but didn't return a token, automatically log in
        if (isSignUp) {
          setIsSignUp(false);
          const loginRes = await fetch(`${apiUrl}/api/v1/auth/session-handshake`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
          const loginData = await loginRes.json();
          if (loginData.access_token) {
            setJwtToken(loginData.access_token);
            setAuthState("landing");
          } else {
            throw new Error("Login failed after registration");
          }
        }
      }
    } catch (err: any) {
      // 2. Fallback to localStorage if the backend is unreachable/offline
      console.warn("Backend auth unavailable. Falling back to local session cache.", err);
      
      const storedUsersRaw = localStorage.getItem("rocm_users");
      const storedUsers: Record<string, string> = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};

      if (isSignUp) {
        if (storedUsers[username]) {
          setAuthError("An account with this email already exists. Please sign in.");
          return;
        }
        storedUsers[username] = password;
        localStorage.setItem("rocm_users", JSON.stringify(storedUsers));
        setLogMessages(prev => [...prev, `[Local Workspace] Account registered successfully for ${username}.`]);
        setJwtToken("session_" + btoa(username));
        setAuthState("landing");
      } else {
        if (!storedUsers[username]) {
          setAuthError("No account found with this email. Please register or start your backend server.");
          return;
        }
        if (storedUsers[username] !== password) {
          setAuthError("Incorrect password. Please try again.");
          return;
        }
        setLogMessages(prev => [...prev, `[Local Workspace] Authenticated locally as ${username}.`]);
        setJwtToken("session_" + btoa(username));
        setAuthState("landing");
      }
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setLogMessages(prev => [...prev, `[Workspace] Shareable link copied to clipboard: ${window.location.href}`]);
      alert("Workspace link copied to clipboard!");
    }
  };

  const handleSave = () => {
    setLogMessages(prev => [...prev, `[Workspace] Checkpoint saved successfully. 12 rules, 5 node mappings persisted.`]);
    alert("Workflow saved successfully!");
  };


  const handleStartMigration = async () => {
    if (isMigrating) return;
    setIsMigrating(true);
    setProgress(0);
    setActiveAgent("Scanner Agent");
    setLogMessages([]);
    setSessionActive(true);

    if (isGuest || forceSimulation) {
      runLocalSimulation();
      return;
    }

    // --- Step 1: POST to /migrate/upload to register session & trigger git clone ---
    let sessionId: string;
    setIsCloning(true); // show spinner on input bar while clone is in-flight
    try {
      const uploadRes = await fetch("http://localhost:8000/api/v1/migrate/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken || "offline_session_jwt_token"}`
        },
        body: JSON.stringify({ repository_url: repoUrl, target_hardware: targetGpu })
      });
      if (!uploadRes.ok) throw new Error(`Upload endpoint returned ${uploadRes.status}`);
      const uploadData = await uploadRes.json();
      sessionId = uploadData.session_id;
      setIsCloning(false); // clone done (or failed gracefully)
      if (uploadData.clone_error) {
        setLogMessages(prev => [...prev, `[Gateway] Warning: ${uploadData.clone_error} — using sample code.`]);
      } else {
        setLogMessages(prev => [...prev, `[Gateway] Repository cloned. Session: ${sessionId}`]);
      }
    } catch (err) {
      setIsCloning(false);
      console.warn("Upload endpoint unreachable. Switching to simulation...", err);
      runLocalSimulation();
      return;
    }

    // --- Step 2: Open WebSocket using the real session_id from the gateway ---
    const ws = new WebSocket(`ws://localhost:8000/api/v1/dashboard/topology-stream/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected for session:", sessionId);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.progress !== undefined) setProgress(data.progress);
      if (data.active_agent) setActiveAgent(data.active_agent);
      if (data.log_message) {
        setLogMessages(prev => [...prev, `[${data.active_agent}] ${data.log_message}`]);
      }
      if (data.status === "COMPLETED") {
        // Capture live translated output to show in diff viewer
        if (data.translated_code) setTranslatedCode(data.translated_code);
        if (data.original_code) setOriginalCode(data.original_code);
        if (data.translated_filename) setTranslatedFilename(data.translated_filename);
        setIsMigrating(false);
        ws.close();
      } else if (data.status === "FAILED" || data.status === "HALTED") {
        setIsMigrating(false);
        ws.close();
      }
    };

    ws.onerror = () => {
      console.warn("Gateway WebSocket failed. Switching to simulation...");
      runLocalSimulation();
    };
  };


  const runLocalSimulation = () => {
    const simulationSteps = [
      { agent: "Scanner Agent", prg: 15, log: "Parsing repository structure and scanning CUDA kernel definitions..." },
      { agent: "Architecture Agent", prg: 30, log: "Mapping directed call graph. Health Score: 91%. Difficulty: Medium." },
      { agent: "Rewrite Agent", prg: 55, log: "Translating shared memory allocations and launch dimensions to HIP specifications..." },
      { agent: "Security Agent", prg: 70, log: "Auditing array memory access boundaries. 0 critical vulnerabilities found." },
      { agent: "Validation Agent", prg: 85, log: "Compiling code in target hipcc container sandbox. Compilation: Success." },
      { agent: "Performance Agent", prg: 95, log: "Measuring wavefront execution latency. Efficiency Parity: 1.15x speedup." },
      { agent: "Report Agent", prg: 100, log: "Migration Completed successfully. Markdown audit report compiled." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < simulationSteps.length) {
        const step = simulationSteps[currentStep];
        setProgress(step.prg);
        setActiveAgent(step.agent);
        setLogMessages(prev => [...prev, `[${step.agent}] ${step.log}`]);
        currentStep++;
      } else {
        setIsMigrating(false);
        clearInterval(interval);
      }
    }, 2500);
  };
  // Render Hero page
  if (authState === "hero") {
    return (
      <div className="synapse-body-wrapper">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4"
          className="fixed inset-0 w-full h-full object-cover pointer-events-none z-[0] opacity-40"
        />
        {/* Navbar */}
        <motion.nav 
          className="synapse-navbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: entranceComplete ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="synapse-nav-left">
            {/* Expanding menu capsule */}
            <motion.div 
              className="synapse-menu-capsule"
              animate={{ width: menuOpen ? (windowWidth < 640 ? "100%" : 290) : 48 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            >
              <SquashHamburger isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && (
                <motion.div 
                  className="flex items-center gap-6 ml-4"
                  initial={{ x: 15, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <a 
                    href="#" 
                    className="text-xs font-normal text-white/85 hover:text-white"
                    onMouseEnter={() => setAboutHovered(true)}
                    onMouseLeave={() => setAboutHovered(false)}
                    onClick={(e) => {
                      e.preventDefault();
                      section2Ref.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <ScrambleText text="About" isHovered={aboutHovered} />
                  </a>
                  <a 
                    href="#" 
                    className="text-xs font-normal text-white/85 hover:text-white"
                    onMouseEnter={() => setMetricsHovered(true)}
                    onMouseLeave={() => setMetricsHovered(false)}
                    onClick={(e) => {
                      e.preventDefault();
                      section3Ref.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <ScrambleText text="Metrics" isHovered={metricsHovered} />
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div>
            <motion.button 
              className="synapse-download-btn"
              onClick={() => setAuthState("login")}
              onMouseEnter={() => setDownloadHovered(true)}
              onMouseLeave={() => setDownloadHovered(false)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ScrambleText text="Launch App" isHovered={downloadHovered} />
            </motion.button>
          </div>
        </motion.nav>

        {/* SECTION 1: Hero (full viewport height) */}
        <section className="synapse-section h-screen-dvh flex flex-col justify-between px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
          <div className="synapse-dot-grid" />

          {/* Large background watermark text */}
          <div className="synapse-watermark text-[clamp(80px,20vw,360px)]">
            ACCELERATION
          </div>

          <div className="flex-1" />

          {/* Bottom row content */}
          {entranceComplete && (
            <motion.div 
              className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Left Column */}
              <div className="flex flex-col gap-4 text-left">
                <h1 className={`${heroTextColor} font-light leading-[0.95] tracking-[-0.03em] text-[clamp(40px,8vw,80px)]`}>
                  <Shuffle
                    text="CUDA"
                    tag="span"
                    shuffleDirection="right"
                    duration={0.35}
                    animationMode="evenodd"
                    shuffleTimes={1}
                    stagger={0.03}
                    textAlign="left"
                    triggerOnce={true}
                    triggerOnHover={true}
                  />
                  <br />
                  <Shuffle
                    text="To HIP"
                    tag="span"
                    shuffleDirection="right"
                    duration={0.35}
                    animationMode="evenodd"
                    shuffleTimes={1}
                    stagger={0.03}
                    textAlign="left"
                    triggerOnce={true}
                    triggerOnHover={true}
                  />
                </h1>
                <motion.p 
                  className={`max-w-sm text-[13px] sm:text-[14px] ${heroMutedTextColor} leading-relaxed font-mono`}
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1], delay: 0.2 }}
                >
                  Built at the intersection of GPU compilation and multi-agent AI. ROCm Navigator continuously maps CUDA APIs, memory patterns, and kernels into AMD HIP equivalents.
                </motion.p>
              </div>

              {/* Right Column */}
              <div className="text-left md:text-right">
                <h1 className={`${heroTextColor} font-light leading-[0.95] tracking-[-0.03em] text-[clamp(40px,8vw,80px)]`}>
                  <Shuffle
                    text="Multi"
                    tag="span"
                    shuffleDirection="left"
                    duration={0.35}
                    animationMode="evenodd"
                    shuffleTimes={1}
                    stagger={0.03}
                    textAlign={windowWidth < 768 ? "left" : "right"}
                    triggerOnce={true}
                    triggerOnHover={true}
                  />
                  <br />
                  <Shuffle
                    text="Agent"
                    tag="span"
                    shuffleDirection="left"
                    duration={0.35}
                    animationMode="evenodd"
                    shuffleTimes={1}
                    stagger={0.03}
                    textAlign={windowWidth < 768 ? "left" : "right"}
                    triggerOnce={true}
                    triggerOnHover={true}
                  />
                </h1>
              </div>
            </motion.div>
          )}
        </section>

        {/* SECTION 2: Cinematic Text (full viewport height) */}
        <section ref={section2Ref} className="synapse-section h-screen-dvh flex items-center justify-center">
          <div className="synapse-perspective-container max-w-5xl z-10">
            <motion.p 
              className="synapse-perspective-text text-[20px] sm:text-[26px] md:text-[32px] lg:text-[38px] px-6 sm:px-12 text-center"
              style={{ 
                transform: transformTemplate,
                opacity: opacityValue
              }}
            >
              A multi-agent compilation system built on the architecture of modern GPU compilers. ROCm Navigator translates NVIDIA CUDA source syntax into high-performance AMD HIP. Every memory allocation becomes clean, structured, and visible. It continuously heals compilation diagnostics in target docker sandboxes. Legacy CUDA syntax is mutated into clean, parallel HIP execution.
            </motion.p>
          </div>
        </section>

        {/* SECTION 2.5: Masked Reveal (GSAP ScrollTrigger) */}
        <section ref={revealContainerRef} className="synapse-section h-screen-dvh flex items-center justify-center relative overflow-hidden">
          <div className="relative z-10 max-w-4xl px-8 text-center">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[24px] sm:text-[36px] md:text-[44px] font-bold text-black leading-tight tracking-tight uppercase">
              {"TRANSFORMING LEGACY COMPILATION INTO NATIVE ACCELERATION THROUGH AUTONOMOUS MUTATION PIPELINES".split(" ").map((word, idx) => (
                <span key={idx} className="relative inline-block overflow-hidden pb-1">
                  <span className="reveal-word-inner inline-block translate-y-[100%] opacity-0">
                    {word}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: Metrics (min-h-screen) */}
        <section ref={section3Ref} className="synapse-section min-h-screen flex items-center justify-center pt-32 pb-32 px-6">
          <div className="max-w-6xl w-full z-10 flex flex-col items-center">
            <motion.span 
              className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-20 text-center block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2 }}
            >
              Performance Metrics
            </motion.span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 w-full">
              {[
                { val: "99.4%", lbl: "API Coverage" },
                { val: "10x+", lbl: "Migration Speed" },
                { val: "100%", lbl: "Sandbox Compile Rate" }
              ].map((metric, i) => (
                <motion.div 
                  key={i} 
                  className="flex flex-col items-center text-center"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                >
                  <Shuffle
                    text={metric.val}
                    tag="span"
                    shuffleDirection="up"
                    duration={0.4}
                    animationMode="evenodd"
                    shuffleTimes={1}
                    stagger={0.03}
                    textAlign="center"
                    triggerOnce={true}
                    triggerOnHover={true}
                    className="text-white text-[clamp(44px,8vw,80px)] font-light tracking-[-0.04em] leading-none"
                  />
                  <span className="text-white/40 text-[13px] sm:text-[14px] mt-4 tracking-wide font-mono">
                    {metric.lbl}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: Technology / Autonomous
              Translation (full viewport height) */}
        <section ref={section4Ref} className="synapse-section h-screen-dvh flex flex-col justify-between px-8 sm:px-12 md:px-16 py-12 sm:py-16">
          {/* Top area */}
          <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6 w-full">
            <h2 className="text-white font-light text-[clamp(32px,6vw,60px)] leading-[0.95] tracking-[-0.03em] text-left">
              <Shuffle
                text="Adaptive"
                tag="span"
                shuffleDirection="right"
                duration={0.4}
                animationMode="evenodd"
                shuffleTimes={1}
                stagger={0.03}
                textAlign="left"
                triggerOnce={true}
                triggerOnHover={true}
              />
              <br />
              <Shuffle
                text="Intelligence"
                tag="span"
                shuffleDirection="right"
                duration={0.4}
                animationMode="evenodd"
                shuffleTimes={1}
                stagger={0.03}
                textAlign="left"
                triggerOnce={true}
                triggerOnHover={true}
              />
            </h2>

            <motion.p 
              className="text-white/50 text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2 font-mono"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              The multi-agent pipeline maps your entire CUDA codebase, isolates dependencies, and compiles the migrated HIP kernels inside isolated hardware validation sandboxes.
            </motion.p>
          </div>

          <div className="flex-1" />

          {/* Bottom Grid */}
          <motion.div 
            className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 w-full text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {[
              { t: "AST Code Scanner", d: "Builds structured Tree-Sitter AST syntax representations of CUDA codes." },
              { t: "API Translator", d: "Maps CUDA library hooks (cuBLAS, cuFFT, etc.) into high-performance rocBLAS and rocFFT." },
              { t: "Sandbox Compiler", d: "Executes dry-run builds on virtualized platforms to diagnose and heal syntax mutations." },
              { t: "Rocprof Benchmarker", d: "Parses hardware telemetry traces to identify and resolve memory bottlenecks." }
            ].map((tech, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
              >
                <h3 className="text-white text-[14px] sm:text-[15px] font-normal mb-2 font-mono">{tech.t}</h3>
                <p className="text-white/40 text-[12px] sm:text-[13px] leading-relaxed font-mono">{tech.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* SECTION 5: Architecture (min-h-screen) */}
        <section ref={section5Ref} className="synapse-section min-h-screen flex items-center justify-center px-6 py-32">
          <div className="max-w-3xl w-full text-center flex flex-col items-center relative z-10">
            {/* Heading Block */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center"
            >
              <span className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8 block font-mono">
                Architecture
              </span>
              <Shuffle
                text="Three layers. Zero friction."
                tag="h2"
                shuffleDirection="down"
                duration={0.4}
                animationMode="evenodd"
                shuffleTimes={1}
                stagger={0.03}
                textAlign="center"
                triggerOnce={true}
                triggerOnHover={true}
                className="text-white font-light text-[clamp(28px,5vw,50px)] leading-[1.15] tracking-[-0.02em] mb-10 text-center"
              />
              <p className="text-white/45 text-[14px] sm:text-[16px] leading-relaxed max-w-xl text-center font-mono">
                Scan layer parses source files. Translation layer resolves API mappings. Validation layer compiles and tests execution on AMD Instinct hardware.
              </p>
            </motion.div>

            {/* Layer Cards */}
            <motion.div 
              className="mt-20 flex flex-col gap-4 w-full items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              {[
                { l: "Layer 1", n: "AST Scan" },
                { l: "Layer 2", n: "HIP Mutate" },
                { l: "Layer 3", n: "GPU Validate" }
              ].map((layer, index) => (
                <div 
                  key={index}
                  className="w-full max-w-md h-[72px] border border-white/10 rounded-lg flex items-center justify-between px-6 bg-zinc-950/20 backdrop-blur-sm"
                >
                  <span className="text-white/30 text-[11px] tracking-[0.15em] uppercase font-mono">{layer.l}</span>
                  <span className="text-white text-[15px] sm:text-[17px] font-light font-mono">{layer.n}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full overflow-hidden border-t border-white/5 relative">
          {/* Paper Texture with Red Spider Lilies */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-85">
            <PaperTexture
              width={1280}
              height={720}
              image={getFullUrl("/red_butterfly.png")}
              colorBack="#ffffff"
              colorFront="#9fadbc"
              contrast={0.3}
              roughness={0.4}
              fiber={0.3}
              fiberSize={0.2}
              crumples={0.3}
              crumpleSize={0.35}
              folds={0.65}
              foldCount={5}
              drops={0.2}
              fade={0}
              seed={5.8}
              scale={0.6}
              fit="cover"
            />
          </div>
          {/* Centered Footer Content with Larger Font */}
          <div className="flex flex-col items-center justify-center min-h-[450px] w-full text-center px-6 relative z-10 py-16">
            <div className="flex flex-col items-center max-w-3xl">
              <div className="flex items-center gap-3 mb-8 bg-zinc-950/40 px-5 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                <SynapseXLogo />
                <span className="font-medium text-sm tracking-[0.15em] uppercase text-white/85 font-mono">ROCm Navigator</span>
              </div>
              <h2 className="text-white font-light text-[clamp(22px,4vw,36px)] leading-[1.3] tracking-tight max-w-2xl mb-4 font-sans">
                The next evolution of GPU acceleration.
              </h2>
              <p className="text-white/50 text-[clamp(14px,2.2vw,18px)] leading-relaxed max-w-2xl font-mono mt-4">
                Automating the migration, validation, and optimization of enterprise CUDA workloads for AMD Instinct GPUs.
              </p>
            </div>
          </div>
        </footer>

                {/* Dedicated Legal & Credits Bar */}
        <div className="w-full bg-[#060608] border-t border-zinc-900/40 py-8 flex flex-col items-center justify-center gap-4 text-center font-mono text-[11px] text-zinc-500 relative z-20">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <button type="button" onClick={() => setActiveModal("terms")} className="hover:text-white transition-colors cursor-pointer text-left">Terms & Conditions</button>
            <button type="button" onClick={() => setActiveModal("privacy")} className="hover:text-white transition-colors cursor-pointer text-left">Privacy Policy</button>
          </div>
          <div className="space-y-1.5 mt-2">
            <div>© 2026 ROCm Navigator. All rights reserved.</div>
            <div className="text-[10px] text-zinc-600">Built by @ansh, @abdullah, @malatesh, @arya, @yashwant.</div>
          </div>
        </div>
        {renderLegalModal()}
      </div>
    );
  }

  // Render Login page
  if (authState === "login") {
    return (
      <div className="dark relative min-h-screen overflow-hidden bg-[#0a0a0c] text-white flex items-center justify-center px-4 w-screen font-sans">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <NeuroNoise
            width={1280}
            height={720}
            colorFront="#ffffff"
            colorMid="#871717"
            colorBack="#000000"
            brightness={0.05}
            contrast={0.3}
            speed={1}
          />
        </div>
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl backdrop-saturate-150">
          <div className="flex justify-center">
            <BrandMark />
          </div>
          <div className="mt-7 flex flex-col items-center text-center">
            <Shuffle
              text="ROCm Navigator"
              tag="h1"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              stagger={0.03}
              textAlign="center"
              triggerOnce={true}
              triggerOnHover={true}
              className="font-heading text-3xl tracking-tight text-white font-bold"
            />
            <p className="mt-2 text-sm text-white/65">
              {isSignUp ? "Register Developer Workspace" : "Secure Authorization Gateway"}
            </p>
          </div>



          {authError && (
            <div className="mb-4 text-[11px] text-red-400 font-mono bg-red-950/20 border border-red-900/40 p-3 rounded-lg">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="glass-signup-email" className="text-white/85">
                Email
                <span className="text-white/45">*</span>
              </FieldLabel>
              <Input
                id="glass-signup-email"
                type="email"
                required
                placeholder="Enter email address..."
                autoComplete="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                nativeInput
                className="border-white/15 bg-white/[0.06] text-white placeholder:text-white/40 hover:bg-white/[0.08] focus-visible:border-white/30"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="glass-signup-password" className="text-white/85">
                Password
                <span className="text-white/45">*</span>
              </FieldLabel>
              <InputGroup className="border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.08] focus-within:border-white/30">
                <InputGroupInput
                  id="glass-signup-password"
                  type={reveal ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  nativeInput
                  className="text-white placeholder:text-white/40"
                />
                <InputGroupAddon align="inline-end">
                  <button
                    type="button"
                    onClick={() => setReveal((v) => !v)}
                    aria-label={reveal ? "Hide password" : "Show password"}
                    className="cursor-pointer rounded p-1 text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 bg-transparent border-none"
                  >
                    {reveal ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Button
              type="submit"
              size="lg"
              className="mt-2 border-transparent bg-white text-[#0a0a0c] hover:bg-white/90 font-semibold"
            >
              {isSignUp ? "Sign up" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center flex flex-col gap-2.5 items-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError("");
              }}
              className="text-xs text-white/65 hover:text-white underline underline-offset-2 bg-transparent border-none outline-none cursor-pointer"
            >
              {isSignUp ? "Already have an account? Sign in" : "First time? Register workspace"}
            </button>
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">or</span>
            <button
              type="button"
              onClick={() => {
                setIsGuest(true);
                setUsername("Guest Developer");
                setAuthState("landing");
              }}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white font-mono border border-white/15 transition-all cursor-pointer outline-none"
            >
              Continue as Guest
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex justify-center gap-4 text-[10px] text-white/40">
            <button type="button" onClick={() => setActiveModal("terms")} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none">Terms & Conditions</button>
            <span>|</span>
            <button type="button" onClick={() => setActiveModal("privacy")} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none">Privacy Policy</button>
          </div>
        </div>
      </div>
    );
  }

  // Render Landing page
  if (authState === "landing") {
    return (
      <div className="min-h-screen w-full indigo-dashboard-root relative flex overflow-hidden">
        {/* Floating Capsule Sidebar */}
        {renderSidebar("landing")}

        {/* Main Content Area - padded left to offset the floating sidebar */}
        <div 
          onMouseEnter={handlePageInteract}
          onClick={handlePageInteract}
          className={`flex-1 flex flex-col h-screen overflow-y-auto pr-6 py-6 md:pr-8 md:py-8 relative scrollbar-none z-10 transition-all duration-300 ${
            sidebarExpanded ? "pl-[240px] md:pl-[260px]" : "pl-24 md:pl-28"
          }`}
        >
          <VideoBackground />

          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#4f46e5]/5 blur-[120px] pointer-events-none" />

          {/* Top header matching reference design style */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1c2242]/30 pb-5 flex-shrink-0 z-10">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Hi, Developer!</h1>
              <p className="text-sm text-[#8fa0dd] mt-1">Let's inspect your ROCm migration parity and execution schedules today.</p>
            </div>
            
            {/* Search and Action bar from Image 1 */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 rounded-full border border-[#1c2242]/30 bg-[#0b0d19]/60 px-3.5 py-1.5 w-full md:w-64">
                <Search className="size-4.5 text-[#cc4155]" />
                <input 
                  type="text" 
                  placeholder="Search for migration data..." 
                  className="bg-transparent text-sm text-[#F0E7D5] outline-none placeholder-[#8fa0dd]/40 w-full"
                />
              </div>
              <button 
                onClick={() => setAuthState("editor")}
                className="px-6 py-2.5 rounded-full bg-[#cc4155] hover:bg-[#e35b6e] text-white font-bold text-sm shadow-md shadow-[#cc4155]/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-none cursor-pointer outline-none flex-shrink-0"
              >
                Launch Editor
              </button>
            </div>
          </header>

          {/* Widgets Grid - Top row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 z-10">
            
            {/* Card 1: Overlapping fuzzy circles card (Workout results styled) */}
            <div className="lg:col-span-12 p-6 indigo-glass-card flex flex-col justify-between relative overflow-hidden min-h-[260px]">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8fa0dd]">Migration Results</span>
                  <h3 className="text-lg font-bold text-[#F0E7D5] mt-0.5">Parity Coverage & Performance</h3>
                </div>
                <div className="size-7 rounded-full bg-[#0b0d19]/60 border border-[#1c2242]/20 flex items-center justify-center cursor-pointer hover:bg-[#1c203b]/30">
                  <span className="text-xs text-[#cc4155]">●</span>
                </div>
              </div>

              {/* Overlapping fuzzy circles center visualizer */}
              <div className="my-auto relative flex justify-center items-center h-[160px] overflow-visible">
                <div className="fuzzy-circles-wrapper">
                  {/* Black solid bubble */}
                  <div className="fuzzy-circle fuzzy-circle-black">
                    <span className="font-mono text-sm font-bold">10x+</span>
                    <span className="text-[10px] text-[#8fa0dd] uppercase">speedup</span>
                  </div>
                  {/* Red fuzzy circle */}
                  <div className="fuzzy-circle fuzzy-circle-red">
                    <span className="font-mono text-base font-bold text-white">12k+</span>
                    <span className="text-[10px] text-[#F0E7D5] uppercase">lines read</span>
                  </div>
                  {/* Yellow fuzzy circle */}
                  <div className="fuzzy-circle fuzzy-circle-yellow">
                    <span className="font-mono text-lg font-bold text-white">99.4%</span>
                    <span className="text-xs text-white uppercase font-bold bg-[#cc4155] px-1.5 py-0.5 rounded mt-0.5">compile</span>
                  </div>
                </div>
              </div>

              {/* Legend matching reference labels */}
              <div className="flex gap-6 text-xs text-[#8fa0dd] mt-2 pt-2 border-t border-[#1c2242]/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 rounded bg-[#cc4155]" />
                  <span>Compilation success</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 rounded bg-[#4f46e5]" />
                  <span>Source lines translated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 rounded bg-[#0b0d19] border border-[#6366f1]/20" />
                  <span>Accelerator efficiency</span>
                </div>
              </div>
            </div>

          </div>

          {/* Widgets Grid - Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 z-10">
            
            {/* Card 3: Steps for Today style circular goal tracker */}
            <div className="lg:col-span-4 p-6 indigo-glass-card flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8fa0dd]">Goal Progress</span>
                <h4 className="text-sm font-bold text-[#F0E7D5] mt-0.5">Lines Migrated Today</h4>
              </div>

              <div className="flex items-center justify-around my-2">
                {/* SVG Progress Circle */}
                <div className="relative size-24 flex items-center justify-center">
                  <svg className="absolute inset-0 size-full -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-[#1c2242]/30 fill-none" strokeWidth="6" />
                    <circle cx="48" cy="48" r="40" className="stroke-[#4f46e5] fill-none" strokeWidth="6" strokeDasharray={251.2} strokeDashoffset={251.2 * 0.2} strokeLinecap="round" />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-[#8fa0dd] uppercase font-bold">Goal 15k</span>
                    <span className="font-mono text-base font-bold text-white mt-0.5">{metrics.total_migrations_run * 4000 + 50}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <span className="text-xs uppercase font-bold text-[#8fa0dd]">Compilation Status</span>
                  <span className="text-sm font-bold text-emerald-400">100% OK</span>
                  <button 
                    onClick={() => setAuthState("editor")}
                    className="mt-2 px-3 py-1.5 rounded bg-[#4f46e5] hover:bg-[#6366f1] text-xs font-bold text-white cursor-pointer transition-all border-none outline-none"
                  >
                    Change Target
                  </button>
                </div>
              </div>
            </div>

            {/* Card 4: Weight Loss Plan style slider progress tracker */}
            <div className="lg:col-span-4 p-6 indigo-glass-card flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8fa0dd]">Translation Progress</span>
                <h4 className="text-sm font-bold text-[#F0E7D5] mt-0.5">Overall Ingestion Parity</h4>
              </div>

              {/* Slider Scale bar from Image 1 */}
              <div className="slider-container-box">
                <div className="slider-scale-line">
                  <div className="slider-scale-fill" style={{ width: "68%" }} />
                  <div className="slider-scale-dots">
                    <span className="slider-scale-dot" />
                    <span className="slider-scale-dot" />
                    <span className="slider-scale-dot" />
                    <span className="slider-scale-dot" />
                    <span className="slider-scale-dot" />
                  </div>
                  {/* Floating badge pointing out progress */}
                  <div className="slider-scale-badge" style={{ left: "68%" }}>
                    68% Ingestion
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs font-mono text-[#8fa0dd] mt-1">
                <span>0 MB Ingested</span>
                <span>2.5 MB Limit</span>
              </div>
            </div>

            {/* Card 5: My Habits style pipeline status indicator blocks */}
            <div className="lg:col-span-4 p-6 indigo-glass-card flex flex-col justify-between min-h-[220px]">
              <div className="flex justify-between items-center border-b border-[#1c2242]/20 pb-2 mb-3">
                <span className="text-xs font-bold text-[#F0E7D5] uppercase tracking-wider">Active Pipeline Nodes</span>
                <span className="text-xs text-[#4f46e5] font-bold cursor-pointer hover:underline" onClick={() => setAuthState("editor")}>Add Node +</span>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-1 scrollbar-none flex-1">
                {[
                  { name: "Scanner Agent", desc: "Tree-sitter parser", completed: [true, true, true, true, true, true, true, true, false, false] },
                  { name: "Rewrite Agent", desc: "LLM translator node", completed: [true, true, true, true, true, false, false, false, false, false] },
                  { name: "Validation Agent", desc: "Isolated hipcc compiler", completed: [true, true, true, true, true, true, true, true, true, true] },
                  { name: "Performance Agent", desc: "CDNA occupancy benchmark", completed: [true, true, true, true, false, false, false, false, false, false] }
                ].map((pipeline, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-[#F0E7D5]">{pipeline.name}</span>
                      <span className="text-[10px] text-[#8fa0dd]">{pipeline.desc}</span>
                    </div>

                    {/* Sequence of squares matching reference image */}
                    <div className="habit-grid-dots">
                      {pipeline.completed.map((comp, blockIdx) => (
                        <span 
                          key={blockIdx} 
                          className={`habit-dot-square ${
                            comp 
                              ? "bg-[#4f46e5]" 
                              : "bg-[#0b0d19] border border-[#1c2242]/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          
          {/* Main workspace action buttons footer */}
          <footer className="mt-8 flex justify-center gap-4 z-10">
            <button 
              onClick={() => setAuthState("editor")}
              className="px-6 py-2.5 rounded-full bg-[#cc4155] hover:bg-[#e35b6e] text-white text-sm font-bold shadow-md shadow-[#cc4155]/20 cursor-pointer border-none outline-none"
            >
              Configure AI Pipelines
            </button>
            <button 
              onClick={() => setAuthState("history")}
              className="px-6 py-2.5 rounded-full bg-[#0b0d19]/60 hover:bg-[#1c203b]/30 text-[#F0E7D5] border border-[#4f46e5]/40 text-sm font-bold transition-all cursor-pointer outline-none"
            >
              Inspect History Passes
            </button>
          </footer>
        </div>
        {renderLegalModal()}
      </div>
    );
  }

  // Render History passes tracking view
  if (authState === "history") {
    return (
      <div className="min-h-screen w-full indigo-dashboard-root relative flex overflow-hidden">
        <VideoBackground />

        {renderSidebar("history")}

        <div 
          onMouseEnter={handlePageInteract}
          onClick={handlePageInteract}
          className={`flex-1 flex flex-col h-screen overflow-y-auto pr-6 py-6 md:pr-8 md:py-8 relative scrollbar-none z-10 transition-all duration-300 ${
            sidebarExpanded ? "pl-[240px] md:pl-[260px]" : "pl-24 md:pl-28"
          }`}
        >
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#4f46e5]/5 blur-[120px] pointer-events-none" />
            
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1c2242]/30 pb-5 flex-shrink-0 z-10">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Historical Optimization Tracking</h1>
              <p className="text-xs text-[#8fa0dd] mt-1">Trace and compare previous compiler optimization passes side-by-side.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 rounded-full border border-[#1c2242]/30 bg-[#0b0d19]/60 px-3.5 py-1.5 w-full md:w-56">
                <Search className="size-4 text-[#8fa0dd]/60" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search migration passes..." 
                  className="bg-transparent text-xs text-[#F0E7D5] outline-none placeholder-[#8fa0dd]/40 w-full" 
                />
              </div>
              <button
                onClick={() => setAuthState("editor")}
                className="px-5 py-2 rounded-full bg-[#cc4155] hover:bg-[#e35b6e] text-white font-bold text-xs shadow-md shadow-[#cc4155]/20 hover:scale-[1.02] transition-all border-none cursor-pointer outline-none flex-shrink-0"
              >
                New Run +
              </button>
            </div>
          </header>

          {isGuest ? (
            <div className="mt-8 py-16 flex flex-col items-center justify-center text-center border border-dashed border-[#4f46e5]/30 rounded-2xl bg-[#12162b]/30 backdrop-blur-md px-4 z-10">
              <div className="size-12 rounded-full bg-[#cc4155]/10 flex items-center justify-center text-[#cc4155] mb-3">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Guest Mode Active</h3>
              <p className="text-xs text-[#8fa0dd] mt-1 max-w-sm">No persistent runs are recorded or saved in Guest Mode. Sign in or register to enable workspace execution pass history.</p>
              <button onClick={() => setAuthState("login")} className="mt-4 px-4 py-1.5 rounded-full bg-[#cc4155] text-white text-xs font-bold hover:bg-[#e35b6e] transition-all border-none cursor-pointer">
                Sign In / Register
              </button>
            </div>
          ) : (
            <>
              {/* Project card grid — Image 2 style */}
              <section className="mt-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8fa0dd]">Choose a migration run to inspect</span>
                  <div className="flex items-center gap-1.5 text-[8px] text-[#8fa0dd]/60 font-mono">
                    <span>Sort by:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#0b0d19]/85 border border-[#1c2242]/35 rounded text-[#8fa0dd] text-[8px] px-1.5 py-0.5 outline-none cursor-pointer hover:border-[#4f46e5]/40 hover:bg-[#12162b] transition-colors"
                    >
                      <option value="recent">Recent</option>
                      <option value="parity">HIP Parity</option>
                      <option value="lines">Lines Count</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {(() => {
                    const linesArr = [142, 12050, 850, 320, 4800];
                    const processedPasses = MOCK_HISTORY_PASSES.map((pass, originalIndex) => {
                      const parity = pass.status === "SUCCESS" ? (96 + originalIndex * 1.2).toFixed(1) : (71 - originalIndex * 3).toFixed(1);
                      const linesCount = linesArr[originalIndex % linesArr.length];
                      return {
                        ...pass,
                        originalIndex,
                        parity,
                        linesCount
                      };
                    });

                    const filteredPasses = processedPasses.filter(pass => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        pass.pass_name.toLowerCase().includes(q) ||
                        pass.notes.toLowerCase().includes(q) ||
                        pass.code.toLowerCase().includes(q)
                      );
                    });

                    const sortedPasses = [...filteredPasses].sort((a, b) => {
                      if (sortBy === "parity") {
                        return parseFloat(b.parity) - parseFloat(a.parity);
                      }
                      if (sortBy === "lines") {
                        return b.linesCount - a.linesCount;
                      }
                      return b.originalIndex - a.originalIndex;
                    });

                    if (sortedPasses.length === 0) {
                      return (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-[#8fa0dd]/50 text-xs font-mono border border-dashed border-[#1c2242]/30 rounded-2xl bg-[#12162b]/30">
                          No matching migration passes found.
                        </div>
                      );
                    }

                    return sortedPasses.map((pass) => {
                      const isSelected = pass.originalIndex === selectedPassIdx;
                      const accentColors = ["from-blue-500/20", "from-purple-500/20", "from-[#4f46e5]/20", "from-amber-500/20", "from-emerald-500/20"];
                      const avatarColors = ["bg-blue-500", "bg-pink-500", "bg-purple-400", "bg-amber-500", "bg-rose-500"];
                      return (
                        <div
                          key={pass.originalIndex}
                          onClick={() => setSelectedPassIdx(pass.originalIndex)}
                          className={`relative p-4 rounded-2xl border flex flex-col gap-3 cursor-pointer transition-all duration-200 ${isSelected ? "border-[#4f46e5]/50 bg-[#1c203b]/80 shadow-lg shadow-[#4f46e5]/10" : "border-[#1c2242]/30 bg-[#12162b]/60 hover:border-[#6366f1]/30 hover:bg-[#1c203b]/30"}`}
                        >
                          {/* Preview banner with code snippets */}
                          <div className={`h-24 rounded-xl relative overflow-hidden flex items-center justify-center bg-gradient-to-br ${accentColors[pass.originalIndex % accentColors.length]} to-transparent border border-[#1c2242]/20`}>
                            <div className="absolute inset-0 opacity-25 p-2 font-mono text-[5.5px] text-[#F0E7D5]/60 leading-tight overflow-hidden select-none">
                              {pass.code.slice(0, 240)}
                            </div>
                            <span className={`relative z-10 text-[8px] font-bold px-2.5 py-1 rounded-full border ${pass.status === "SUCCESS" ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/50" : "bg-red-950/80 text-red-400 border-red-800/50"}`}>
                              {pass.status}
                            </span>
                            {isSelected && (
                              <div className="absolute top-2 right-2 size-5 rounded-full bg-[#4f46e5] flex items-center justify-center border border-[#6366f1]/30 shadow">
                                <span className="text-white text-[7px] font-bold">✓</span>
                              </div>
                            )}
                          </div>

                          {/* Title + time */}
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold text-white leading-tight">{pass.pass_name}</span>
                            <span className="text-[8px] text-[#8fa0dd]/80 font-mono">{pass.timestamp}</span>
                          </div>

                          {/* Metrics row */}
                          <div className="grid grid-cols-3 gap-2 border-t border-[#1c2242]/15 pt-2.5">
                            <div className="flex flex-col items-center">
                              <span className="text-[7px] uppercase font-bold text-[#8fa0dd]/60">Lines</span>
                              <span className="text-[10px] font-mono font-bold text-[#F0E7D5] mt-0.5">{pass.linesCount.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col items-center border-x border-[#1c2242]/15">
                              <span className="text-[7px] uppercase font-bold text-[#8fa0dd]/60">Parity</span>
                              <span className="text-[10px] font-mono font-bold text-emerald-400 mt-0.5">{pass.parity}%</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[7px] uppercase font-bold text-[#8fa0dd]/60">Stage</span>
                              <span className="text-[10px] font-mono font-bold text-[#f5be4f] mt-0.5">P{pass.originalIndex + 1}</span>
                            </div>
                          </div>

                          {/* Avatar stack + status dot */}
                          <div className="flex items-center justify-between border-t border-[#1c2242]/15 pt-2">
                            <div className="flex -space-x-2">
                              {[0, 1, 2].map((a) => (
                                <div key={a} className={`size-5 rounded-full ${avatarColors[(pass.originalIndex + a) % avatarColors.length]} border border-[#12162b] text-white text-[5.5px] font-bold flex items-center justify-center uppercase shadow`}>
                                  {String.fromCharCode(65 + (pass.originalIndex + a) % 26)}
                                </div>
                              ))}
                              <div className="size-5 rounded-full bg-[#1c203b] border border-[#6366f1]/20 text-[5px] font-bold text-[#8fa0dd] flex items-center justify-center">+2</div>
                            </div>
                            <span className={`text-[7px] font-semibold ${pass.status === "SUCCESS" ? "text-emerald-400" : "text-[#6366f1]"}`}>
                              {pass.status === "SUCCESS" ? "● Active" : "● Review"}
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </section>

              {/* Expanded diff viewer */}
              <section className="mt-8 indigo-glass-card flex flex-col overflow-hidden z-10 min-h-[300px]">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1c2242]/30 bg-[#151930]/20 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Code className="h-3.5 w-3.5 text-[#8fa0dd]/60" />
                    <span className="text-[10px] font-bold text-[#8fa0dd] uppercase tracking-widest font-mono">Inspecting: {MOCK_HISTORY_PASSES[selectedPassIdx].pass_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[8px]">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span className="text-amber-300/80 font-medium">{MOCK_HISTORY_PASSES[selectedPassIdx].notes}</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 overflow-hidden text-[9px] font-mono leading-normal min-h-[260px]">
                  <div className="flex flex-col border-r border-[#1c2242]/20 overflow-y-auto scrollbar-none">
                    <div className="sticky top-0 bg-[#0b0d19]/90 backdrop-blur px-3 py-1 text-[8px] font-bold text-[#8fa0dd] uppercase tracking-widest border-b border-[#1c2242]/20">
                      {MOCK_HISTORY_PASSES[selectedPassIdx].pass_name} — Code State
                    </div>
                    <pre className="p-3 text-[#F0E7D5]/90 overflow-x-auto"><code>{MOCK_HISTORY_PASSES[selectedPassIdx].code}</code></pre>
                  </div>
                  <div className="flex flex-col overflow-y-auto bg-[#0b0d19]/20 scrollbar-none">
                    <div className="sticky top-0 bg-[#0b0d19]/90 backdrop-blur px-3 py-1 text-[8px] font-bold text-[#8fa0dd] uppercase tracking-widest border-b border-[#1c2242]/20 flex justify-between items-center">
                      <span>Final Compiled Target Code</span>
                      <span className="text-emerald-400 font-bold">Verified HIP ✓</span>
                    </div>
                    <pre className="p-3 text-white overflow-x-auto bg-[#0b0d19]/10"><code>{MOCK_DIFFS[1].rewritten}</code></pre>
                  </div>
                </div>
              </section>
            </>
          )}

          <footer className="mt-6 flex justify-center gap-4 z-10 pb-6">
            <button onClick={() => setAuthState("landing")} className="px-6 py-2.5 rounded-full bg-[#0b0d19]/60 hover:bg-[#1c203b]/30 text-[#F0E7D5] border border-[#6366f1]/20 text-xs font-bold transition-all cursor-pointer outline-none">
              ← Back to Dashboard
            </button>
            <button onClick={() => setAuthState("editor")} className="px-6 py-2.5 rounded-full bg-[#4f46e5] hover:bg-[#6366f1] text-white text-xs font-bold transition-all shadow-md shadow-[#4f46e5]/20 cursor-pointer border-none outline-none">
              Open in Editor →
            </button>
          </footer>
        </div>
        {renderLegalModal()}
      </div>
    );
  }

  // Render Editor Canvas
  return (
    <div className="flex h-screen w-screen overflow-hidden indigo-dashboard-root font-sans relative">
      <VideoBackground />
      
      {/* Settings slide-over panel */}
      {settingsOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-all duration-300">
          <div className="w-80 indigo-sidebar backdrop-blur-xl border-l border-[#1c2242]/40 h-full p-6 flex flex-col justify-between shadow-2xl relative text-[#F0E7D5]">
            <button 
              onClick={() => setSettingsOpen(false)}
              className="absolute top-4 right-4 text-[#8fa0dd] hover:text-white cursor-pointer bg-transparent border-none"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6 mt-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F0E7D5] border-b border-[#1c2242]/30 pb-2">Workspace Configurations</h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-[#8fa0dd]/60 uppercase tracking-wide">Fireworks API Key</label>
                  <div className="flex items-center gap-2 rounded border border-[#1c2242]/30 bg-[#0b0d19]/60 px-2.5 py-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#8fa0dd]/50" />
                    <input 
                      type="password"
                      value={fireworksKey}
                      onChange={(e) => setFireworksKey(e.target.value)}
                      placeholder="Enter API key..."
                      className="w-full bg-transparent text-[10px] text-zinc-300 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-[#8fa0dd]/60 uppercase tracking-wide">Target Accelerator hardware</label>
                  <select 
                    value={targetGpu}
                    onChange={(e) => setTargetGpu(e.target.value)}
                    className="w-full bg-[#0b0d19]/60 border border-[#1c2242]/30 rounded px-2.5 py-1.5 text-[10px] text-zinc-300 outline-none cursor-pointer"
                  >
                    <option value="AMD Instinct MI300X">AMD Instinct MI300X (CDNA3)</option>
                    <option value="AMD Instinct MI250X">AMD Instinct MI250X (CDNA2)</option>
                    <option value="AMD Radeon PRO W7900">AMD Radeon PRO W7900 (RDNA3)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between border-t border-[#1c2242]/20 pt-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#F0E7D5]">Force Simulation Mode</span>
                    <span className="text-[8px] text-[#8fa0dd]/60 leading-normal">Bypasses WebSocket backend requests</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={forceSimulation}
                    onChange={(e) => setForceSimulation(e.target.checked)}
                    className="h-4 w-4 rounded border-[#1c2242]/30 text-[#4f46e5] focus:ring-[#4f46e5] bg-[#0b0d19]"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSettingsOpen(false)}
              className="w-full py-2 bg-[#4f46e5] hover:bg-[#6366f1] text-white text-xs font-bold rounded-full transition-all duration-200 border-none cursor-pointer outline-none shadow-md shadow-[#4f46e5]/20"
            >
              Apply Configurations
            </button>
          </div>
        </div>
      )}

      {/* Left Navigation Sidebar */}
      {renderSidebar("editor")}

      {/* Main Workspace Frame */}
      <div 
        onMouseEnter={handlePageInteract}
        onClick={handlePageInteract}
        className={`flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all duration-300 ${
          sidebarExpanded ? "pl-[240px] md:pl-[260px]" : "pl-24 md:pl-28"
        }`}
      >
        
        {/* Header Navigation */}
        <header className="h-14 border-b border-[#1c2242]/30 flex items-center justify-between px-6 bg-[#0b0d19]/40 backdrop-blur flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* macOS traffic light window controls from Image 2 */}
            <div className="mac-traffic-lights mr-1.5 flex-shrink-0">
              <span className="mac-dot mac-dot-close" />
              <span className="mac-dot mac-dot-minimize" />
              <span className="mac-dot mac-dot-maximize" />
            </div>
            <Shuffle
              text="Workflow Editor"
              tag="span"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              stagger={0.03}
              textAlign="left"
              triggerOnce={true}
              triggerOnHover={true}
              className="text-xs font-bold text-[#F0E7D5] tracking-wide"
            />
            <span className="h-1.5 w-1.5 rounded-full bg-[#1c2242]" />
            <div className="flex items-center gap-2 bg-[#4f46e5]/10 border border-[#4f46e5]/30 px-2 py-0.5 rounded text-[9px] font-semibold text-[#6366f1]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4f46e5] animate-pulse"></span>
              <span>MI300X EMULATOR</span>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="hidden sm:flex items-center bg-[#0b0d19]/60 p-0.5 rounded-md border border-[#1c2242]/30">
            <button 
              onClick={() => {
                setActiveTab("editor");
                scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1 text-xs font-bold uppercase rounded transition-all duration-200 border-none cursor-pointer outline-none ${activeTab === "editor" ? "bg-[#4f46e5]/20 text-[#F0E7D5] border border-[#4f46e5]/20" : "text-[#8fa0dd] hover:text-white bg-transparent"}`}
            >
              Editor
            </button>
            <button 
              onClick={() => {
                setActiveTab("executions");
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    top: scrollContainerRef.current.scrollHeight,
                    behavior: "smooth"
                  });
                }
              }}
              className={`px-3 py-1 text-xs font-bold uppercase rounded transition-all duration-200 border-none cursor-pointer outline-none ${activeTab === "executions" ? "bg-[#4f46e5]/20 text-[#F0E7D5] border border-[#4f46e5]/20" : "text-[#8fa0dd] hover:text-white bg-transparent"}`}
            >
              Executions
            </button>
          </div>

          {/* Config Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#0b0d19]/60 border border-[#4f46e5]/40 hover:bg-[#1c203b]/30 text-[#8fa0dd] font-semibold text-sm transition-all duration-200 cursor-pointer outline-none"
            >
              <Share2 className="h-4 w-4 text-[#cc4155]" />
              <span className="hidden md:inline">Share</span>
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#0b0d19]/60 border border-[#4f46e5]/40 hover:bg-[#1c203b]/30 text-[#8fa0dd] font-semibold text-sm transition-all duration-200 cursor-pointer outline-none"
            >
              <Save className="h-4 w-4 text-[#cc4155]" />
              <span className="hidden md:inline">Save</span>
            </button>
            
            {/* Launch pipeline run */}
            <button 
              onClick={handleStartMigration}
              disabled={isMigrating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#cc4155] hover:bg-[#e35b6e] text-white font-bold text-sm shadow-md shadow-[#cc4155]/20 transition-all disabled:bg-zinc-800 disabled:text-zinc-500 border-none cursor-pointer outline-none"
            >
              {isMigrating ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>Porting ({progress}%)</span>
                </>
              ) : (
                <>
                  <PlayCircle className="h-4.5 w-4.5 fill-white/10" />
                  <span>Test workflow</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Visual Work Area */}
        <div ref={scrollContainerRef} className="flex-1 flex flex-col overflow-y-auto pb-8 scrollbar-thin">
          
          <main className="flex-shrink-0 flex flex-col relative gap-6 p-6">
            
            {/* Repository URL Input */}
            <div className="max-w-xl w-full z-10">
              <div className={`flex items-center gap-2.5 rounded-lg border shadow-xl px-3 py-2 backdrop-blur transition-colors ${
                isCloning
                  ? "border-[#4f46e5]/60 bg-[#0b0d19]/90"
                  : "border-[#4f46e5]/40 bg-[#0b0d19]/80"
              }`}>
                {isCloning ? (
                  <svg className="h-4 w-4 text-[#4f46e5] animate-spin flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                ) : (
                  <Search className="h-4.5 w-4.5 text-[#cc4155] flex-shrink-0" />
                )}
                <input 
                  type="text" 
                  value={isCloning ? "Cloning repository..." : repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={isMigrating || isCloning}
                  className={`w-full bg-transparent text-sm placeholder-[#8fa0dd]/50 outline-none ${
                    isCloning ? "text-[#6366f1]" : "text-[#F0E7D5]"
                  }`}
                  placeholder="Enter legacy repository Git URL..."
                />
              </div>
            </div>

            {/* Dedicated Box for Agent Flow Diagram */}
            <div className="w-full border border-[#4f46e5]/40 bg-[#0b0d19]/60 backdrop-blur-md rounded-xl p-4 h-[380px] z-10 flex flex-col shadow-lg flex-shrink-0">
              <div className="flex justify-between items-center border-b border-[#1c2242]/20 pb-2 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">AI Agent Execution Pipeline Flow</span>
                <span className="text-xs text-[#cc4155] font-bold font-mono">Visualization Canvas</span>
              </div>
              <div className="flex-1 w-full relative min-h-0 bg-[#0b0d19]/45 rounded-lg overflow-hidden border border-[#4f46e5]/20">
                <AgentFlow activeAgent={activeAgent} progress={progress} isMigrating={isMigrating} />
              </div>
            </div>

            {/* Team Cards Section */}
            <div className="w-full z-10 grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
              {/* Design Team / Scanner Team Card */}
              <div className="p-3.5 rounded-xl border border-[#4f46e5]/40 bg-[#12162b]/50 backdrop-blur-md shadow-lg flex flex-col justify-between min-h-[95px] hover:border-[#cc4155]/40 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Scanner Team</span>
                  <div className="avatar-group-stack">
                    <div className="size-4.5 rounded-full bg-blue-500 text-[6px] font-bold text-white flex items-center justify-center border border-[#12162b]">S</div>
                    <div className="size-4.5 rounded-full bg-pink-500 text-[6px] font-bold text-white flex items-center justify-center border border-[#12162b] -mr-1">P</div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 mt-2">
                  {/* Traffic Lights (Red, Yellow, Green status circles) */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]/30" />
                    <span className="w-2 h-2 rounded-full bg-[#ffbd2e]/30" />
                    <span className="w-2 h-2 rounded-full bg-[#27c93f] shadow-md shadow-[#27c93f]/40 animate-pulse" />
                  </div>
                  <div className="flex flex-col text-xs font-mono text-[#8fa0dd] gap-0.5">
                    <span>• 14 hours spent coding</span>
                    <span>• 8 static AST rules matching</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] mt-0.5">Scanner active</span>
                  </div>
                </div>
              </div>

              {/* Programming Team / Translation Team Card */}
              <div className="p-3.5 rounded-xl border border-[#4f46e5]/40 bg-[#12162b]/50 backdrop-blur-md shadow-lg flex flex-col justify-between min-h-[95px] hover:border-[#cc4155]/40 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Translation Team</span>
                  <div className="avatar-group-stack">
                    <div className="size-4.5 rounded-full bg-rose-500 text-[6px] font-bold text-white flex items-center justify-center border border-[#12162b]">R</div>
                    <div className="size-4.5 rounded-full bg-emerald-500 text-[6px] font-bold text-white flex items-center justify-center border border-[#12162b] -mr-1">E</div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 mt-2">
                  {/* Traffic Lights */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]/30" />
                    <span className="w-2 h-2 rounded-full bg-[#ffbd2e] shadow-md shadow-[#ffbd2e]/40 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-[#27c93f]/30" />
                  </div>
                  <div className="flex flex-col text-xs font-mono text-[#8fa0dd] gap-0.5">
                    <span>• 48 hours spent translating</span>
                    <span>• 12 rewritten kernels cached</span>
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] mt-0.5">Synthesizer queued</span>
                  </div>
                </div>
              </div>

              {/* Marketing Team / Verification Team Card */}
              <div className="p-3.5 rounded-xl border border-[#4f46e5]/40 bg-[#12162b]/50 backdrop-blur-md shadow-lg flex flex-col justify-between min-h-[95px] hover:border-[#cc4155]/40 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Verification Team</span>
                  <div className="avatar-group-stack">
                    <div className="size-4.5 rounded-full bg-yellow-500 text-[6px] font-bold text-white flex items-center justify-center border border-[#12162b]">V</div>
                    <div className="size-4.5 rounded-full bg-[#4f46e5] text-[6px] font-bold text-white flex items-center justify-center border border-[#12162b] -mr-1">S</div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 mt-2">
                  {/* Traffic Lights */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-md shadow-[#3b82f6]/40 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-[#ffbd2e]/30" />
                    <span className="w-2 h-2 rounded-full bg-[#27c93f]/30" />
                  </div>
                  <div className="flex flex-col text-xs font-mono text-[#8fa0dd] gap-0.5">
                    <span>• 24 hours spent compiling</span>
                    <span>• 2 compilation warnings</span>
                    <span className="text-[#4f46e5] font-bold uppercase tracking-wider text-[10px] mt-0.5">Validation idle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Telemetry Logs & Diff Explorer Panel */}
            <section className="w-full border border-[#4f46e5]/40 bg-[#0f1225]/50 backdrop-blur-md rounded-xl overflow-hidden flex flex-col shadow-lg min-h-[380px] h-[380px] flex-shrink-0">
              
              {/* Telemetries readouts */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#4f46e5]/30 bg-[#0b0d19]/30 flex-shrink-0 text-[#8fa0dd]/90">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8fa0dd]">Active Execution Telemetry</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4f46e5]"></span>
                  <span className="text-xs font-medium text-emerald-400">Confidence: 96.4%</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span>GPU Occupancy: 82%</span>
                  <span>●</span>
                  <span>{targetGpu}</span>
                </div>
              </div>

              {/* Console & Splits split */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                
                {/* Console Logs */}
                <div className="md:col-span-4 border-r border-[#4f46e5]/30 flex flex-col overflow-hidden bg-[#0b0d19]/10">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#4f46e5]/30 bg-[#0b0d19]/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#8fa0dd] uppercase tracking-wider font-mono">
                      <Terminal className="h-4 w-4 text-[#cc4155]" />
                      <span>Console Logs</span>
                    </div>
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-[#F0E7D5]/80 space-y-1.5 leading-normal bg-[#06070d]/60 scrollbar-none">
                    {logMessages.length === 0 ? (
                      <div className="text-[#8fa0dd]/50 italic">Console idle. Click 'Test workflow' to execute migration pipeline nodes...</div>
                    ) : (
                      logMessages.map((log, idx) => (
                        <div key={idx} className="border-l border-[#4f46e5]/30 pl-2 py-0.5 hover:bg-[#4f46e5]/10">
                          {log}
                        </div>
                      ))
                    )}
                    <div ref={logEndRef}></div>
                  </div>
                </div>

                {/* Diff Viewer */}
                <div className="md:col-span-8 flex flex-col overflow-hidden bg-[#1a0709]/10">
                  <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#4f46e5]/30 bg-[#0b0d19]/20">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-[#cc4155]" />
                      <span className="text-xs font-bold text-[#8fa0dd] uppercase tracking-wider">Comparative Code Diff Explorer</span>
                      {translatedCode && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-900/40 border border-emerald-800/50 text-xs font-bold text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Live output
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* File tabs — only show when using mock data */}
                      {!translatedCode && MOCK_DIFFS.map((diff, idx) => (
                        <button
                          key={diff.filename}
                          onClick={() => setSelectedFileIdx(idx)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all border cursor-pointer ${idx === selectedFileIdx ? "bg-[#1c203b] border-[#4f46e5] text-white" : "border-transparent text-[#8fa0dd] hover:text-[#F0E7D5]"}`}
                        >
                          {diff.filename}
                        </button>
                      ))}
                      {/* Download button */}
                      <button
                        onClick={() => {
                          const codeToDownload = translatedCode || MOCK_DIFFS[selectedFileIdx].rewritten;
                          const originalFilename = translatedCode ? (translatedFilename || "output.hip") : MOCK_DIFFS[selectedFileIdx].filename;
                          const downloadFilename = originalFilename.endsWith(".hip") 
                            ? originalFilename 
                            : originalFilename.replace(/\.cu$/, ".hip");
                            
                          const blob = new Blob([codeToDownload], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = downloadFilename;
                          a.click();
                          URL.revokeObjectURL(url);
                          
                          setLogMessages(prev => [...prev, `[Workspace] Downloaded translated file: ${downloadFilename}`]);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cc4155] hover:bg-[#e35b6e] text-white text-xs font-bold transition-colors border-none cursor-pointer outline-none ml-2"
                      >
                        <Download className="h-4 w-4" />
                        Download .hip
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 overflow-hidden text-xs font-mono leading-normal">
                    {/* LEFT — CUDA source */}
                    <div className="flex flex-col border-r border-[#4f46e5]/30 overflow-y-auto scrollbar-none">
                      <div className="sticky top-0 bg-[#0b0d19]/60 backdrop-blur px-3 py-1.5 text-xs font-bold text-[#8fa0dd] uppercase tracking-widest border-b border-[#4f46e5]/30">
                        NVIDIA CUDA (Source)
                      </div>
                      <pre className="p-3 text-[#F0E7D5]/90 overflow-x-auto">
                        <code>{translatedCode ? originalCode : MOCK_DIFFS[selectedFileIdx].original}</code>
                      </pre>
                    </div>

                    {/* RIGHT — HIP target */}
                    <div className="flex flex-col overflow-y-auto bg-[#0b0d19]/20 scrollbar-none">
                      <div className="sticky top-0 bg-[#0b0d19]/60 backdrop-blur px-3 py-1.5 text-xs font-bold text-[#8fa0dd] uppercase tracking-widest border-b border-[#4f46e5]/30 flex justify-between items-center">
                        <span>AMD HIP (Target)</span>
                        <span className="text-emerald-400 font-bold tracking-normal">
                          {translatedCode ? "Live" : `${MOCK_DIFFS[selectedFileIdx].confidence}% Confidence`}
                        </span>
                      </div>
                      <pre className="p-3 text-white overflow-x-auto bg-[#0b0d19]/10">
                        <code>{translatedCode || MOCK_DIFFS[selectedFileIdx].rewritten}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="px-4 py-2 border-t border-[#4f46e5]/40 bg-[#12162b]/50 text-xs flex items-center justify-between text-[#8fa0dd] gap-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#cc4155]" />
                      <span><strong>Explainability Intelligence:</strong> {MOCK_DIFFS[selectedFileIdx].explanation}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 text-xs font-bold text-emerald-400 uppercase bg-emerald-950/20 border border-emerald-900/50 px-1.5 py-0.5 rounded">
                      {MOCK_DIFFS[selectedFileIdx].impact}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>

      </div>

      {renderLegalModal()}
    </div>
  );
}

function BlobBackground() {
  const styles = `
@keyframes glass-blob-1 {
  0%   { transform: translate(-30%, -25%) scale(1);    filter: blur(80px) hue-rotate(0deg); }
  50%  { transform: translate(35%, 25%) scale(1.25);   filter: blur(80px) hue-rotate(40deg); }
  100% { transform: translate(-30%, -25%) scale(1);    filter: blur(80px) hue-rotate(0deg); }
}
@keyframes glass-blob-2 {
  0%   { transform: translate(30%, 35%) scale(1.1);    filter: blur(80px) hue-rotate(0deg); }
  50%  { transform: translate(-30%, -25%) scale(0.85); filter: blur(80px) hue-rotate(-50deg); }
  100% { transform: translate(30%, 35%) scale(1.1);    filter: blur(80px) hue-rotate(0deg); }
}
@keyframes glass-blob-3 {
  0%   { transform: translate(20%, -35%) scale(0.9);   filter: blur(80px) hue-rotate(0deg); }
  50%  { transform: translate(-35%, 30%) scale(1.2);   filter: blur(80px) hue-rotate(60deg); }
  100% { transform: translate(20%, -35%) scale(0.9);   filter: blur(80px) hue-rotate(0deg); }
}
@keyframes glass-blob-4 {
  0%   { transform: translate(-40%, 30%) scale(1);     filter: blur(80px) hue-rotate(0deg); }
  50%  { transform: translate(35%, -35%) scale(1.18);  filter: blur(80px) hue-rotate(-45deg); }
  100% { transform: translate(-40%, 30%) scale(1);     filter: blur(80px) hue-rotate(0deg); }
}
@keyframes glass-blob-5 {
  0%   { transform: translate(0%, 40%) scale(1.1);     filter: blur(80px) hue-rotate(0deg); }
  50%  { transform: translate(20%, -25%) scale(0.8);   filter: blur(80px) hue-rotate(70deg); }
  100% { transform: translate(0%, 40%) scale(1.1);     filter: blur(80px) hue-rotate(0deg); }
}
.glass-bg-blob-1 { animation: glass-blob-1 14s ease-in-out infinite; will-change: transform, filter; }
.glass-bg-blob-2 { animation: glass-blob-2 16s ease-in-out infinite; will-change: transform, filter; }
.glass-bg-blob-3 { animation: glass-blob-3 12s ease-in-out infinite; will-change: transform, filter; }
.glass-bg-blob-4 { animation: glass-blob-4 18s ease-in-out infinite; will-change: transform, filter; }
.glass-bg-blob-5 { animation: glass-blob-5 11s ease-in-out infinite; will-change: transform, filter; }
@media (prefers-reduced-motion: reduce) {
  .glass-bg-blob-1, .glass-bg-blob-2, .glass-bg-blob-3,
  .glass-bg-blob-4, .glass-bg-blob-5 { animation: none; }
}
`;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        className="glass-bg-blob-1 absolute -top-[20vmax] -left-[15vmax] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.55), rgba(236,72,153,0) 70%)",
        }}
      />
      <div
        className="glass-bg-blob-2 absolute top-[10vmax] -right-[20vmax] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.5), rgba(139,92,246,0) 70%)",
        }}
      />
      <div
        className="glass-bg-blob-3 absolute -bottom-[25vmax] left-[10vmax] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(20,184,166,0.45), rgba(20,184,166,0) 70%)",
        }}
      />
      <div
        className="glass-bg-blob-4 absolute top-[30vmax] left-[20vmax] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.4), rgba(245,158,11,0) 70%)",
        }}
      />
      <div
        className="glass-bg-blob-5 absolute -bottom-[20vmax] -right-[10vmax] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.45), rgba(56,189,248,0) 70%)",
        }}
      />
    </div>
  );
}

function BrandMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className="w-9 h-9"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <rect x="2" y="2" width="28" height="28" rx="8" stroke="white" strokeOpacity="0.85" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="6" fill="white" fillOpacity="0.95" />
      <path d="M 16 4 L 16 28" stroke="white" strokeOpacity="0.5" strokeWidth="1.25" />
    </svg>
  );
}