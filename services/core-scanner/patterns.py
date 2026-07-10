"""
CUDA API Pattern Mapping — Maps CUDA APIs to HIP equivalents and categorizes them.

Ported from amd/backend/agents/scanner/patterns.py
"""

# Mapping of CUDA API calls to HIP equivalents
CUDA_TO_HIP_MAPPING = {
    "cudaMalloc": "hipMalloc",
    "cudaMemcpy": "hipMemcpy",
    "cudaFree": "hipFree",
    "cudaMemset": "hipMemset",
    "cudaDeviceSynchronize": "hipDeviceSynchronize",
    "cudaStreamCreate": "hipStreamCreate",
    "cudaStreamDestroy": "hipStreamDestroy",
    "cudaStreamSynchronize": "hipStreamSynchronize",
    "cudaEventCreate": "hipEventCreate",
    "cudaEventDestroy": "hipEventDestroy",
    "cudaEventRecord": "hipEventRecord",
    "cudaEventSynchronize": "hipEventSynchronize",
    "cudaEventElapsedTime": "hipEventElapsedTime",
    "__syncthreads": "__syncthreads",
    "__threadfence": "__threadfence",
    "__shfl_sync": "__shfl_sync",
    "__shfl_up_sync": "__shfl_up_sync",
    "__shfl_down_sync": "__shfl_down_sync",
    "__shfl_xor_sync": "__shfl_xor_sync",
    "__any_sync": "__any_sync",
    "__all_sync": "__all_sync",
    "__ballot_sync": "__ballot_sync",
    "__activemask": "__activemask",
}

# Categories for different types of CUDA constructs
MEMORY_APIS = {"cudaMalloc", "cudaMemcpy", "cudaFree", "cudaMemset"}
SYNC_APIS = {"cudaDeviceSynchronize", "cudaStreamSynchronize", "cudaEventSynchronize", "__syncthreads", "__threadfence"}
STREAM_APIS = {"cudaStreamCreate", "cudaStreamDestroy", "cudaEventCreate", "cudaEventDestroy", "cudaEventRecord"}
WARP_PRIMITIVES = {"__shfl_sync", "__shfl_up_sync", "__shfl_down_sync", "__shfl_xor_sync", "__any_sync", "__all_sync", "__ballot_sync", "__activemask"}

def get_api_subtype(api_name: str) -> str:
    if api_name in MEMORY_APIS:
        return "memory_operation"
    elif api_name in SYNC_APIS:
        return "synchronization"
    elif api_name in STREAM_APIS:
        return "stream_operation"
    elif api_name in WARP_PRIMITIVES:
        return "warp_primitive"
    return "other"
