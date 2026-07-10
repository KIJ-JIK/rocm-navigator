"""
Scanner Configuration — Base paths and supported languages.

Ported from amd/backend/agents/scanner/config.py
"""
import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# The languages supported by the parser
SUPPORTED_LANGUAGES = ["cpp", "cuda"]
