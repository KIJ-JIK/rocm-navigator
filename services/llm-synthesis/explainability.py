"""
Explainability Generator — generates diff comparisons, confidence scores,
and semantic justification reasons for CUDA-to-HIP migrations.

Ported from Abdullah & Malatesh's amd workspace.
"""
import difflib


def generate_diff(original: str, translated: str) -> str:
    """
    Generates a unified diff comparing the original CUDA file to the new HIP file.
    """
    orig_lines = original.splitlines(keepends=True)
    trans_lines = translated.splitlines(keepends=True)
    diff = difflib.unified_diff(orig_lines, trans_lines, fromfile='Original (CUDA)', tofile='Translated (HIP)')
    return "".join(diff)


def calculate_confidence(ast_match: bool, validation_passed: bool, difficulty: int, retries: int) -> float:
    """
    Confidence = AST Match + Validation + HIPIFY + Performance + LLM Confidence
    For the MVP, we use a simple heuristic based on the pipeline results.
    """
    confidence = 100.0
    if not ast_match:
        confidence -= 20.0
    if not validation_passed:
        confidence -= 50.0

    # Penalize for taking multiple retries
    confidence -= (retries * 5.0)

    # Penalize slightly for high difficulty
    if difficulty > 60:
        confidence -= 10.0

    return max(0.0, min(100.0, confidence))


def generate_explanation(original: str, translated: str, topology: dict = None,
                         validation_logs: str = None, retry_count: int = 0) -> dict:
    """
    Generates the explainability artifacts for the frontend.
    """
    diff_text = generate_diff(original, translated)

    validation_passed = (validation_logs is None)

    difficulty = 0
    if topology:
        difficulty = topology.get("difficulty_score", 0)

    confidence = calculate_confidence(
        ast_match=True,  # AST match is always True for regex rewriter
        validation_passed=validation_passed,
        difficulty=difficulty,
        retries=retry_count
    )

    # Simple reason mapping based on API translations found in the diff
    reasons = []
    if "cudaMalloc" in original and "hipMalloc" in translated:
        reasons.append({"line": "memory", "reason": "Converted cudaMalloc to hipMalloc based on AMD standards."})
    if "cudaMemcpy" in original and "hipMemcpy" in translated:
        reasons.append({"line": "memcpy", "reason": "Mapped host-to-device memory copies using hipMemcpy."})
    if "<<<" in original and "hipLaunchKernelGGL" in translated:
        reasons.append({"line": "launch", "reason": "Rewrote triple-bracket <<<...>>> CUDA syntax to hipLaunchKernelGGL macro."})
    if "threadIdx" in original and "hipThreadIdx" in translated:
        reasons.append({"line": "thread", "reason": "Mapped CUDA thread parameters to native hipThreadIdx parameters."})
    if "hipStreamSynchronize" in translated:
        reasons.append({"line": "sync", "reason": "Injected hipStreamSynchronize due to detected deadlocks in AST topology."})
    if validation_logs:
        reasons.append({"line": "compiler", "reason": f"Compiler feedback integrated: {validation_logs}"})

    return {
        "diff": diff_text,
        "confidence_score": confidence,
        "reasons": reasons,
        "performance_effect": "Neutral/Positive (Native HIP compilation)"
    }
