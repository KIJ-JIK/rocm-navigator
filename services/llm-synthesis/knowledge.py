import math
import re
from typing import Dict, Any, List

class SimpleVectorSearch:
    """
    A lightweight, pure-Python semantic string matcher (RAG mock) to search
    ROCm mapping guidelines and documentation without binary database requirements.
    """
    
    def __init__(self):
        # Database of ROCm and HIP translation guidelines
        self.documents = [
            {
                "topic": "cudaMalloc",
                "content": "Use hipMalloc(void** ptr, size_t size) to allocate device memory on AMD hardware. Equivalent to cudaMalloc.",
                "example": "cudaMalloc(&d_A, size) -> hipMalloc(&d_A, size)"
            },
            {
                "topic": "cudaMemcpy",
                "content": "Use hipMemcpy(void* dst, const void* src, size_t count, hipMemcpyKind kind) to copy memory between host and device.",
                "example": "cudaMemcpy(dst, src, count, cudaMemcpyHostToDevice) -> hipMemcpy(dst, src, count, hipMemcpyHostToDevice)"
            },
            {
                "topic": "cudaFree",
                "content": "Use hipFree(void* ptr) to deallocate device memory. Equivalent to cudaFree.",
                "example": "cudaFree(d_A) -> hipFree(d_A)"
            },
            {
                "topic": "kernel launch",
                "content": "Use the hipLaunchKernelGGL macro to launch device kernels on AMD. The syntax is: hipLaunchKernelGGL(kernel_name, gridDim, blockDim, sharedMemBytes, stream, args...).",
                "example": "kernel<<<grid, block>>>(d_A) -> hipLaunchKernelGGL(kernel, grid, block, 0, 0, d_A)"
            },
            {
                "topic": "warp sync voting ballot",
                "content": "AMD CDNA uses 64-thread wavefronts. cuda sync primitives like __ballot_sync(mask, predicate) must be mapped to __ballot(predicate) or __ballot_sync must be emulated.",
                "example": "__ballot_sync(0xffffffff, threadIdx.x < 16) -> __ballot(hipThreadIdx_x < 16)"
            },
            {
                "topic": "shared memory dynamic",
                "content": "CUDA extern __shared__ variables must be replaced with the HIP_DYNAMIC_SHARED(type, var) macro in HIP.",
                "example": "extern __shared__ float s[] -> HIP_DYNAMIC_SHARED(float, s)"
            },
            {
                "topic": "thread intrinsics",
                "content": "CUDA thread indexing variables (threadIdx, blockIdx, blockDim, gridDim) map directly to HIP equivalents (hipThreadIdx_x, hipBlockIdx_x, hipBlockDim_x, hipGridDim_x).",
                "example": "threadIdx.x -> hipThreadIdx_x"
            }
        ]

    def _get_overlap_score(self, query: str, doc_text: str) -> float:
        """Simple word-overlap calculation to simulate cosine similarity."""
        query_words = set(re.findall(r"\w+", query.lower()))
        doc_words = set(re.findall(r"\w+", doc_text.lower()))
        if not query_words:
            return 0.0
        intersection = query_words.intersection(doc_words)
        return len(intersection) / math.sqrt(len(query_words) * len(doc_words))

    def query_docs(self, query: str, limit: int = 2) -> List[Dict[str, Any]]:
        # import re locally to prevent top-level pollution
        import re
        
        scored_docs = []
        for doc in self.documents:
            # Score against topic and content
            score_topic = self._get_overlap_score(query, doc["topic"]) * 2.0
            score_content = self._get_overlap_score(query, doc["content"])
            final_score = max(score_topic, score_content)
            
            if final_score > 0.0:
                scored_docs.append((final_score, doc))
                
        # Sort descending by score
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [doc[1] for doc in scored_docs[:limit]]
