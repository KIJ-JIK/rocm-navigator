FROM rocm/dev-ubuntu-22.04:6.0

ARG EXPECTED_ROCM_VERSION="6.0"
USER root
ENV DEBIAN_FRONTEND=noninteractive

# Install any minimal runtime dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ==============================================================================
# BUILDTIME SMOKE TEST (Catches broken base images immediately)
# ==============================================================================
WORKDIR /tmp/hip_smoke_test

# Assert hipcc version matches our pinned spec
RUN echo "=== Verifying hipcc Version ===" && \
    hipcc --version && \
    hipcc --version | grep -q "${EXPECTED_ROCM_VERSION}" || \
    (echo "FAIL: hipcc version mismatch! Expected ROCm ${EXPECTED_ROCM_VERSION}" && exit 1)

# Generate a minimal inline HIP smoke test file and compile it
RUN printf '#include <hip/hip_runtime.h>\n#include <iostream>\n__global__ void smoke_kernel() {}\nint main() {\n    std::cout << "Validating HIP compilation pipeline..." << std::endl;\n    smoke_kernel<<<1, 1>>>();\n    hipDeviceSynchronize();\n    return 0;\n}\n' > smoke_test.cpp && \
    hipcc smoke_test.cpp -o smoke_test && \
    rm -rf /tmp/hip_smoke_test

# Set the final execution environment
WORKDIR /workspace
CMD ["/bin/bash"]
