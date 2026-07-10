"""
Deep libclang AST Serializer — Parses C++/CUDA files using python-clang bindings
for deep Abstract Syntax Tree traversal.

Ported from amd/backend/agents/scanner/serializer.py
Imports adapted for monorepo flat structure.

NOTE: This module requires LLVM/Clang installed on the host system and the
`clang` Python package. If libclang is not available, use the lightweight
regex-based CudaParser in parser.py instead (zero external dependencies).
"""
import uuid
import re
from typing import List

try:
    import clang.cindex
    LIBCLANG_AVAILABLE = True
except ImportError:
    LIBCLANG_AVAILABLE = False

from models import FileTokens, Token, ScanSummary, LaunchConfig
from patterns import get_api_subtype, MEMORY_APIS, SYNC_APIS, WARP_PRIMITIVES


def serialize_tree_to_tokens(tu, content: str, file_path: str) -> FileTokens:
    """
    Walks the clang TranslationUnit AST and extracts structured tokens.
    Requires libclang to be available.
    """
    if not LIBCLANG_AVAILABLE:
        raise RuntimeError("libclang is not installed. Use CudaParser (parser.py) instead.")

    tokens = []
    warp_votes = []

    def get_token_text(cursor):
        text = ""
        for token in cursor.get_tokens():
            text += token.spelling + " "
        return text.strip()

    def walk_tree(cursor):
        # 1. Kernel Declarations (FUNCTION_DECL with __global__)
        if cursor.kind == clang.cindex.CursorKind.FUNCTION_DECL:
            is_global = False
            for child in cursor.get_children():
                if hasattr(clang.cindex.CursorKind, "CUDAGLOBAL_ATTR") and child.kind == clang.cindex.CursorKind.CUDAGLOBAL_ATTR:
                    is_global = True
                    break
                if hasattr(clang.cindex.CursorKind, "CUDA_GLOBAL_ATTR") and child.kind == getattr(clang.cindex.CursorKind, "CUDA_GLOBAL_ATTR"):
                    is_global = True
                    break
                if child.kind == clang.cindex.CursorKind.ANNOTATE_ATTR and "global" in child.spelling:
                    is_global = True

            # fallback: check text
            if not is_global and "__global__" in get_token_text(cursor):
                is_global = True

            if is_global:
                tokens.append(Token(
                    id=f"tok_{uuid.uuid4().hex[:8]}",
                    type="kernel_declaration",
                    name=cursor.spelling,
                    line_start=cursor.extent.start.line,
                    line_end=cursor.extent.end.line,
                    col_start=cursor.extent.start.column,
                    col_end=cursor.extent.end.column,
                    source_text=cursor.spelling
                ))

        # 2. Function calls (CALL_EXPR) or Unresolved functions
        elif cursor.kind in (clang.cindex.CursorKind.CALL_EXPR, clang.cindex.CursorKind.OVERLOADED_DECL_REF, clang.cindex.CursorKind.DECL_REF_EXPR):
            api_name = cursor.spelling
            if cursor.kind == clang.cindex.CursorKind.CALL_EXPR and not api_name:
                for child in cursor.get_children():
                    if child.kind == clang.cindex.CursorKind.DECL_REF_EXPR:
                        api_name = child.spelling
                        break

            # CUDA memory, sync, warp
            if api_name:
                subtype = get_api_subtype(api_name)
                if subtype != "other":
                    if not any(t.name == api_name and t.line_start == cursor.extent.start.line for t in tokens):
                        tok = Token(
                            id=f"tok_{uuid.uuid4().hex[:8]}",
                            type="cuda_api_call",
                            subtype=subtype,
                            name=api_name,
                            line_start=cursor.extent.start.line,
                            line_end=cursor.extent.end.line,
                            col_start=cursor.extent.start.column,
                            col_end=cursor.extent.end.column,
                            source_text=api_name,
                            arguments=[]
                        )
                        tokens.append(tok)
                        if subtype == "warp_primitive":
                            warp_votes.append(tok)

        # 3. Includes (INCLUSION_DIRECTIVE)
        elif cursor.kind == clang.cindex.CursorKind.INCLUSION_DIRECTIVE:
            tokens.append(Token(
                id=f"tok_{uuid.uuid4().hex[:8]}",
                type="include_directive",
                name=cursor.spelling,
                line_start=cursor.extent.start.line,
                line_end=cursor.extent.end.line,
                col_start=cursor.extent.start.column,
                col_end=cursor.extent.end.column,
                source_text=cursor.spelling
            ))

        # 4. Templates
        elif cursor.kind in (clang.cindex.CursorKind.CLASS_TEMPLATE, clang.cindex.CursorKind.FUNCTION_TEMPLATE, clang.cindex.CursorKind.CLASS_TEMPLATE_PARTIAL_SPECIALIZATION):
            subtype = "class" if cursor.kind in (clang.cindex.CursorKind.CLASS_TEMPLATE, clang.cindex.CursorKind.CLASS_TEMPLATE_PARTIAL_SPECIALIZATION) else "function"
            tokens.append(Token(
                id=f"tok_{uuid.uuid4().hex[:8]}",
                type="template_instantiation",
                subtype=subtype,
                name=cursor.spelling,
                line_start=cursor.extent.start.line,
                line_end=cursor.extent.end.line,
                col_start=cursor.extent.start.column,
                col_end=cursor.extent.end.column,
                source_text=cursor.spelling
            ))

        for child in cursor.get_children():
            walk_tree(child)

    walk_tree(tu.cursor)

    # regex fallback for kernel launches if clang doesn't build CUDA_KERNEL_CALL_EXPR
    kernel_launch_pattern = re.compile(r'(\w+)\s*<<<\s*([^>]+)\s*>>>\s*\((.*?)\)')
    for match in kernel_launch_pattern.finditer(content):
        func_name = match.group(1)
        if not any(t.name == func_name and t.type == "kernel_launch" for t in tokens):
            line = content.count('\n', 0, match.start()) + 1
            tokens.append(Token(
                id=f"tok_{uuid.uuid4().hex[:8]}",
                type="kernel_launch",
                name=func_name,
                line_start=line,
                line_end=line,
                col_start=0,
                col_end=0,
                source_text=match.group(0),
                launch_config=LaunchConfig(grid_dim="unknown", block_dim="unknown")
            ))

    return FileTokens(
        path=file_path,
        tokens=tokens,
        warp_votes=warp_votes
    )


def generate_scan_summary(files: List[FileTokens]) -> ScanSummary:
    total_kernels = sum(1 for f in files for t in f.tokens if t.type == "kernel_declaration")
    total_cuda_api = sum(1 for f in files for t in f.tokens if t.type == "cuda_api_call")
    languages_detected = list(set(f.language for f in files))

    return ScanSummary(
        total_files=len(files),
        cuda_files=sum(1 for f in files if f.language == "cuda"),
        total_kernels=total_kernels,
        total_cuda_api_calls=total_cuda_api,
        languages_detected=languages_detected
    )
