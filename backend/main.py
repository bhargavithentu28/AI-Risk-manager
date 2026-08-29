from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from database import init_db, get_conn
from risk.predictor import predict

app = FastAPI(title="AI Risk Manager API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

init_db()

class Txn(BaseModel):
    amount: float
    hour_of_day: int
    account_age_days: int
    txn_last_24h: int
    addr_mismatch: int

@app.get("/api/metrics")
def metrics():
    conn = get_conn()
    row = conn.execute("SELECT * FROM model_metrics ORDER BY id DESC LIMIT 1").fetchone()
    conn.close()
    if row:
        return dict(row)
    return {"precision": 0, "recall": 0, "fp_rate": 0, "avg_fp_cost": 0}

@app.post("/api/score")
def score(txn: Txn):
    features = txn.dict()
    prob, decision, reasons = predict(features)
    conn = get_conn()
    conn.execute(
        "INSERT INTO transactions (amount, hour_of_day, account_age_days, txn_last_24h, addr_mismatch, risk_score, decision, created_at) VALUES (?,?,?,?,?,?,?,?)",
        (txn.amount, txn.hour_of_day, txn.account_age_days, txn.txn_last_24h, txn.addr_mismatch, prob, decision, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()
    return {"risk_score": round(prob * 100, 1), "decision": decision, "reasons": reasons}

@app.get("/api/transactions")
def recent(limit: int = 20):
    conn = get_conn()
    rows = conn.execute("SELECT * FROM transactions ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]
