import unittest
from validation import DockerValidator
from profiling import HardwareProfiler

class TestSandboxRuntime(unittest.TestCase):

    def setUp(self):
        self.validator = DockerValidator()
        self.profiler = HardwareProfiler()

    def test_static_compilation_success(self):
        clean_code = """
        #include <hip/hip_runtime.h>
        int main() {
            float *d_A;
            hipMalloc(&d_A, 100);
            hipFree(d_A);
        }
        """
        # Static validation check (no docker fallback)
        res = self.validator._perform_static_simulation_compile(clean_code)
        self.assertEqual(res["compilation_success"], True)
        self.assertEqual(res["compilation_error_logs"], "")

    def test_static_compilation_failure_on_leftover_cuda(self):
        broken_code = """
        #include <hip/hip_runtime.h>
        int main() {
            float *d_A;
            cudaMalloc(&d_A, 100); // leftover cuda malloc
            hipFree(d_A);
        }
        """
        res = self.validator._perform_static_simulation_compile(broken_code)
        self.assertEqual(res["compilation_success"], False)
        self.assertIn("error", res["compilation_error_logs"])

    def test_static_compilation_failure_on_triple_brackets(self):
        broken_code = """
        int main() {
            myKernel<<<4, 256>>>(); // leftover CUDA kernel launch config
        }
        """
        res = self.validator._perform_static_simulation_compile(broken_code)
        self.assertEqual(res["compilation_success"], False)
        self.assertIn("error", res["compilation_error_logs"])

    def test_profiler_performance_tuning(self):
        # Unoptimized code (uses ballot sync)
        unoptimized_code = "int mask = __ballot_sync(0xff, val);"
        metrics_unopt = self.profiler._calculate_simulated_metrics(unoptimized_code)
        self.assertEqual(metrics_unopt["wavefront_occupancy_percent"], 82.0)
        self.assertEqual(metrics_unopt["efficiency_score"], 1.0)
        
        # Optimized code (swaps to AMD ballot)
        optimized_code = "int mask = __ballot(val);"
        metrics_opt = self.profiler._calculate_simulated_metrics(optimized_code)
        self.assertEqual(metrics_opt["wavefront_occupancy_percent"], 96.0)
        self.assertGreater(metrics_opt["efficiency_score"], 1.1)

if __name__ == "__main__":
    unittest.main()
