import subprocess
import sys
import os

def run_test_suite(path: str, script_name: str) -> bool:
    print(f"\n==================================================")
    print(f" Running Tests: {script_name} ({path})")
    print(f"==================================================")
    use_shell = (os.name == 'nt')
    result = subprocess.run(
        [sys.executable, script_name],
        cwd=path,
        shell=use_shell
    )
    return result.returncode == 0

def main():
    test_suites = [
        ("services/core-scanner", "test_scanner.py"),
        ("services/llm-synthesis", "test_synthesis.py"),
        ("services/sandbox-runtime", "test_sandbox.py"),
        ("services/security-audit", "test_security.py")
    ]
    
    success_count = 0
    failed_suites = []
    
    for path, script in test_suites:
        if run_test_suite(path, script):
            success_count += 1
        else:
            failed_suites.append(f"{path}/{script}")
            
    print(f"\n==================================================")
    print(f"              TEST VERIFICATION SUMMARY            ")
    print(f"==================================================")
    print(f"Passed: {success_count} / {len(test_suites)}")
    
    if failed_suites:
        print(f"Failed Suites:")
        for suite in failed_suites:
            print(f"  - {suite}")
        sys.exit(1)
    else:
        print("All test suites passed successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
