"""
LangGraph Node Functions — Retrieval, Translation, and Validation nodes
for the self-healing CUDA-to-HIP translation pipeline.

Ported from amd/backend/agents/rewrite/nodes.py
Imports adapted for monorepo flat structure (no backend.agents prefix).
"""
from state import RewriteAgentState
from knowledge import SimpleVectorSearch
from memory import store_successful_migration
from prompts import WARP_HINT_TEMPLATE, DEADLOCK_HINT, DIFFICULTY_HINT
import re

# Shared retriever instance
_vector_search = SimpleVectorSearch()


def retrieve_context_node(state: RewriteAgentState) -> dict:
    """
    Node 1: Retrieves RAG context and parses architecture topology for hints.
    """
    # 1. Get base RAG context from knowledge agent
    ast_tokens = state.get("ast_tokens", [])
    query_terms = " ".join(t.get("name", "") for t in ast_tokens if isinstance(t, dict))
    docs = _vector_search.query_docs(query_terms, limit=3)
    context = "\n".join(f"Topic: {d['topic']}\nInfo: {d['content']}\nExample: {d['example']}" for d in docs)

    # 2. Inject architecture hints based on topology
    topology = state.get("topology", {})
    warnings = topology.get("warnings", [])
    deadlocks = topology.get("deadlocks_detected", 0)

    hints = [context]
    if warnings:
        hints.append(f"WARNINGS DETECTED: {len(warnings)}. Please review race conditions.")

    # Inject AMD-specific warp hint from prompts library
    warp_votes = topology.get("warp_votes", {})
    if isinstance(warp_votes, dict):
        total_warp_calls = sum(len(v) for v in warp_votes.values())
    else:
        total_warp_calls = 0
    if total_warp_calls > 0:
        hints.append(WARP_HINT_TEMPLATE.format(warp_count=32))

    if deadlocks > 0:
        hints.append(DEADLOCK_HINT)

    difficulty = topology.get("difficulty_score", 0)
    if difficulty > 60:
        hints.append(DIFFICULTY_HINT.format(score=difficulty))

    return {"context_hints": "\n".join(hints)}


def translate_code_node(state: RewriteAgentState) -> dict:
    """
    Node 2: Translates CUDA to HIP.
    In production, this calls LangChain + Fireworks AI (Gemma).
    We use a mock translator for the MVP.
    """
    source = state["source_code"]

    # Simple regex mock for translation
    translated = source.replace("cudaMalloc", "hipMalloc")
    translated = translated.replace("cudaFree", "hipFree")
    translated = translated.replace("cudaMemcpy", "hipMemcpy")
    translated = translated.replace("__shfl_down_sync", "__shfl_down")  # mock warp translation

    # Inject stream sync if context hints say so
    if "hipStreamSynchronize()" in state.get("context_hints", ""):
        # crude injection at end of launches for mock
        translated = re.sub(r'(<<<.*?>>>.*?;)', r'\1\n    hipStreamSynchronize(0);', translated)

    if state.get("validation_logs"):
        # We are in a retry loop. Append a comment for mock tracking.
        translated = f"// Fixed compiler errors: {state['validation_logs']}\n" + translated

    return {"translated_code": translated, "status": "translated"}


def validate_code_node(state: RewriteAgentState) -> dict:
    """
    Node 3: Calls Arya's sandboxed compiler.
    Mocking compilation success/failure based on difficulty score for the demo.
    """
    topology = state.get("topology", {})
    difficulty = topology.get("difficulty_score", 0)

    current_retry = state.get("retry_count", 0)

    # Mock behavior: If difficulty > 60 and this is the first try, it fails.
    if difficulty > 60 and current_retry == 0:
        logs = "error: no instance of overloaded function 'hipMalloc' matches the argument list"
        return {"validation_logs": logs, "retry_count": current_retry + 1, "status": "validation_failed"}

    return {"validation_logs": None, "status": "validation_success"}


def check_retry_condition(state: RewriteAgentState) -> str:
    """
    Conditional Edge: Checks if we should self-heal or finish.
    On success, saves the pattern to AI Memory.
    """
    logs = state.get("validation_logs")
    retry_count = state.get("retry_count", 0)
    difficulty = state.get("topology", {}).get("difficulty_score", 0)

    if logs:
        # LangGraph constraint: use difficulty_score 60 as the condition to activate self-healing compiler loop
        if difficulty > 60 and retry_count < 3:
            return "retry"
        else:
            return "fail"

    # SUCCESS: persist to AI Memory so future migrations are smarter
    try:
        store_successful_migration(
            file_path=state.get("file_path", "unknown"),
            source_code=state.get("source_code", ""),
            translated_code=state.get("translated_code", ""),
            ast_tokens=state.get("ast_tokens", []),
            topology=state.get("topology", {}),
            confidence=state.get("confidence_score", 90.0)
        )
    except Exception:
        pass  # Memory write failure should never break the pipeline

    return "success"
