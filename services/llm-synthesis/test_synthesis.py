import unittest
from knowledge import SimpleVectorSearch
from rewrite import CodeRewriter

class TestSynthesisAndRAG(unittest.TestCase):
    
    def setUp(self):
        self.vector_db = SimpleVectorSearch()
        self.rewriter = CodeRewriter()

    def test_vector_search_matching(self):
        # Query matching standard api
        results = self.vector_db.query_docs("cudaMalloc", limit=1)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["topic"], "cudaMalloc")
        
        # Query matching warp vote sync
        results_warp = self.vector_db.query_docs("warp sync __ballot_sync", limit=1)
        self.assertEqual(len(results_warp), 1)
        self.assertEqual(results_warp[0]["topic"], "warp sync voting ballot")

    def test_regex_translation_fallback(self):
        sample_cuda = """
        __global__ void myKernel(float *d_out) {
            int tid = threadIdx.x;
            d_out[tid] = tid * 2.0f;
        }
        
        int main() {
            float *d_data;
            cudaMalloc(&d_data, 64 * sizeof(float));
            myKernel<<<1, 64>>>(d_data);
            cudaFree(d_data);
        }
        """
        
        translated = self.rewriter._perform_fallback_regex_translation(sample_cuda)
        
        # Check API mapping Swaps
        self.assertIn("hipMalloc", translated)
        self.assertIn("hipFree", translated)
        self.assertIn("hipThreadIdx_x", translated)
        self.assertIn("hipLaunchKernelGGL", translated)
        self.assertNotIn("cudaMalloc", translated)
        self.assertNotIn("<<<", translated)

if __name__ == "__main__":
    unittest.main()
