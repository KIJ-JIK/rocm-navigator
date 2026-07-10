"""
ROCm Navigator — Shared Database Models
Pydantic schemas for request/response validation and SQLAlchemy-compatible data contracts.
Owner: Yashwant (Member 5 — Security & Reporting Lead)
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional, Dict, Any


# ===========================================================================
# Audit Log Model
# ===========================================================================
@dataclass
class AuditLogEntry:
    """Represents a single pipeline step audit log record."""
    id: Optional[int] = None
    agent_name: str = ""
    step_name: str = ""
    message: str = ""
    status: str = "SUCCESS"
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "agent_name": self.agent_name,
            "step_name": self.step_name,
            "message": self.message,
            "status": self.status,
            "timestamp": self.timestamp,
        }


# ===========================================================================
# Security Scan Summary Model
# ===========================================================================
@dataclass
class SecurityScanRecord:
    """Represents a security scan summary stored in the database."""
    id: Optional[int] = None
    file_count: int = 0
    secrets_found: int = 0
    vulnerabilities_found: int = 0
    safety_score: float = 0.0
    scanned_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "file_count": self.file_count,
            "secrets_found": self.secrets_found,
            "vulnerabilities_found": self.vulnerabilities_found,
            "safety_score": self.safety_score,
            "scanned_at": self.scanned_at,
        }


# ===========================================================================
# Compiled Report Reference Model
# ===========================================================================
@dataclass
class CompiledReportRecord:
    """Represents a compiled report file reference stored in the database."""
    id: Optional[int] = None
    report_id: str = ""
    report_type: str = "MARKDOWN"       # MARKDOWN | PDF | JSON | OPENAPI_JSON | POSTMAN_COLLECTION
    filepath: str = ""
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "report_id": self.report_id,
            "report_type": self.report_type,
            "filepath": self.filepath,
            "created_at": self.created_at,
        }


# ===========================================================================
# Secret Finding Model
# ===========================================================================
@dataclass
class SecretFinding:
    """Represents a detected secret/credential exposure from scanning."""
    file: str = ""
    line: int = 0
    type: str = ""
    raw_value: str = ""
    scrubbed_value: str = ""
    severity: str = "HIGH"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "file": self.file,
            "line": self.line,
            "type": self.type,
            "raw_value": "[REDACTED]",  # Never expose raw secrets in serialization
            "scrubbed_value": self.scrubbed_value,
            "severity": self.severity,
        }


# ===========================================================================
# Vulnerability Model
# ===========================================================================
@dataclass
class Vulnerability:
    """Represents a static analysis code vulnerability finding."""
    file: str = ""
    line: int = 0
    rule_id: str = ""
    name: str = ""
    description: str = ""
    severity: str = "MEDIUM"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "file": self.file,
            "line": self.line,
            "rule_id": self.rule_id,
            "name": self.name,
            "description": self.description,
            "severity": self.severity,
        }


# ===========================================================================
# Full Audit Result Model
# ===========================================================================
@dataclass
class AuditResult:
    """Complete aggregated output from a full security audit run."""
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    workspace_path: str = ""
    secrets_findings: List[Dict[str, Any]] = field(default_factory=list)
    vulnerabilities: List[Dict[str, Any]] = field(default_factory=list)
    container_findings: List[Dict[str, Any]] = field(default_factory=list)
    sbom: Dict[str, Any] = field(default_factory=dict)
    tee_status: Dict[str, Any] = field(default_factory=dict)
    ratings_breakdown: Dict[str, Any] = field(default_factory=dict)
    safety_score: float = 0.0
    compliance_status: str = "PASS"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "timestamp": self.timestamp,
            "workspace_path": self.workspace_path,
            "secrets_findings": self.secrets_findings,
            "vulnerabilities": self.vulnerabilities,
            "container_findings": self.container_findings,
            "sbom": self.sbom,
            "tee_status": self.tee_status,
            "ratings_breakdown": self.ratings_breakdown,
            "safety_score": self.safety_score,
            "compliance_status": self.compliance_status,
        }


# ===========================================================================
# GitHub PR Simulation Model
# ===========================================================================
@dataclass
class GitHubPRRecord:
    """Represents the result of a GitHub PR automation operation."""
    status: str = "SUCCESS"
    is_simulated: bool = True
    branch_created: str = ""
    commit_log: str = ""
    pr_number: int = 0
    pr_url: str = ""
    title: str = ""
    body: str = ""
    head_branch: str = ""
    base_branch: str = ""
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "status": self.status,
            "is_simulated": self.is_simulated,
            "branch_created": self.branch_created,
            "commit_log": self.commit_log,
            "pr_number": self.pr_number,
            "pr_url": self.pr_url,
            "title": self.title,
            "body": self.body,
            "head_branch": self.head_branch,
            "base_branch": self.base_branch,
            "created_at": self.created_at,
        }


# ===========================================================================
# SBOM Dependency Model
# ===========================================================================
@dataclass
class SBOMDependency:
    """Represents a single dependency in a Software Bill of Materials."""
    name: str = ""
    version: str = ""
    license: str = "UNKNOWN"
    declared_in: str = ""
    risk_level: str = "LOW"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "version": self.version,
            "license": self.license,
            "declared_in": self.declared_in,
            "risk_level": self.risk_level,
        }
