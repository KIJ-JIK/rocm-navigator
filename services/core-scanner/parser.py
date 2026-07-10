import re
import os
from typing import Dict, Any, List

class CudaParser:
    """
    A robust regex-based syntax parser to identify CUDA allocations,
    launches, synchronization barriers, and thread metrics in source files.
    """
    
    # regex patterns
    KERNEL_DECL = re.compile(r"__global__\s+void\s+(\w+)\s*\(([^)]*)\)")
    KERNEL_LAUNCH = re.compile(r"(\w+)\s*<<<\s*([^>]+)\s*>>>\s*\(([^)]*)\)")
    CUDA_MEM_API = re.compile(r"\b(cudaMalloc|cudaMemcpy|cudaFree|cudaMallocManaged|cudaMemset)\b")
    CUDA_BARRIER = re.compile(r"\b(__syncthreads|__threadfence|__threadfence_block)\b")
    CUDA_INTRINSICS = re.compile(r"\b(threadIdx|blockIdx|blockDim|gridDim)\b\.[xyz]")
    WARP_VOTE = re.compile(r"\b(__ballot_sync|__any_sync|__all_sync|__shfl_sync|__shfl_down_sync)\b")

    @classmethod
    def parse_code_string(cls, code: str, filepath: str = "raw_buffer.cu") -> Dict[str, Any]:
        lines = code.splitlines()
        kernels = []
        launches = []
        memory_calls = []
        barriers = []
        intrinsics = []
        warp_votes = []
        
        for idx, line in enumerate(lines, 1):
            # Clean comments before matching
            clean_line = re.sub(r"//.*$|/\*.*?\*/", "", line)
            
            # 1. Kernel Declarations
            for match in cls.KERNEL_DECL.finditer(clean_line):
                kernels.append({
                    "name": match.group(1),
                    "line": idx,
                    "args": [arg.strip() for arg in match.group(2).split(",") if arg.strip()],
                    "raw": match.group(0)
                })
                
            # 2. Kernel Launches
            for match in cls.KERNEL_LAUNCH.finditer(clean_line):
                launches.append({
                    "kernel_name": match.group(1),
                    "line": idx,
                    "config": [c.strip() for c in match.group(2).split(",") if c.strip()],
                    "args": [a.strip() for a in match.group(3).split(",") if a.strip()],
                    "raw": match.group(0)
                })
                
            # 3. Memory API Calls
            for match in cls.CUDA_MEM_API.finditer(clean_line):
                memory_calls.append({
                    "api": match.group(1),
                    "line": idx,
                    "raw": line.strip()
                })
                
            # 4. Barriers
            for match in cls.CUDA_BARRIER.finditer(clean_line):
                barriers.append({
                    "barrier": match.group(1),
                    "line": idx,
                    "raw": line.strip()
                })

            # 5. Thread Intrinsics
            for match in cls.CUDA_INTRINSICS.finditer(clean_line):
                intrinsics.append({
                    "intrinsic": match.group(0),
                    "line": idx,
                    "raw": line.strip()
                })

            # 6. Warp Sync Voting
            for match in cls.WARP_VOTE.finditer(clean_line):
                warp_votes.append({
                    "intrinsic": match.group(1),
                    "line": idx,
                    "raw": line.strip()
                })

        return {
            "file": filepath,
            "lines_count": len(lines),
            "kernels": kernels,
            "launches": launches,
            "memory_calls": memory_calls,
            "barriers": barriers,
            "intrinsics": intrinsics,
            "warp_votes": warp_votes
        }

    @classmethod
    def parse_directory(cls, dir_path: str) -> List[Dict[str, Any]]:
        results = []
        valid_extensions = {".cu", ".cuh", ".cpp", ".h", ".hpp"}
        
        if not os.path.exists(dir_path):
            return results
            
        for root, _, files in os.walk(dir_path):
            for file in files:
                _, ext = os.path.splitext(file)
                if ext.lower() in valid_extensions:
                    full_path = os.path.join(root, file)
                    try:
                        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                            content = f.read()
                        relative_path = os.path.relpath(full_path, dir_path)
                        results.append(cls.parse_code_string(content, relative_path))
                    except Exception as e:
                        # Log error silently and skip
                        pass
        return results
