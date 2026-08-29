export default function TransactionsTable({ txns }) {
  const badgeColor = (d) => d === 'BLOCK' ? '#ff5c5c' : d === 'REVIEW' ? '#f5c518' : '#3ddc84'
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📋 Scored Transactions (persisted in DB)</h3>
      <table style={styles.table}>
        <thead><tr style={{ color: '#9a9aa0' }}>
          <th>ID</th><th>Amount</th><th>Risk</th><th>Decision</th><th>Time</th>
        </tr></thead>
        <tbody>
          {txns.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>₹{t.amount.toLocaleString()}</td>
              <td>{t.risk_score}</td>
              <td style={{ color: badgeColor(t.decision), fontWeight: 700 }}>{t.decision}</td>
              <td style={{ color: '#666' }}>{t.created_at?.slice(0, 19).replace('T', ' ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  card: { background: '#17171b', border: '1px solid #26262c', borderRadius: 14, padding: 24, marginTop: 8, overflowX: 'auto' },
  title: { color: '#f5c518', fontSize: 16, marginTop: 0 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
}
