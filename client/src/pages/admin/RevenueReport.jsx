import { useState } from 'react';
import api from '../../api/axios';

function StatBox({ label, value, color = 'var(--gold)' }) {
  return (
    <div className="card" style={{ padding: '20px 22px' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: 'Playfair Display, serif' }}>{value}</div>
    </div>
  );
}

export default function RevenueReport() {
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo]   = useState(today);
  const [report, setReport] = useState(null);
  const [byCategory, setByCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);

  const runReport = async () => {
    setLoading(true); setRan(true);
    try {
      const { data } = await api.get('/admin/revenue', { params: { from_date: from, to_date: to } });
      setReport(data.summary);
      setByCategory(data.by_category || []);
    } catch {
      setReport(null); setByCategory([]);
    } finally { setLoading(false); }
  };

  const presets = [
    { label: 'This month', from: firstOfMonth, to: today },
    { label: 'Last 7 days', from: new Date(Date.now() - 7*86400000).toISOString().split('T')[0], to: today },
    { label: 'This year', from: `${new Date().getFullYear()}-01-01`, to: today },
  ];

  const maxRev = Math.max(...byCategory.map(c => c.revenue || 0), 1);

  return (
    <div style={{ padding: '32px 32px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Revenue Report</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Run financial reports via sp_RevenueReport stored procedure</p>
      </div>

      {/* Date range */}
      <div className="card" style={{ padding: 22, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Presets */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {presets.map(p => (
              <button key={p.label} onClick={() => { setFrom(p.from); setTo(p.to); }}
                style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${from === p.from && to === p.to ? 'var(--gold-dim)' : 'var(--border)'}`, background: from === p.from && to === p.to ? 'rgba(201,168,76,0.08)' : 'transparent', color: from === p.from && to === p.to ? 'var(--gold)' : 'var(--text-secondary)', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {[['From', from, setFrom], ['To', to, setTo]].map(([lbl, val, setter]) => (
              <div key={lbl}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</label>
                <input className="input-base" type="date" value={val} onChange={e => setter(e.target.value)} style={{ fontSize: 13, width: 160 }} />
              </div>
            ))}
            <button className="btn-gold" onClick={runReport} style={{ padding: '11px 24px', fontSize: 13 }} disabled={loading}>
              {loading ? 'Running...' : 'Run Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {!ran ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
          Select a date range and click Run Report
        </div>
      ) : loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="card skeleton" style={{ height: 90 }} />)}
        </div>
      ) : !report ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: 13 }}>No data found for the selected range</div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 28 }} className="fade-up">
            <StatBox label="Total Bookings"     value={report.total_bookings ?? 0} color="var(--text-primary)" />
            <StatBox label="Gross Revenue"      value={`Rs. ${Number(report.gross_revenue ?? 0).toLocaleString()}`} />
            <StatBox label="Tax Collected"      value={`Rs. ${Number(report.total_tax ?? 0).toLocaleString()}`} color="var(--text-secondary)" />
            <StatBox label="Net + Tax"          value={`Rs. ${Number(report.net_revenue_with_tax ?? 0).toLocaleString()}`} color="#34C759" />
            <StatBox label="Avg Booking Value"  value={`Rs. ${Number(report.avg_booking_value ?? 0).toLocaleString()}`} color="var(--text-secondary)" />
            <StatBox label="Total Rental Days"  value={report.total_rental_days ?? 0} color="var(--text-secondary)" />
          </div>

          {/* By category bar chart */}
          {byCategory.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20, fontFamily: 'DM Sans, sans-serif' }}>Revenue by Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {byCategory.map(c => {
                  const pct = Math.round((c.revenue / maxRev) * 100);
                  return (
                    <div key={c.category_name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
                        <span style={{ fontWeight: 500 }}>{c.category_name}</span>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.bookings} bookings</span>
                          <span style={{ fontWeight: 600, color: 'var(--gold)', minWidth: 100, textAlign: 'right' }}>Rs. {Number(c.revenue).toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--gold-dim), var(--gold))', borderRadius: 4, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
