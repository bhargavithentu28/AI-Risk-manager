import sqlite3, os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "risk.db")

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        hour_of_day INTEGER,
        account_age_days INTEGER,
        txn_last_24h INTEGER,
        addr_mismatch INTEGER,
        risk_score REAL,
        decision TEXT,
        created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS model_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        precision REAL, recall REAL, fp_rate REAL,
        avg_fp_cost REAL, evaluated_at TEXT
    );
    """)
    conn.commit()
    conn.close()
