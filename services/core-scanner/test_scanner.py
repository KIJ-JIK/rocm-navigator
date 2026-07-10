import unittest
from parser import CudaParser
from analyzer import ArchitectureAnalyzer

class TestScannerAndAnalyzer(unittest.TestCase):
    
    def test_cuda_parser_kernel_and_mem_calls(self):
        sample_code = """
        __global__ void vectorAdd(float *A, int N) {
            int i = blockDim.x * blockIdx.x + threadIdx.x;
            if (i < N) {
                __syncthreads();
            }
        }
        
        int main() {
            float *d_A;
            cudaMalloc((void**)&d_A, 100 * sizeof(float));
            vectorAdd<<<4, 256>>>(d_A, 100);
            cudaDeviceSynchronize();
            cudaFree(d_A);
        }
        """
        
        results = CudaParser.parse_code_string(sample_code, "test_file.cu")
        
        # Verify line parses
        self.assertEqual(len(results["kernels"]), 1)
        self.assertEqual(results["kernels"][0]["name"], "vectorAdd")
        
        self.assertEqual(len(results["launches"]), 1)
        self.assertEqual(results["launches"][0]["kernel_name"], "vectorAdd")
        self.assertEqual(results["launches"][0]["config"], ["4", "256"])
        
        # Verify allocations caught
        self.assertTrue(any(call["api"] == "cudaMalloc" for call in results["memory_calls"]))
        self.assertTrue(any(call["api"] == "cudaFree" for call in results["memory_calls"]))
        
        # Verify synchronization barrier caught
        self.assertTrue(any(barrier["barrier"] == "__syncthreads" for barrier in results["barriers"]))

    def test_analyzer_scoring(self):
        # 1. Normal file (Clean)
        file_a = {
            "file": "file_a.cu",
            "lines_count": 50,
            "kernels": [{"name": "add"}],
            "launches": [{"kernel_name": "add"}],
            "memory_calls": [{"api": "cudaMalloc"}],
            "barriers": [{"barrier": "__syncthreads"}],
            "warp_votes": []
        }
        
        res_a = ArchitectureAnalyzer.analyze_repository_tokens([file_a])
        self.assertEqual(res_a["health_score"], 100)
        self.assertEqual(res_a["deadlocks_detected"], False)
        
        # 2. Risky file (Warp votes and race conditions)
        file_b = {
            "file": "file_b.cu",
            "lines_count": 80,
            "kernels": [{"name": "multiply"}, {"name": "reduce"}],
            "launches": [{"kernel_name": "multiply"}, {"kernel_name": "reduce"}],
            "memory_calls": [{"api": "cudaMalloc"}],
            "barriers": [],  # Multi launches without sync triggers deadlock warning
            "warp_votes": [{"intrinsic": "__ballot_sync"}]
        }
        
        res_b = ArchitectureAnalyzer.analyze_repository_tokens([file_b])
        # Health score must be deducted due to warp votes (-8) and missing barriers (-15)
        self.assertLess(res_b["health_score"], 100)
        self.assertEqual(res_b["deadlocks_detected"], True)
        self.assertIn("multiply", res_b["call_topology"])

if __name__ == "__main__":
    unittest.main()
