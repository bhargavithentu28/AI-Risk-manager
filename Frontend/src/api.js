const BASE = 'http://localhost:8000/api'

export const scoreTxn = (data) =>
  fetch(`${BASE}/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const getMetrics = () => fetch(`${BASE}/metrics`).then(r => r.json())
export const getTxns = () => fetch(`${BASE}/transactions`).then(r => r.json())
