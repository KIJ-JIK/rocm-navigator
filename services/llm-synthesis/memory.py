"""
AI Memory — persists successful migration patterns to the knowledge store.
Every successful migration becomes knowledge for future migrations.

Workflow: Migration → Validation → Success → Knowledge Base → Future Prompt Improvement
"""
import json
import os
from typing import List, Dict, Any
from datetime import datetime

_MEMORY_FILE = os.path.join(os.path.dirname(__file__), "data", "ai_memory.json")

def _load_memory() -> List[Dict[str, Any]]:
    os.makedirs(os.path.dirname(_MEMORY_FILE), exist_ok=True)
    if not os.path.exists(_MEMORY_FILE):
        return []
    try:
        with open(_MEMORY_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def _save_memory(memories: List[Dict[str, Any]]) -> None:
    os.makedirs(os.path.dirname(_MEMORY_FILE), exist_ok=True)
    with open(_MEMORY_FILE, "w") as f:
        json.dump(memories, f, indent=2)

def store_successful_migration(file_path: str, source_code: str, translated_code: str,
                                ast_tokens: List[Dict], topology: Dict, confidence: float) -> None:
    """
    After a successful validation, store the migration pattern so future
    retrievals can use this as a reference example.
    """
    memories = _load_memory()
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "file_path": file_path,
        "confidence": confidence,
        "token_types": list({t.get("type") for t in ast_tokens}),
        "difficulty_score": topology.get("difficulty_score", 0),
        "source_snippet": source_code[:300],  # truncate for storage
        "translated_snippet": translated_code[:300],
    }
    memories.append(entry)
    # Keep only the last 100 successful migrations
    memories = memories[-100:]
    _save_memory(memories)

def get_memory_summary() -> Dict[str, Any]:
    """Returns a summary of all stored migration patterns."""
    memories = _load_memory()
    return {
        "total_migrations": len(memories),
        "average_confidence": (
            sum(m["confidence"] for m in memories) / len(memories)
            if memories else 0.0
        ),
        "recent": memories[-5:] if memories else [],
    }
