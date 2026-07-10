"""
LangGraph State Machine — Constructs the self-healing translation pipeline.

Ported from amd/backend/agents/rewrite/graph.py
Imports adapted for monorepo flat structure.

NOTE: This module requires the `langgraph` package to be installed.
If langgraph is not available, the monorepo falls back to the direct
CodeRewriter class in rewrite.py (which does NOT need langgraph).
"""
try:
    from langgraph.graph import StateGraph, END
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False

from state import RewriteAgentState

# Only import nodes if langgraph is available
if LANGGRAPH_AVAILABLE:
    from nodes import (
        retrieve_context_node,
        translate_code_node,
        validate_code_node,
        check_retry_condition
    )


def build_rewrite_graph():
    """
    Constructs the LangGraph state machine for the translation pipeline.

    Flow: retrieve_context -> translate_code -> validate_code
                                  ^                    |
                                  |--- retry ----------|
                                  |                    |
                                  END <--- success ----|
                                  END <--- fail -------|

    Returns None if langgraph is not installed.
    """
    if not LANGGRAPH_AVAILABLE:
        return None

    workflow = StateGraph(RewriteAgentState)

    # Add nodes
    workflow.add_node("retrieve_context", retrieve_context_node)
    workflow.add_node("translate_code", translate_code_node)
    workflow.add_node("validate_code", validate_code_node)

    # Set entry point
    workflow.set_entry_point("retrieve_context")

    # Add edges
    workflow.add_edge("retrieve_context", "translate_code")
    workflow.add_edge("translate_code", "validate_code")

    # Add conditional edge for the self-healing loop
    workflow.add_conditional_edges(
        "validate_code",
        check_retry_condition,
        {
            "retry": "translate_code",
            "success": END,
            "fail": END
        }
    )

    return workflow.compile()


# Build graph at module load time (None if langgraph not installed)
rewrite_app = build_rewrite_graph()
