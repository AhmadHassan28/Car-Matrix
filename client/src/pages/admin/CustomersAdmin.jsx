import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/customers').then(r => setCustomers(r.data)).catch(() => setCustomers([])).finally(() => setLoading(false));
  }, []);

  const toggleActive = async (userId, current) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { is_active: !current });
      const { data } = await api.get('/admin/customers');
      setCustomers(data);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const filtered = customers.filter(c =>
    `${c.name} ${c.email} ${c.cnic} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div style={{ padding: '32px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Customers</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{customers.length} registered customers</p>
      </div>

      <input className="input-base" style={{ maxWidth: 320, fontSize: 13, marginBottom: 20 }} placeholder="Search by name, email, CNIC..." value={search} onChange={e => setSearch(e.target.value)} />

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                {['Customer', 'CNIC', 'Phone', 'Registered', 'Bookings', 'Student', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4].map(i => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {[1,2,3,4,5,6,7,8].map(j => <td key={j} style={{ padding: '14px 16px' }}><div className="skeleton" style={{ height: 13 }} /></td>)}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No customers found</td></tr>
              ) : filtered.map(c => (
                <tr key={c.user_id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--gold)', flexShrink: 0 }}>
                        {initials(c.name)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{c.cnic}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{c.phone}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {c.registration_date ? new Date(c.registration_date).toLocaleDateString('en-PK') : '—'}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--gold)', fontWeight: 600, textAlign: 'center' }}>{c.booking_count || 0}</td>
                  <td style={{ padding: '13px 16px' }}>
                    {c.student_status ? (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(88,86,214,0.12)', color: '#5856D6', fontWeight: 600 }}>Yes</span>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>No</span>
                    )}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: c.is_active ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)', color: c.is_active ? '#34C759' : '#FF3B30' }}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <button onClick={() => toggleActive(c.user_id, c.is_active)}
                      style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${c.is_active ? 'rgba(255,59,48,0.2)' : 'rgba(52,199,89,0.2)'}`, background: c.is_active ? 'rgba(255,59,48,0.06)' : 'rgba(52,199,89,0.06)', color: c.is_active ? '#FF3B30' : '#34C759', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      {c.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
