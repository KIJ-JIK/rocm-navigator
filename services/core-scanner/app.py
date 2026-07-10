import uvicorn
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from parser import CudaParser
from analyzer import ArchitectureAnalyzer

app = FastAPI(
    title="ROCm Navigator Scanner Service",
    description="Microservice responsible for Tree-sitter style AST tokenizing and NetworkX topological analysis.",
    version="1.0.0"
)

class CodePayload(BaseModel):
    code: str
    filename: Optional[str] = "input_source.cu"

class DirPayload(BaseModel):
    directory_path: str

class AnalysisPayload(BaseModel):
    file_results: List[Dict[str, Any]]

@app.get("/api/v1/scanner/health")
async def health_check():
    return {
        "status": "Scanner Service Online",
        "parser": "CudaParser (Active)",
        "analyzer": "ArchitectureAnalyzer (Active)"
    }

@app.post("/api/v1/scanner/parse-tree", status_code=status.HTTP_200_OK)
async def parse_code(payload: CodePayload):
    """
    Parses raw code buffers into language-agnostic coordinate structures.
    """
    try:
        result = CudaParser.parse_code_string(payload.code, payload.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failure: {str(e)}")

@app.post("/api/v1/scanner/parse-dir", status_code=status.HTTP_200_OK)
async def parse_directory(payload: DirPayload):
    """
    Recursively scans and parses source files in a local directory path.
    """
    try:
        results = CudaParser.parse_directory(payload.directory_path)
        return {"files_scanned": len(results), "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Directory scanning failure: {str(e)}")

@app.post("/api/v1/scanner/dependency-graph", status_code=status.HTTP_200_OK)
async def generate_dependency_graph(payload: AnalysisPayload):
    """
    Parses file tokens to yield directed call graphs, health scores, and synchronization checks.
    """
    try:
        analysis = ArchitectureAnalyzer.analyze_repository_tokens(payload.file_results)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph analysis failure: {str(e)}")

@app.post("/api/v1/scanner/parse-tree-deep", status_code=status.HTTP_200_OK)
async def parse_code_deep(payload: CodePayload):
    """
    Parses code using the deep libclang AST serializer (Abdullah's implementation).
    Falls back to 501 if libclang is not installed.
    """
    try:
        from serializer import serialize_tree_to_tokens, LIBCLANG_AVAILABLE
    except ImportError:
        raise HTTPException(status_code=501, detail="libclang serializer not available.")

    if not LIBCLANG_AVAILABLE:
        raise HTTPException(
            status_code=501,
            detail="libclang is not installed. Use /parse-tree (regex parser) instead. "
                   "To enable deep parsing, install LLVM/Clang and the python 'clang' package."
        )

    try:
        import clang.cindex
        index = clang.cindex.Index.create()
        tu = index.parse(
            payload.filename,
            unsaved_files=[(payload.filename, payload.code)],
            args=["-x", "cuda", "--cuda-host-only"]
        )
        result = serialize_tree_to_tokens(tu, payload.code, payload.filename)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deep parsing failure: {str(e)}")

@app.post("/api/v1/scanner/compare", status_code=status.HTTP_200_OK)
async def compare_repos(payload: dict):
    """
    Compares two SourceTreeAST scans and returns a diff of key metrics.
    """
    try:
        from comparison import compare_repositories
        from models import SourceTreeAST
        ast_a = SourceTreeAST(**payload["ast_a"])
        ast_b = SourceTreeAST(**payload["ast_b"])
        result = compare_repositories(ast_a, ast_b)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failure: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True)
