"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Files, 
  Search, 
  GitBranch, 
  Play, 
  Terminal, 
  Code, 
  Settings, 
  Cpu, 
  CheckCircle,
  HelpCircle,
  Flame,
  FileCode,
  Layout,
  RefreshCw
} from "lucide-react";

export default function VsCodeExtensionPage() {
  const [selectedFile, setSelectedFile] = useState("vectorAdd.cu");
  const [migrated, setMigrated] = useState(false);
  const [running, setRunning] = useState(false);

  const handleMigrate = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setMigrated(true);
    }, 2000);
  };

  return (
    <div className="h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] font-sans flex flex-col overflow-hidden select-none">
      
      {/* Title bar */}
      <header className="h-8 bg-[#3c3c3c] border-b border-[#2b2b2b] flex items-center justify-between px-3 text-[11px] text-[#a6a6a6] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Exit VS Code</span>
          </Link>
          <span>/</span>
          <span>ROCm Navigator Extension Simulator</span>
        </div>
        <div className="font-medium">math_kernel.cu - Visual Studio Code</div>
        <div className="w-12"></div>
      </header>

      {/* Main Workspace split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* VS Code Left Activity Bar */}
        <aside className="w-12 bg-[#333333] border-r border-[#2b2b2b] flex flex-col justify-between items-center py-2 flex-shrink-0">
          <div className="flex flex-col gap-4 text-[#858585]">
            <button className="text-white hover:text-white">
              <Files className="h-5 w-5" />
            </button>
            <button className="hover:text-white">
              <Search className="h-5 w-5" />
            </button>
            <button className="hover:text-white">
              <GitBranch className="h-5 w-5" />
            </button>
            <button className="text-[#ff6d5a] hover:text-[#ff8575] relative">
              <Flame className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#ff6d5a] animate-ping"></span>
            </button>
          </div>
          <div className="text-[#858585]">
            <Settings className="h-5 w-5 hover:text-white cursor-pointer" />
          </div>
        </aside>

        {/* Sidebar panel */}
        <aside className="w-60 bg-[#252526] border-r border-[#1e1e1e] flex flex-col overflow-hidden flex-shrink-0 text-left">
          <div className="p-2 border-b border-[#1e1e1e] text-[10px] font-bold uppercase tracking-wider text-[#808080]">
            ROCm Navigator
          </div>
          
          {/* Extension Panel UI */}
          <div className="flex-1 p-3 space-y-4 overflow-y-auto">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[#808080] uppercase tracking-wide">Workspace Status</span>
              <div className="p-2 rounded bg-[#1e1e1e] border border-[#2b2b2b] space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span>Environment:</span>
                  <span className="text-[#ff6d5a] font-bold uppercase text-[9px] bg-[#ff6d5a]/10 border border-[#ff6d5a]/20 px-1 rounded">MI300X SDK</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span>Target SDK:</span>
                  <span>ROCm 6.1.2</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-bold text-[#808080] uppercase tracking-wide">Migration Controls</span>
              
              <button 
                onClick={handleMigrate}
                disabled={running}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#ff6d5a] hover:bg-[#ff8575] text-white text-xs font-bold rounded transition-all disabled:bg-zinc-800 disabled:text-zinc-600"
              >
                {running ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-white" />
                    <span>Port file to ROCm</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1 border-t border-[#2b2b2b] pt-3">
              <span className="text-[9px] font-bold text-[#808080] uppercase tracking-wide">Files List</span>
              <div className="space-y-1">
                {["vectorAdd.cu", "shared_reduction.cu"].map((file) => (
                  <button 
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2 py-1 rounded text-[10px] flex items-center gap-2 ${file === selectedFile ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e] text-[#858585]"}`}
                  >
                    <FileCode className="h-3.5 w-3.5 text-blue-400" />
                    <span>{file}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Code Editor Panel */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e] text-left">
          <div className="h-9 bg-[#2d2d2d] flex items-center px-4 border-b border-[#252526] text-[11px] text-[#a6a6a6] flex-shrink-0">
            <span className="text-white border-b-2 border-[#ff6d5a] pb-1 px-2 font-medium">{selectedFile}</span>
          </div>

          <div className="flex-1 grid grid-cols-2 overflow-hidden font-mono text-[10px] leading-normal p-4 gap-4">
            
            {/* Original CUDA Code */}
            <div className="flex flex-col border border-[#2b2b2b] rounded overflow-hidden">
              <div className="bg-[#252526] px-3 py-1 border-b border-[#2b2b2b] text-[9px] text-[#808080] uppercase tracking-wider font-bold">
                CUDA (Original)
              </div>
              <pre className="p-3 overflow-auto text-[#858585] flex-1">
                <code>
                  {selectedFile === "vectorAdd.cu" 
                    ? `__global__ void vectorAdd(float *A, float *B, float *C, int N) {
    int i = blockDim.x * blockIdx.x + threadIdx.x;
    if (i < N) {
        C[i] = A[i] + B[i];
    }
}`
                    : `__global__ void sharedReduce(float *d_out, float *d_in) {
    extern __shared__ float sdata[];
    int tid = threadIdx.x;
    sdata[tid] = d_in[tid];
    __syncthreads();
}`}
                </code>
              </pre>
            </div>

            {/* Translated HIP Code */}
            <div className="flex flex-col border border-[#2b2b2b] rounded overflow-hidden">
              <div className="bg-[#252526] px-3 py-1 border-b border-[#2b2b2b] text-[9px] text-[#808080] uppercase tracking-wider font-bold flex justify-between items-center">
                <span>HIP (ROCm Target)</span>
                {migrated && <span className="text-emerald-400 font-bold uppercase text-[8px] bg-emerald-950/20 px-1 rounded">100% PARITY</span>}
              </div>
              <pre className="p-3 overflow-auto flex-1">
                <code>
                  {migrated 
                    ? (selectedFile === "vectorAdd.cu" 
                      ? `#include <hip/hip_runtime.h>

__global__ void vectorAdd(float *A, float *B, float *C, int N) {
    int i = hipBlockDim_x * hipBlockIdx_x + hipThreadIdx_x;
    if (i < N) {
        C[i] = A[i] + B[i];
    }
}`
                      : `#include <hip/hip_runtime.h>

__global__ void sharedReduce(float *d_out, float *d_in) {
    HIP_DYNAMIC_SHARED(float, sdata)
    int tid = hipThreadIdx_x;
    sdata[tid] = d_in[tid];
    __syncthreads();
}`)
                    : `// Click "Port file to ROCm" to run translation...`}
                </code>
              </pre>
            </div>

          </div>

          {/* Extension console output */}
          <footer className="h-40 border-t border-[#252526] bg-[#1e1e1e] flex flex-col overflow-hidden flex-shrink-0">
            <div className="h-7 bg-[#252526] px-4 flex items-center text-[10px] text-[#808080] font-bold uppercase tracking-wider border-b border-[#1e1e1e] flex-shrink-0">
              Output Terminal
            </div>
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[9px] text-[#858585] space-y-1">
              {running && <div className="text-blue-400 animate-pulse">[ROCm Navigator] Ingesting syntax tree and running Gemma compiler validations...</div>}
              {migrated && (
                <>
                  <div className="text-emerald-400">[ROCm Navigator] Compile: Success. Mapped 3 CUDA dimension tokens.</div>
                  <div className="text-[#a6a6a6]">[ROCm Navigator] Saved converted files to target directories.</div>
                </>
              )}
              {!running && !migrated && <div className="italic text-zinc-700">VS Code terminal console ready.</div>}
            </div>
          </footer>
        </main>
      </div>

      {/* VS Code Status bar */}
      <footer className="h-5 bg-[#007acc] text-white flex items-center justify-between px-3 text-[10px] flex-shrink-0">
        <div className="flex items-center gap-3">
          <span>Master</span>
          <span>●</span>
          <span>ROCm Navigator: Connected</span>
        </div>
        <div>
          <span>UTF-8</span>
        </div>
      </footer>
    </div>
  );
}
