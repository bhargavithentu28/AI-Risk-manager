import os
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, classification_report, confusion_matrix
import joblib

DATA_PATH = "data/transactions.csv"
MODEL_PATH = "models/fraud_model.pkl"

def generate_synthetic_data(n=20000):
    """Generates realistic fraud data. with the Kaggle creditcard.csv
    (https://www.kaggle.comatasets/mlg-ulb/creditcardfraud) real data —
    keep the same column names and everything else works unchanged."""
    rng = np.random.default_rng(42)
    n_fraud = int(n * 0.03)
    legit = pd.DataFrame({
        "amount": rng.lognormal(6, 1, n - n_fraud).round(2),
        "hour_of_day": rng.integers(0, 24, n - n_fraud),
        "account_age_days": rng.integers(30, 3000, n - n_fraud),
        "txn_last_24h": rng.poisson(3, n - n_fraud),
        "addr_mismatch": rng.binomial(1, 0.05, n - n_fraud),
        "is_fraud": 0,
    })
    fraud = pd.DataFrame({
        "amount": rng.lognormal(8.5, 1, n_fraud).round(2),
        "hour_of_day": rng.choice([0,1,2,3,23], n_fraud),
        "account_age_days": rng.integers(0, 10, n_fraud),
        "txn_last_24h": rng.poisson(12, n_fraud),
        "addr_mismatch": rng.binomial(1, 0.7, n_fraud),
        "is_fraud": 1,
    })
    df = pd.concat([legit, fraud]).sample(frac=1, random_state=42)
    os.makedirs("data", exist_ok=True)
    df.to_csv(DATA_PATH, index=False)
    return df

def main():
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
    else:
        df = generate_synthetic_data()

   features = ["amount", "hour_of_day", "account_age_days", "txn_last_24h", "addr_mismatch"]
    X, y = df[features], df["is_fraud"]

    # Held-out test set — never touched during training
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    model = GradientBoostingClassifier(n_estimators=200, max_depth=4, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()

    print("=== Held-Out Test Metrics ===")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"False positives: {fp} of {tn+fp} legit txns  (FP rate {fp/(tn+fp):.4f})")
    print(f"Estimated avg FP cost: ₹{df[df.is_fraud==0]['amount'].mean():.0f} per blocked legit txn")
    print(classification_report(y_test, y_pred))

    os.makedirs("models", exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved → {MODEL_PATH}")

if __name__ == "__main__":
    main()
