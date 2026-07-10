"""
Pydantic Data Models — Structured schemas for AST tokens, scan summaries,
architecture topology, and request/response payloads.

Ported from amd/backend/agents/scanner/models.py
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class SingleParseRequest(BaseModel):
    session_id: str = "default_session"
    filename: str
    code: str

class DirParseRequest(BaseModel):
    session_id: str
    directory_path: str

class LaunchConfig(BaseModel):
    grid_dim: Optional[str] = None
    block_dim: Optional[str] = None
    shared_mem: Optional[str] = None
    stream: Optional[str] = None

class Token(BaseModel):
    id: str
    type: str
    subtype: Optional[str] = None
    name: str
    line_start: int
    line_end: int
    col_start: int
    col_end: int
    source_text: str
    arguments: Optional[List[str]] = None
    launch_config: Optional[LaunchConfig] = None
    hip_equivalent: Optional[str] = None

class FileTokens(BaseModel):
    path: str
    language: str = "cuda"
    tokens: List[Token]
    warp_votes: List[Token] = []

class ScanSummary(BaseModel):
    total_files: int
    cuda_files: int
    total_kernels: int
    total_cuda_api_calls: int
    languages_detected: List[str]

class SourceTreeAST(BaseModel):
    session_id: str
    scan_timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    summary: ScanSummary
    files: List[FileTokens]

class CompareRequest(BaseModel):
    session_id: str
    ast_a: SourceTreeAST
    ast_b: SourceTreeAST

class CompareResponse(BaseModel):
    session_id: str
    repo_a_session: str
    repo_b_session: str
    comparison_diff: Dict[str, Any]
    status: str = "completed"

class ArchitectureTopology(BaseModel):
    call_topology: Dict[str, Any]
    warnings: List[Dict[str, Any]]
    deadlocks_detected: int
    difficulty_score: int
    health_score: float
    warp_votes: Dict[str, List[Dict[str, Any]]]

class SingleParseResponse(BaseModel):
    session_id: str
    file_tokens: FileTokens
    status: str = "completed"
    processing_time_ms: int

class DirParseResponse(BaseModel):
    session_id: str
    source_tree_ast: SourceTreeAST
    architecture_dependencies: ArchitectureTopology
    status: str = "completed"
    processing_time_ms: int

class DependencyGraphRequest(BaseModel):
    session_id: str
    source_tree_ast: SourceTreeAST

class DependencyGraphResponse(BaseModel):
    session_id: str
    architecture_dependencies: Dict[str, Any]
    status: str = "completed"

class HealthResponse(BaseModel):
    status: str = "healthy"
    libclang_loaded: bool = True
    supported_languages: List[str]
    version: str = "1.0.0"
