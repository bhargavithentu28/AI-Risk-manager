import React, { useEffect, useState } from 'react'
import TransactionForm from './components/TransactionForm'
import MetricsPanel from './components/MetricsPanel'
import TransactionsTable from './components/TransactionsTable'
import { getMetrics, getTxns } from './api'

export default function App() {
  const [metrics, setMetrics] = useState(null)
  const [txns, setTxns] = useState([])
  const [lastResult, setLastResult] = useState(null)

  const refresh = async () => {
    setMetrics(await getMetrics())
    setTxns(await getTxns())
  }

  useEffect(() => { refresh() }, [])

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Risk<span style={{ color: '#f5c518' }}>Engine</span></h1>
        <span style={styles.tag}>RAZORPAY TRACK 02 — AI RISK MANAGER</span>
      </header>

      <p style={styles.hero}>
        Defense-only ML that scores transactions for fraud, returns & chargeback risk —
        with honest measured metrics on a held-out test set.
      </p>

      <MetricsPanel metrics={metrics} />
      <div style={styles.grid}>
        <TransactionForm
          onResult={(r) => { setLastResult(r); refresh() }}
          lastResult={lastResult}
        />
        <TransactionsTable txns={txns} />
      </div>
      <footer style={styles.footer}>Strictly defense-only. No offense capability. Built for Razorpay Internship Track 02.</footer>
    </div>
  )
}

const styles = {
  page: { background: '#0d0d0f', color: '#eaeaea', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: '0 5%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0', borderBottom: '1px solid #222' },
  logo: { fontSize: 22, margin: 0 },
  tag: { color: '#f5c518', fontSize: 12, letterSpacing: 2 },
  hero: { color: '#9a9aa0', maxWidth: 640, lineHeight: 1.6, margin: '28px 0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  footer: { color: '#666', fontSize: 13, padding: '32px 0', borderTop: '1px solid #222', marginTop: 40 },
}
