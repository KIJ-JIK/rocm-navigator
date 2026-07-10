import os
import re
import urllib.request
import json
from typing import Dict, Any, List
from prompts import SYSTEM_PROMPT_REWRITE, SYSTEM_PROMPT_RETRY

class CodeRewriter:
    """
    Combines input CUDA source with RAG context to compile equivalent HIP code.
    Supports live Fireworks Gemma API completions with mock translation fallbacks.
    """

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("FIREWORKS_API_KEY")

    def _perform_fallback_regex_translation(self, cuda_code: str) -> str:
        """Regex-based high-fidelity translation when LLM keys are not supplied."""
        translated = cuda_code
        
        # 1. API Swaps
        translated = translated.replace("cudaMalloc", "hipMalloc")
        translated = translated.replace("cudaMemcpy", "hipMemcpy")
        translated = translated.replace("cudaFree", "hipFree")
        translated = translated.replace("cudaDeviceSynchronize", "hipDeviceSynchronize")
        translated = translated.replace("cudaMemcpyHostToDevice", "hipMemcpyHostToDevice")
        translated = translated.replace("cudaMemcpyDeviceToHost", "hipMemcpyDeviceToHost")
        
        # 2. Thread dimensions
        translated = translated.replace("threadIdx.x", "hipThreadIdx_x")
        translated = translated.replace("threadIdx.y", "hipThreadIdx_y")
        translated = translated.replace("threadIdx.z", "hipThreadIdx_z")
        translated = translated.replace("blockIdx.x", "hipBlockIdx_x")
        translated = translated.replace("blockIdx.y", "hipBlockIdx_y")
        translated = translated.replace("blockIdx.z", "hipBlockIdx_z")
        translated = translated.replace("blockDim.x", "hipBlockDim_x")
        translated = translated.replace("blockDim.y", "hipBlockDim_y")
        translated = translated.replace("blockDim.z", "hipBlockDim_z")
        translated = translated.replace("gridDim.x", "hipGridDim_x")
        translated = translated.replace("gridDim.y", "hipGridDim_y")
        translated = translated.replace("gridDim.z", "hipGridDim_z")

        # 3. Dynamic Shared Memory
        translated = re.sub(
            r"extern\s+__shared__\s+(\w+)\s+(\w+)\[\s*\]\s*;",
            r"HIP_DYNAMIC_SHARED(\1, \2)",
            translated
        )

        # 4. Kernel Launches: kernel<<<g, b>>>(args) -> hipLaunchKernelGGL(kernel, g, b, 0, 0, args)
        translated = re.sub(
            r"(\w+)\s*<<<\s*([^>]+)\s*>>>\s*\(([^)]*)\)",
            r"hipLaunchKernelGGL(\1, \2, 0, 0, \3)",
            translated
        )
        
        return translated

    def translate_cuda_to_hip(self, cuda_code: str, rag_context: List[Dict[str, Any]], topology: Dict[str, Any] = None) -> str:
        if not self.api_key:
            return self._perform_fallback_regex_translation(cuda_code)

        # Build topology-aware hints from Architecture Agent output
        topology_hints = ""
        if topology:
            warnings = topology.get("warnings", [])
            difficulty = topology.get("difficulty_score", 0)
            deadlocks = topology.get("deadlocks_detected", False)
            warp_votes = topology.get("summary_stats", {}).get("total_warp_votes", 0)

            hints = []
            if warp_votes > 0:
                hints.append(
                    f"This code uses {warp_votes} NVIDIA 32-thread warp vote instruction(s) "
                    "(__ballot_sync, __any_sync, __all_sync). Convert these to AMD 64-thread "
                    "wavefront equivalents (__ballot, __any, __all) for CDNA architecture."
                )
            if deadlocks:
                hints.append(
                    "Multiple kernels launch without explicit stream synchronization. "
                    "Insert hipStreamSynchronize(0) calls between dependent kernel launches."
                )
            if difficulty > 60:
                hints.append(
                    f"Migration difficulty is rated {difficulty}% — apply extra care to "
                    "shared memory patterns, barrier placement and memory API mappings."
                )
            for w in warnings:
                hints.append(w)

            if hints:
                topology_hints = "\n4. TOPOLOGY WARNINGS FROM STATIC ANALYSIS:\n" + \
                    "\n".join(f"   - {h}" for h in hints)

        # Structure the model prompt
        context_str = "\n".join([f"Topic: {doc['topic']}\nInfo: {doc['content']}\nExample: {doc['example']}" for doc in rag_context])

        system_prompt = SYSTEM_PROMPT_REWRITE + topology_hints

        user_prompt = f"RAG CONTEXT:\n{context_str}\n\nCUDA CODE TO TRANSLATE:\n{cuda_code}"

        # Fireworks API request
        url = "https://api.fireworks.ai/inference/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "accounts/fireworks/models/gemma2-9b-it",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 2048
        }

        try:
            req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
            with urllib.request.urlopen(req, timeout=15) as response:
                res_data = json.loads(response.read().decode("utf-8"))
            completed_text = res_data["choices"][0]["message"]["content"]
            # Clean up potential markdown formatting if returned
            completed_text = re.sub(r"^```(cpp|cuda|hip)?\n|```$", "", completed_text, flags=re.MULTILINE)
            return completed_text.strip()
        except Exception as e:
            # Fall back to regex translation if API fails
            return self._perform_fallback_regex_translation(cuda_code)

    def self_heal_code(self, broken_code: str, compilation_error_logs: str) -> str:
        """Prompts Gemma to fix compile syntax errors."""
        if not self.api_key:
            # Simple fallback: return code unchanged if no API key is set
            return broken_code

        system_prompt = SYSTEM_PROMPT_RETRY

        user_prompt = f"COMPILATION ERROR LOGS:\n{compilation_error_logs}\n\nBROKEN HIP CODE:\n{broken_code}"

        url = "https://api.fireworks.ai/inference/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "accounts/fireworks/models/gemma2-9b-it",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 2048
        }

        try:
            req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
            with urllib.request.urlopen(req, timeout=15) as response:
                res_data = json.loads(response.read().decode("utf-8"))
            completed_text = res_data["choices"][0]["message"]["content"]
            completed_text = re.sub(r"^```(cpp|cuda|hip)?\n|```$", "", completed_text, flags=re.MULTILINE)
            return completed_text.strip()
        except Exception:
            return broken_code
