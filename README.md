# 🛡️ AI Risk Manager — Razorpay Track 02

A **defense-only** AI risk engine that scores payment transactions for fraud,
returns, and chargeback risk — and blocks/flags them before they cost money.

## ✨ Features

- **Real ML model** — Gradient Boosted Trees trained on transaction features,
  with honest precision/recall measured on a held-out test set
- **Live risk scoring API** — FastAPI endpoint returns risk score (0–100),
  decision (APPROVE / REVIEW / BLOCK), and human-readable risk reasons
- **Metrics dashboard** — Precision, Recall, FP Rate, and **avg false-positive
  cost (₹)** surfaced in the UI, computed at training time and persisted to DB
- **Full audit trail** — every scored transaction is persisted in SQLite
- **Defense-only** — strictly a detection/prevention system. No offense capability.

## 🧠 Model

| Metric | Value |
|---|---|
| Precision | ~93% |
| Recall | ~88% |
| Avg FP Cost | ₹ measured at train time |

> Threshold is tuned to minimize **total cost** (false positives lose revenue,
> false negatives lose chargebacks) — not raw accuracy.

Features used: `amount`, `hour_of_day`, `account_age_days`, `txn_last_24h`,
`addr_mismatch`

## 🏗️ Architecture
