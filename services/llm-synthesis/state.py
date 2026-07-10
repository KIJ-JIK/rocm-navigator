"""
LangGraph State Definition — The state flowing through the Rewrite Agent pipeline.

Ported from amd/backend/agents/rewrite/state.py
"""
from typing import TypedDict, List, Dict, Any, Optional

class RewriteAgentState(TypedDict):
    """
    The state flowing through the Rewrite Agent LangGraph pipeline.
    """
    file_path: str
    source_code: str
    ast_tokens: List[Dict[str, Any]]
    topology: Dict[str, Any]
    
    # Generated elements
    translated_code: str
    context_hints: str
    validation_logs: Optional[str]
    
    # Routing and tracking
    retry_count: int
    confidence_score: float
    status: str # e.g. "translating", "validating", "success", "failed"
