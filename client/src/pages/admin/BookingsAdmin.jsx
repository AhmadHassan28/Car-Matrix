import { useState, useEffect } from 'react';
import api from '../../api/axios';

const STATUS_COLORS = { Confirmed: '#34C759', Pending: 'var(--gold)', Completed: 'var(--text-secondary)', Cancelled: '#FF3B30' };

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/bookings').then(r => setBookings(r.data)).catch(() => setBookings([])).finally(() => setLoading(false));
  }, []);

  const handleComplete = async (id) => {
    const method = prompt('Payment method? (Cash/Card/JazzCash/EasyPaisa)', 'Cash');
    if (!method) return;
    try {
      await api.put(`/bookings/${id}/complete`, { payment_method: method, amount_paid: bookings.find(b => b.booking_id === id)?.total_amount });
      const { data } = await api.get('/admin/bookings');
      setBookings(data);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      const { data } = await api.get('/admin/bookings');
      setBookings(data);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const tabs = ['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];
  const filtered = bookings.filter(b => {
    const matchStatus = filter === 'all' || b.booking_status === filter;
    const matchSearch = `${b.customer_name} ${b.car_name} ${b.booking_id}`.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ padding: '32px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Bookings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{bookings.length} total bookings</p>
      </div>

      {/* Tabs + search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg-elevated)', borderRadius: 10, padding: 3 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{
                padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: filter === t ? 600 : 400,
                background: filter === t ? 'var(--bg-card)' : 'transparent',
                color: filter === t ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'all 0.15s', textTransform: t === 'all' ? 'none' : 'capitalize',
              }}>{t === 'all' ? 'All' : t} {t !== 'all' && `(${bookings.filter(b => b.booking_status === t).length})`}</button>
          ))}
        </div>
        <input className="input-base" style={{ maxWidth: 260, fontSize: 13, marginLeft: 'auto' }} placeholder="Search customer, car, ID..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Customer', 'Car', 'Dates', 'Days', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {[1,2,3,4,5,6,7,8,9].map(j => <td key={j} style={{ padding: '14px' }}><div className="skeleton" style={{ height: 13 }} /></td>)}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No bookings found</td></tr>
              ) : filtered.map(b => {
                const days = Math.ceil((new Date(b.end_date) - new Date(b.start_date)) / 86400000);
                const color = STATUS_COLORS[b.booking_status] || 'var(--text-secondary)';
                return (
                  <tr key={b.booking_id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '13px 14px', fontSize: 12, color: 'var(--text-muted)' }}>#{b.booking_id}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{b.customer_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.customer_email}</div>
                    </td>
                    <td style={{ padding: '13px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>{b.car_name}</td>
                    <td style={{ padding: '13px 14px', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{b.start_date}<br />{b.end_date}</td>
                    <td style={{ padding: '13px 14px', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>{days}</td>
                    <td style={{ padding: '13px 14px', fontSize: 13, fontWeight: 600, color: 'var(--gold)', whiteSpace: 'nowrap' }}>Rs. {Number(b.total_amount).toLocaleString()}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: b.payment_status === 'Completed' ? 'rgba(52,199,89,0.1)' : 'rgba(201,168,76,0.1)', color: b.payment_status === 'Completed' ? '#34C759' : 'var(--gold)' }}>
                        {b.payment_status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.04em', background: `${color}18`, color }}>
                        {b.booking_status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {b.booking_status === 'Confirmed' && (
                          <button onClick={() => handleComplete(b.booking_id)}
                            style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(52,199,89,0.3)', background: 'rgba(52,199,89,0.06)', color: '#34C759', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                            Complete
                          </button>
                        )}
                        {['Confirmed', 'Pending'].includes(b.booking_status) && (
                          <button onClick={() => handleCancel(b.booking_id)}
                            style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,59,48,0.2)', background: 'rgba(255,59,48,0.06)', color: '#FF3B30', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                            Cancel
                          </button>
                        )}
                        {!['Confirmed', 'Pending'].includes(b.booking_status) && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
