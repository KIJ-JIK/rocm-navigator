"""
Scanner Utility Functions — Language detection, build file scanning, repository analysis.

Ported from amd/backend/agents/scanner/utils.py
"""
import os
from typing import List, Tuple

def detect_languages(directory_path: str) -> List[str]:
    languages = set()
    for root, _, files in os.walk(directory_path):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ('.cu', '.cuh'):
                languages.add('cuda')
            elif ext in ('.cpp', '.h', '.hpp', '.c', '.cc', '.cxx'):
                languages.add('cpp')
            elif ext == '.py':
                languages.add('python')
            elif ext in ('.f90', '.f', '.f95', '.f03'):
                languages.add('fortran')
    return list(languages)

def detect_build_files(directory_path: str) -> bool:
    build_files = {'Makefile', 'CMakeLists.txt', 'setup.py', 'build.sh', 'meson.build'}
    for root, _, files in os.walk(directory_path):
        for file in files:
            if file in build_files:
                return True
    return False

def analyze_repository(directory_path: str) -> Tuple[List[str], bool]:
    languages = detect_languages(directory_path)
    has_build_files = detect_build_files(directory_path)
    return languages, has_build_files
