import uvicorn
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from knowledge import SimpleVectorSearch
from rewrite import CodeRewriter
from memory import store_successful_migration, get_memory_summary
from explainability import generate_explanation

app = FastAPI(
    title="ROCm Navigator AI Synthesis Service",
    description="Microservice driving code translation, RAG, and self-healing compilers.",
    version="1.0.0"
)

vector_db = SimpleVectorSearch()
rewriter = CodeRewriter()

class TranslationPayload(BaseModel):
    code: str
    api_key: Optional[str] = None
    topology: Optional[Dict[str, Any]] = None  # Architecture Agent output: warnings, difficulty, call_topology

class FeedbackPayload(BaseModel):
    broken_code: str
    error_logs: str
    api_key: Optional[str] = None

class ExplanationPayload(BaseModel):
    original_code: str
    rewritten_code: str

@app.get("/api/v1/synthesis/health")
async def health_check():
    return {
        "status": "AI Synthesis Service Online",
        "knowledge_rag": "SimpleVectorSearch (Active)",
        "rewriter": "CodeRewriter (Active)"
    }

@app.post("/api/v1/synthesis/translate", status_code=status.HTTP_200_OK)
async def translate_code(payload: TranslationPayload):
    """
    Translates legacy CUDA code into optimized HIP files.
    """
    try:
        # Retrieve context from query matching tokens
        queries = ["cudaMalloc", "cudaMemcpy", "kernel launch", "shared memory", "threadIdx"]
        matched_context = []
        for q in queries:
            if q in payload.code:
                matched_context.extend(vector_db.query_docs(q, limit=1))

        # Run rewrite engine — pass topology so LangGraph can use it for smarter translation
        active_rewriter = rewriter
        if payload.api_key:
            active_rewriter = CodeRewriter(api_key=payload.api_key)

        translated_code = active_rewriter.translate_cuda_to_hip(
            payload.code,
            matched_context,
            topology=payload.topology   # forwarded to rewriter for LangGraph state
        )
        return {
            "translated_code": translated_code,
            "context_referenced": [doc["topic"] for doc in matched_context]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failure: {str(e)}")

@app.post("/api/v1/synthesis/feedback-adjust", status_code=status.HTTP_200_OK)
async def feedback_adjust(payload: FeedbackPayload):
    """
    Receives compiler logs and updates broken code targets.
    """
    try:
        active_rewriter = rewriter
        if payload.api_key:
            active_rewriter = CodeRewriter(api_key=payload.api_key)
            
        healed_code = active_rewriter.self_heal_code(payload.broken_code, payload.error_logs)
        return {"healed_code": healed_code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Self-healing adjustments failed: {str(e)}")

@app.post("/api/v1/synthesis/explain", status_code=status.HTTP_200_OK)
async def explain_changes(payload: ExplanationPayload):
    """
    Generates semantic explainability justifications with confidence scores and unified diffs.
    """
    try:
        result = generate_explanation(
            original=payload.original_code,
            translated=payload.rewritten_code
        )
        return {
            "explanation": " ".join(r["reason"] for r in result["reasons"]) or "Verified syntax mapping. Preserved core algorithm logic.",
            "confidence": result["confidence_score"],
            "impact": result["performance_effect"],
            "diff": result["diff"],
            "reasons": result["reasons"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explainability generation failed: {str(e)}")

class DetailedExplainPayload(BaseModel):
    original_code: str
    rewritten_code: str
    topology: Optional[Dict[str, Any]] = None
    validation_logs: Optional[str] = None
    retry_count: int = 0

@app.post("/api/v1/synthesis/explain-detailed", status_code=status.HTTP_200_OK)
async def explain_detailed(payload: DetailedExplainPayload):
    """
    Generates full explainability artifacts with topology-aware confidence and diff.
    """
    try:
        result = generate_explanation(
            original=payload.original_code,
            translated=payload.rewritten_code,
            topology=payload.topology,
            validation_logs=payload.validation_logs,
            retry_count=payload.retry_count
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detailed explainability failed: {str(e)}")

class StoreMemoryPayload(BaseModel):
    file_path: str
    source_code: str
    translated_code: str
    ast_tokens: List[Dict[str, Any]] = []
    topology: Dict[str, Any] = {}
    confidence: float

@app.post("/api/v1/synthesis/store-memory", status_code=status.HTTP_200_OK)
async def store_memory(payload: StoreMemoryPayload):
    try:
        store_successful_migration(
            payload.file_path,
            payload.source_code,
            payload.translated_code,
            payload.ast_tokens,
            payload.topology,
            payload.confidence
        )
        return {"status": "SUCCESS"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/synthesis/memory-summary")
async def memory_summary():
    try:
        return get_memory_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class LangGraphTranslatePayload(BaseModel):
    file_path: str = "input.cu"
    source_code: str
    ast_tokens: List[Dict[str, Any]] = []
    topology: Dict[str, Any] = {}

@app.post("/api/v1/synthesis/translate-langgraph", status_code=status.HTTP_200_OK)
async def translate_langgraph(payload: LangGraphTranslatePayload):
    """
    Translates CUDA to HIP using the LangGraph state machine pipeline
    (retrieve → translate → validate with self-healing retry loop).
    Falls back to 501 if langgraph is not installed.
    """
    try:
        from graph import rewrite_app
    except ImportError:
        raise HTTPException(status_code=501, detail="LangGraph is not installed. Use /translate endpoint instead.")

    if rewrite_app is None:
        raise HTTPException(status_code=501, detail="LangGraph is not installed. Use /translate endpoint instead.")

    try:
        initial_state = {
            "file_path": payload.file_path,
            "source_code": payload.source_code,
            "ast_tokens": payload.ast_tokens,
            "topology": payload.topology,
            "translated_code": "",
            "context_hints": "",
            "validation_logs": None,
            "retry_count": 0,
            "confidence_score": 0.0,
            "status": "starting"
        }
        result = rewrite_app.invoke(initial_state)
        return {
            "translated_code": result.get("translated_code", ""),
            "status": result.get("status", "unknown"),
            "retry_count": result.get("retry_count", 0),
            "confidence_score": result.get("confidence_score", 0.0),
            "context_hints": result.get("context_hints", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangGraph pipeline failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8002, reload=True)
