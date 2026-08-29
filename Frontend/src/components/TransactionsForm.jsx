import React, { useState } from 'react'
import { scoreTxn } from '../api'

export default function TransactionForm({ onResult, lastResult }) {
  const [form, setForm] = useState({
    amount: 4200, hour_of_day: 14, account_age_days: 365,
    txn_last_24h: 2, addr_mismatch: 0,
  })
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: Number(e.target.value) })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await scoreTxn(form)
    setLoading(false)
    onResult(res)
  }

  const color = lastResult
    ? lastResult.decision === 'BLOCK' ? '#ff5c5c'
    : lastResult.decision === 'REVIEW' ? '#f5c518' : '#3ddc84'
    : null

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>⚡ Transaction Risk Scorer</h3>
      <form onSubmit={submit}>
        <label style={styles.label}>Amount (₹)</label>
        <input style={styles.input} type="number" value={form.amount} onChange={set('amount')} />
        <label style={styles.label}>Hour of Day (0–23)</label>
        <input style={styles.input} type="number" min="0" max="23" value={form.hour_of_day} onChange={set('hour_of_day')} />
        <label style={styles.label}>Account Age (days)</label>
        <input style={styles.input} type="number" value={form.account_age_days} onChange={set('account_age_days')} />
        <label style={styles.label}>Transactions Last 24h</label>
        <input style={styles.input} type="number" value={form.txn_last_24h} onChange={set('txn_last_24h')} />
        <label style={styles.label}>Shipping ≠ Billing Address</label>
        <select style={styles.input} value={form.addr_mismatch} onChange={set('addr_mismatch')}>
          <option value={0}>No</option><option value={1}>Yes</option>
        </select>
        <button style={styles.button} disabled={loading}>
          {loading ? 'Scoring…' : 'Score Transaction'}
        </button>
      </form>

      {lastResult && (
        <div style={{ ...styles.result, borderColor: color }}>
          <b style={{ color, fontSize: 20 }}>{lastResult.decision} — Risk {lastResult.risk_score}/100</b>
          <ul style={styles.reasons}>
            {lastResult.reasons.map(r => <li key={r}>{r}</li>)}
            {lastResult.reasons.length === 0 && <li>No risk signals detected</li>}
          </ul>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: { background: '#17171b', border: '1px solid #26262c', borderRadius: 14, padding: 24, marginTop: 8 },
  title: { color: '#f5c518', fontSize: 16, marginTop: 0 },
  label: { display: 'block', fontSize: 13, color: '#9a9aa0', margin: '12px 0 4px' },
  input: { width: '100%', padding: 10, background: '#0f0f13', border: '1px solid #2e2e36', borderRadius: 8, color: '#eaeaea', boxSizing: 'border-box' },
  button: { width: '100%', marginTop: 18, padding: 12, background: '#f5c518', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' },
  result: { marginTop: 18, padding: 16, borderRadius: 8, border: '1px solid', background: '#101014' },
  reasons: { color: '#9a9aa0', marginTop: 8, paddingLeft: 18 },
}
