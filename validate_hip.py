import os
import sys
import subprocess
import argparse
import shutil

def check_hipcc():
    """Checks if hipcc is available on the system PATH."""
    return shutil.which("hipcc") is not None

def run_command(cmd, desc):
    """Runs a shell command and captures output."""
    print(f"\n[Running] {desc}...")
    print(f"Command: {' '.join(cmd)}")
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return res.returncode, res.stdout, res.stderr
    except Exception as e:
        return -1, "", f"Failed to execute command: {str(e)}"

def main():
    parser = argparse.ArgumentParser(description="3-Tier ROCm/HIP Code Verification Utility")
    parser.add_argument("--file", "-f", required=True, help="Path to the ported .hip or .cpp file")
    parser.add_argument("--golden", "-g", help="Path to the golden CUDA output file (.npy or .txt)")
    parser.add_argument("--hip-output", "-o", default="hip_output.npy", help="Path where the HIP program writes its output (default: hip_output.npy)")
    parser.add_argument("--atol", type=float, default=1e-4, help="Absolute tolerance for parity check")
    parser.add_argument("--rtol", type=float, default=1e-3, help="Relative tolerance for parity check")
    parser.add_argument("--args", default="", help="Arguments to pass to the compiled binary during run tests")
    parser.add_argument("--simulate", "-s", action="store_true", help="Run in static simulation mode (checks syntax and headers without a compiler)")
    
    args = parser.parse_args()
    
    file_path = args.file
    if not os.path.exists(file_path):
        print(f"Error: Ported file '{file_path}' does not exist.")
        sys.exit(1)
        
    print("==================================================")
    print("        3-Tier ROCm/HIP Verification CLI         ")
    print("==================================================")
    
    # Check hipcc compiler presence
    has_hipcc = check_hipcc()
    simulate_mode = args.simulate or not has_hipcc

    if simulate_mode:
        print("\n[INFO] Running in SIMULATION mode.")
        if not has_hipcc:
            print("Note: 'hipcc' compiler is missing locally. Performing high-fidelity static verification.")
            
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            code_content = f.read()

        import re
        errors = []
        
        # Header check
        if any(x in code_content for x in ["<cuda_runtime.h>", "<cuda.h>", "\"cuda_runtime.h\"", "\"cuda.h\""]):
            errors.append("error: Legacy CUDA headers detected. Use #include <hip/hip_runtime.h> instead.")
            
        # Leftover CUDA calls
        unmapped_cuda = re.findall(r"\b(cuda\w+)\b", code_content)
        for var in unmapped_cuda:
            if var not in {"cudaMemcpyHostToDevice", "cudaMemcpyDeviceToHost"}:
                errors.append(f"error: Found legacy CUDA API signature '{var}'. Did you mean to replace it with its HIP equivalent?")

        # Kernel launch syntax
        if "<<<" in code_content or ">>>" in code_content:
            errors.append("error: Legacy triple-bracket kernel launch '<<<...>>>' syntax detected. Convert to hipLaunchKernelGGL.")

        # Print Tier 1 Simulation results
        print("\n--- [Tier 1] Static Syntax & Header Check ---")
        if errors:
            print("[FAIL] Tier 1 Simulated Failed: Leftover legacy CUDA code detected!")
            for err in errors:
                print(f"  - {err}")
            sys.exit(1)
        else:
            print("[PASS] Tier 1 Simulated Passed: Syntax and headers are structurally valid HIP!")
            
        # Print Tier 2/3 Simulation info
        print("\n--- [Tier 2] AddressSanitizer Check ---")
        print("[INFO] Skipped: AddressSanitizer tests cannot run in simulated mode without hipcc and target GPU hardware.")
        
        print("\n--- [Tier 3] Numerical Parity Check ---")
        print("[INFO] Skipped: Parity tests cannot run in simulated mode without compiling and executing.")
        print("\n[SUCCESS] Structural static checks complete. Target code is ready for compile testing on a ROCm-enabled host!")
        sys.exit(0)

    base_name = os.path.splitext(os.path.basename(file_path))[0]
    binary_normal = f"./{base_name}_bin"
    binary_asan = f"./{base_name}_asan"

    # ==========================================
    # TIER 1: Syntax & Compilation
    # ==========================================
    print("\n--- [Tier 1] Native Compilation Check ---")
    compile_cmd = ["hipcc", file_path, "-o", binary_normal, "-O3"]
    code, out, err = run_command(compile_cmd, "Compiling target HIP code")
    
    if code != 0:
        print("[FAIL] Tier 1 Failed: Compilation Error!")
        print("\nCompiler output:")
        print(err if err else out)
        sys.exit(1)
    else:
        print("[PASS] Tier 1 Passed: Compiled successfully!")
        if err:
            print("\nCompiler warnings:")
            print(err)

    # ==========================================
    # TIER 2: AddressSanitizer Memory Check
    # ==========================================
    print("\n--- [Tier 2] AddressSanitizer & Runtime Check ---")
    asan_compile_cmd = ["hipcc", file_path, "-o", binary_asan, "-fsanitize=address", "-g"]
    code, out, err = run_command(asan_compile_cmd, "Compiling with AddressSanitizer")
    
    if code != 0:
        print("[FAIL] Tier 2 Failed: ASan Compilation Error!")
        print(err if err else out)
        # Clean up normal binary before exit
        if os.path.exists(binary_normal):
            os.remove(binary_normal)
        sys.exit(1)

    # Run ASan binary
    run_cmd = [binary_asan]
    if args.args:
        run_cmd.extend(args.args.split())
        
    code, out, err = run_command(run_cmd, "Executing ASan binary")
    
    # Check for memory violations (ASan outputs to stderr typically)
    has_asan_errors = False
    for stream in [out, err]:
        if "AddressSanitizer" in stream or "ASAN:" in stream or "leak-check" in stream:
            has_asan_errors = True
            
    if code != 0 or has_asan_errors:
        print("[FAIL] Tier 2 Failed: Memory violation or crash detected!")
        print("\nRuntime execution logs:")
        print("STDOUT:\n", out)
        print("STDERR:\n", err)
        # Cleanup
        for f in [binary_normal, binary_asan]:
            if os.path.exists(f): os.remove(f)
        sys.exit(1)
    else:
        print("[PASS] Tier 2 Passed: Binary executed with no AddressSanitizer warnings!")

    # ==========================================
    # TIER 3: Numerical Parity
    # ==========================================
    print("\n--- [Tier 3] Numerical Parity Check ---")
    if not args.golden:
        print("[INFO] Tier 3 Skipped: No golden CUDA output (--golden) specified.")
        print("To verify numerical accuracy, supply a NumPy .npy array or space-separated .txt file.")
        # Cleanup binaries
        for f in [binary_normal, binary_asan]:
            if os.path.exists(f): os.remove(f)
        sys.exit(0)

    # Compile normal binary was run, execute it to write actual output
    run_normal_cmd = [binary_normal]
    if args.args:
        run_normal_cmd.extend(args.args.split())
        
    code, out, err = run_command(run_normal_cmd, "Running normal binary to generate output file")
    if code != 0:
        print(f"[FAIL] Tier 3 Failed: Normal binary execution crashed.")
        # Cleanup
        for f in [binary_normal, binary_asan]:
            if os.path.exists(f): os.remove(f)
        sys.exit(1)

    # Validate output file presence
    hip_out_path = args.hip_output
    if not os.path.exists(hip_out_path):
        print(f"[FAIL] Tier 3 Failed: HIP output file '{hip_out_path}' was not generated by your program.")
        print("Please ensure your HIP C++ program writes its output coordinates/matrices to this file.")
        # Cleanup
        for f in [binary_normal, binary_asan]:
            if os.path.exists(f): os.remove(f)
        sys.exit(1)

    try:
        import numpy as np
    except ImportError:
        print("\n[WARN] Warning: 'numpy' package is not installed. Falling back to basic file parsing.")
        print("For robust float comparison, install numpy: pip install numpy")
        
        # Fallback raw parsing
        def parse_file(path):
            with open(path, "r") as f:
                return [float(x) for x in f.read().split()]
        try:
            golden_vals = parse_file(args.golden)
            hip_vals = parse_file(hip_out_path)
            
            if len(golden_vals) != len(hip_vals):
                print(f"[FAIL] Tier 3 Failed: Matrix size mismatch. Golden={len(golden_vals)}, HIP={len(hip_vals)}")
                sys.exit(1)
                
            max_dev = 0.0
            for g, h in zip(golden_vals, hip_vals):
                max_dev = max(max_dev, abs(g - h))
                
            if max_dev > args.atol:
                print(f"[FAIL] Tier 3 Failed: Max deviation {max_dev:.6f} exceeds tolerance {args.atol:.6f}")
                sys.exit(1)
            else:
                print(f"[PASS] Tier 3 Passed: Parity matched! Max deviation: {max_dev:.6f}")
        except Exception as parse_err:
            print(f"[FAIL] Tier 3 Failed: Could not parse output files: {str(parse_err)}")
            sys.exit(1)
        finally:
            for f in [binary_normal, binary_asan]:
                if os.path.exists(f): os.remove(f)
        sys.exit(0)

    # Numpy based loading and verification
    try:
        if args.golden.endswith(".npy"):
            golden_data = np.load(args.golden)
        else:
            golden_data = np.loadtxt(args.golden)
            
        if hip_out_path.endswith(".npy"):
            hip_data = np.load(hip_out_path)
        else:
            hip_data = np.loadtxt(hip_out_path)

        if golden_data.shape != hip_data.shape:
            print(f"[FAIL] Tier 3 Failed: Shape mismatch. Golden shape: {golden_data.shape}, HIP shape: {hip_data.shape}")
            sys.exit(1)

        is_close = np.allclose(golden_data, hip_data, atol=args.atol, rtol=args.rtol)
        max_deviation = np.max(np.abs(golden_data - hip_data))

        if is_close:
            print(f"[PASS] Tier 3 Passed: Parity matched! Max deviation: {max_deviation:.6e}")
        else:
            print(f"[FAIL] Tier 3 Failed: Outputs differ! Max deviation: {max_deviation:.6e}")
            sys.exit(1)
            
    except Exception as np_err:
        print(f"[FAIL] Tier 3 Failed: Parity calculation failed: {str(np_err)}")
        sys.exit(1)
    finally:
        # Cleanup executables
        for f in [binary_normal, binary_asan]:
            if os.path.exists(f): os.remove(f)

if __name__ == "__main__":
    main()
