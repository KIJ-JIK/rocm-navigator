"""
Repository Comparison — Compares two SourceTreeAST scans to produce a diff of key metrics.

Ported from amd/backend/agents/scanner/comparison.py
Imports adapted for monorepo flat structure.
"""
from typing import Dict, Any
from models import SourceTreeAST

def compare_repositories(ast_a: SourceTreeAST, ast_b: SourceTreeAST) -> Dict[str, Any]:
    """
    Compares two repository scans and returns a diff of key metrics.
    Useful for comparing a project before and after migration, or comparing two branches.
    """
    summary_a = ast_a.summary
    summary_b = ast_b.summary

    diff = {
        "files_changed": summary_b.total_files - summary_a.total_files,
        "cuda_files_diff": summary_b.cuda_files - summary_a.cuda_files,
        "kernels_diff": summary_b.total_kernels - summary_a.total_kernels,
        "cuda_api_calls_diff": summary_b.total_cuda_api_calls - summary_a.total_cuda_api_calls,
        "languages_added": list(set(summary_b.languages_detected) - set(summary_a.languages_detected)),
        "languages_removed": list(set(summary_a.languages_detected) - set(summary_b.languages_detected))
    }

    return {
        "repo_a_session": ast_a.session_id,
        "repo_b_session": ast_b.session_id,
        "comparison_diff": diff
    }
