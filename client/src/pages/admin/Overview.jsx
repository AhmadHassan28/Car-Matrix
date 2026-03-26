import { useState, useEffect } from 'react';
import api from '../../api/axios';

function StatCard({ label, value, sub, color = 'var(--gold)', delay = 0 }) {
  return (
    <div className="card" style={{
      padding: '22px 24px', transition: 'border-color 0.2s',
      animation: `fadeUp 0.4s ease ${delay}s both`,
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: 'Playfair Display, serif', marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

function BookingRow({ b }) {
  const colors = { Confirmed: '#34C759', Pending: 'var(--gold)', Completed: 'var(--text-secondary)', Cancelled: '#FF3B30' };
  return (
    <tr style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>#{b.booking_id}</td>
      <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500 }}>{b.customer_name}</td>
      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{b.car_name}</td>
      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{b.start_date} → {b.end_date}</td>
      <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>Rs. {Number(b.total_amount).toLocaleString()}</td>
      <td style={{ padding: '13px 16px' }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.04em', background: `${colors[b.booking_status]}18`, color: colors[b.booking_status] || 'var(--text-secondary)' }}>
          {b.booking_status}
        </span>
      </td>
    </tr>
  );
}

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/bookings?limit=8'),
    ]).then(([s, b]) => {
      setStats(s.data);
      setBookings(b.data);
    }).catch(() => {
      // Fallback demo data if API not ready
      setStats({ total_bookings: 0, total_revenue: 0, active_cars: 0, total_customers: 0 });
      setBookings([]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px 32px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          {[1,2,3,4].map(i => <div key={i} className="card skeleton" style={{ height: 100 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
          <StatCard label="Total Bookings"   value={stats?.total_bookings ?? 0}  sub="All time" delay={0} />
          <StatCard label="Total Revenue"    value={`Rs. ${Number(stats?.total_revenue ?? 0).toLocaleString()}`} sub="Completed bookings" delay={0.05} />
          <StatCard label="Active Cars"      value={stats?.active_cars ?? 0}     sub="Available now" color="#34C759" delay={0.1} />
          <StatCard label="Total Customers"  value={stats?.total_customers ?? 0} sub="Registered users" color="var(--text-primary)" delay={0.15} />
        </div>
      )}

      {/* Recent bookings table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 15, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>Recent Bookings</h2>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Latest 8</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Customer', 'Car', 'Dates', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No bookings yet</td></tr>
              ) : bookings.map(b => <BookingRow key={b.booking_id} b={b} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
