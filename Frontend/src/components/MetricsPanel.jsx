export default function MetricsPanel({ metrics }) {
  if (!metrics) return null
  const cards = [
    { label: 'Precision', value: `${(metrics.precision * 100).toFixed(1)}%` },
    { label: 'Recall', value: `${(metrics.recall * 100).toFixed(1)}%` },
    { label: 'FP Rate', value: `${(metrics.fp_rate * 100).toFixed(2)}%` },
    { label: 'Avg FP Cost', value: `₹${Math.round(metrics.avg_fp_cost)}` },
  ]
  return (
    <div style={styles.row}>
      {cards.map(c => (
        <div key={c.label} style={styles.card}>
          <b style={styles.val}>{c.value}</b>
          <small style={styles.label}>{c.label}</small>
        </div>
      ))}
    </div>
  )
}

const styles = {
  row: { display: 'flex', gap: 16, marginBottom: 24 },
  card: { flex: 1, background: '#17171b', border: '1px solid #26262c', borderRadius: 12, padding: '18px 0', textAlign: 'center' },
  val: { display: 'block', fontSize: 26, color: '#f5c518' },
  label: { color: '#9a9aa0' },
}
