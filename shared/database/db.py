import sqlite3
import os
from datetime import datetime

# Load environment variables from .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "navigator.db")

class Database:
    @staticmethod
    def is_postgres() -> bool:
        return bool(os.environ.get("NEON_DATABASE_URL"))

    @classmethod
    def get_connection(cls):
        """Returns a connection to either Neon PostgreSQL or SQLite database."""
        db_url = os.environ.get("NEON_DATABASE_URL")
        if db_url:
            import psycopg2
            conn = psycopg2.connect(db_url)
            return conn
        else:
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            return conn

    @classmethod
    def init_db(cls):
        """Initializes the database schema if tables do not exist."""
        is_pg = cls.is_postgres()
        if not is_pg:
            os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        
        conn = cls.get_connection()
        try:
            cursor = conn.cursor()
            
            # Table for multi-agent event logs
            id_type = "SERIAL PRIMARY KEY" if is_pg else "INTEGER PRIMARY KEY AUTOINCREMENT"
            timestamp_type = "VARCHAR(50)" if is_pg else "TEXT"
            text_type = "TEXT" if is_pg else "TEXT"
            
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id {id_type},
                    timestamp {timestamp_type} NOT NULL,
                    agent_name VARCHAR(100) NOT NULL,
                    step_name VARCHAR(100) NOT NULL,
                    message {text_type} NOT NULL,
                    status VARCHAR(50) NOT NULL
                )
            """)
            
            # Table for security scans history
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS security_scans (
                    id {id_type},
                    scanned_at {timestamp_type} NOT NULL,
                    file_count INTEGER NOT NULL,
                    secrets_found INTEGER NOT NULL,
                    vulnerabilities_found INTEGER NOT NULL,
                    safety_score REAL NOT NULL
                )
            """)
            
            # Table for compiled reports
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS compiled_reports (
                    report_id VARCHAR(255) PRIMARY KEY,
                    report_type VARCHAR(50) NOT NULL,
                    filepath VARCHAR(500) NOT NULL,
                    created_at {timestamp_type} NOT NULL
                )
            """)
            
            conn.commit()
        finally:
            conn.close()

    @classmethod
    def execute_write(cls, query: str, params: tuple = ()):
        """Helper to execute write query with database dialect translation."""
        is_pg = cls.is_postgres()
        if is_pg:
            # Replace placeholder ? with %s
            query = query.replace("?", "%s")
            # Replace SQLite INSERT OR REPLACE with PostgreSQL equivalent
            if "INSERT OR REPLACE INTO compiled_reports" in query:
                query = """
                    INSERT INTO compiled_reports (report_id, report_type, filepath, created_at)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (report_id) DO UPDATE SET
                        report_type = EXCLUDED.report_type,
                        filepath = EXCLUDED.filepath,
                        created_at = EXCLUDED.created_at
                """
        
        conn = cls.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
        finally:
            conn.close()

    @classmethod
    def execute_read(cls, query: str, params: tuple = ()) -> list:
        """Helper to execute read query with database dialect translation."""
        is_pg = cls.is_postgres()
        if is_pg:
            query = query.replace("?", "%s")
        
        conn = cls.get_connection()
        try:
            if is_pg:
                import psycopg2.extras
                cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            else:
                cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()

    @classmethod
    def log_step(cls, agent_name: str, step_name: str, message: str, status: str = "SUCCESS"):
        """Logs a single processing step in the database."""
        timestamp = datetime.now().isoformat()
        cls.execute_write(
            "INSERT INTO audit_logs (timestamp, agent_name, step_name, message, status) VALUES (?, ?, ?, ?, ?)",
            (timestamp, agent_name, step_name, message, status)
        )

    @classmethod
    def save_security_scan(cls, file_count: int, secrets_found: int, vulnerabilities_found: int, safety_score: float):
        """Saves a summary of a security audit run."""
        timestamp = datetime.now().isoformat()
        cls.execute_write(
            "INSERT INTO security_scans (scanned_at, file_count, secrets_found, vulnerabilities_found, safety_score) VALUES (?, ?, ?, ?, ?)",
            (timestamp, file_count, secrets_found, vulnerabilities_found, safety_score)
        )

    @classmethod
    def save_compiled_report(cls, report_id: str, report_type: str, filepath: str):
        """Registers a compiled report artifact in the system."""
        timestamp = datetime.now().isoformat()
        cls.execute_write(
            "INSERT OR REPLACE INTO compiled_reports (report_id, report_type, filepath, created_at) VALUES (?, ?, ?, ?)",
            (report_id, report_type, filepath, timestamp)
        )

    @classmethod
    def get_audit_logs(cls, limit: int = 100):
        """Retrieves a list of recent audit logs."""
        return cls.execute_read("SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?", (limit,))

    @classmethod
    def get_security_scans(cls, limit: int = 50):
        """Retrieves a list of recent security scan summaries."""
        return cls.execute_read("SELECT * FROM security_scans ORDER BY id DESC LIMIT ?", (limit,))

    @classmethod
    def get_compiled_reports(cls):
        """Retrieves all registered compiled reports."""
        return cls.execute_read("SELECT * FROM compiled_reports ORDER BY created_at DESC")

# Auto-initialize database schema when db module is imported
Database.init_db()
