import joblib, os
from datetime import datetime

FEATURES = ["amount", "hour_of_day", "account_age_days", "txn_last_24h", "addr_mismatch"]
_model = None

def get_model():
    global _model
    if _model is None:
        path = os.path.join(os.path.dirname(__file__), "..", "models", "fraud_model.pkl")
        _model = joblib.load(path)
    return _model

def predict(features: dict):
    """Returns (risk_probability, decision, reasons)."""
    x = [[features[f] for f in FEATURES]]
    prob = float(get_model().predict_proba(x)[0][1])
    if prob >= 0.6:
        decision = "BLOCK"
    elif prob >= 0.3:
        decision = "REVIEW"
    else:
        decision = "APPROVE"

    reasons = []
    if features["amount"] > 50000: reasons.append("High transaction amount")
    if features["account_age_days"] < 7: reasons.append("Very new account")
    if features["txn_last_24h"] > 8: reasons.append("Unusual transaction velocity")
    if features["addr_mismatch"]: reasons.append("Shipping/billing mismatch")
    if 0 <= features["hour_of_day"] <= 4: reasons.append("Odd-hour transaction")
    return prob, decision, reasons
