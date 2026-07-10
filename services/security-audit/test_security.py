import unittest
from security import SecurityAuditor
from reporter import AuditReporter

class TestSecurityAndReporting(unittest.TestCase):

    def test_unchecked_malloc_vulnerability(self):
        sample_code = """
        int main() {
            float *d_A;
            hipMalloc(&d_A, 100); // Unchecked allocation
        }
        """
        res = SecurityAuditor.audit_source_code(sample_code, "test_file.cu")
        self.assertLess(res["security_score"], 100)
        self.assertTrue(any(v["type"] == "UncheckedMemoryAllocation" for v in res["vulnerabilities"]))

    def test_out_of_bounds_indexing_vulnerability(self):
        sample_code = """
        __global__ void myKernel(float *d_out) {
            int tid = hipThreadIdx_x;
            d_out[tid] = 1.0f; // indexed directly without bounds checks
        }
        """
        res = SecurityAuditor.audit_source_code(sample_code, "test_file.cu")
        self.assertLess(res["security_score"], 100)
        self.assertTrue(any(v["type"] == "OutofBoundsArrayAccess" for v in res["vulnerabilities"]))

    def test_secret_leaks(self):
        sample_code = """
        const char* key = "api-key = 'abc123xyz789QWERTY'";
        """
        res = SecurityAuditor.audit_source_code(sample_code, "test_file.cu")
        self.assertLess(res["security_score"], 100)
        self.assertEqual(len(res["secrets"]), 1)

    def test_report_generation(self):
        scanner = {"summary_stats": {"total_lines": 100, "total_kernels": 1, "total_memory_calls": 2, "total_warp_votes": 0}}
        compile_status = {"compilation_success": True, "compiler": "hipcc (Simulated)"}
        profile = {"profiler": "rocprof (Simulated)", "wavefront_occupancy_percent": 96.0, "execution_time_seconds": 0.0035, "memory_bandwidth_gb_sec": 940.0, "efficiency_score": 1.3}
        security = {"security_score": 88, "clean_audit": False, "vulnerabilities": [{"severity": "MEDIUM", "line": 5, "description": "hipMalloc unchecked", "raw": "hipMalloc(&A)"}]}
        
        md_report = AuditReporter.generate_markdown_report(
            "https://github.com/my/repo",
            scanner,
            compile_status,
            profile,
            security
        )
        
        self.assertIn("Migration Audit Report", md_report)
        self.assertIn("hipMalloc unchecked", md_report)
        self.assertIn("96.0%", md_report)

if __name__ == "__main__":
    unittest.main()
