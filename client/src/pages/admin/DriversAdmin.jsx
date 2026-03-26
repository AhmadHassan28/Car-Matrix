import { useState, useEffect } from 'react';
import api from '../../api/axios';

const EMPTY = { name: '', phone: '', license_number: '', charge_per_day: '' };

export default function DriversAdmin() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fetchDrivers = () => {
    api.get('/admin/drivers').then(r => setDrivers(r.data)).catch(() => setDrivers([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.post('/admin/drivers', form);
      setShowForm(false); setForm(EMPTY); fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add driver');
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/admin/drivers/${id}/status`, { availability_status: status });
      fetchDrivers();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const STATUS_COLORS = { Available: '#34C759', 'On Trip': 'var(--gold)', Inactive: '#FF3B30' };

  return (
    <div style={{ padding: '32px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Driver Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{drivers.length} registered drivers</p>
        </div>
        <button className="btn-gold" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => { setShowForm(!showForm); setError(''); }}>
          {showForm ? '× Cancel' : '+ Add Driver'}
        </button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 18, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif' }}>New Driver Details</h3>
          {error && <div style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#FF3B30', fontSize: 13 }}>{error}</div>}
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 16 }}>
              {[
                { key: 'name', label: 'Full name', placeholder: 'Usman Tariq' },
                { key: 'phone', label: 'Phone', placeholder: '03001234567' },
                { key: 'license_number', label: 'License no.', placeholder: 'LHR-D-9876' },
                { key: 'charge_per_day', label: 'Charge per day (Rs.)', placeholder: '800', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>{f.label}</label>
                  <input className="input-base" style={{ fontSize: 13 }} type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]} onChange={e => setF(f.key, e.target.value)} required />
                </div>
              ))}
            </div>
            <button type="submit" className="btn-gold" style={{ padding: '10px 28px', fontSize: 13 }} disabled={saving}>
              {saving ? 'Adding...' : 'Add Driver'}
            </button>
          </form>
        </div>
      )}

      {/* Drivers grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {loading ? (
          [1,2,3,4,5,6].map(i => <div key={i} className="card skeleton" style={{ height: 140 }} />)
        ) : drivers.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
            No drivers registered yet
          </div>
        ) : drivers.map(d => {
          const sc = STATUS_COLORS[d.availability_status] || 'var(--text-secondary)';
          return (
            <div key={d.driver_id} className="card" style={{ padding: 20, transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👨‍✈️</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{d.phone}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: `${sc}18`, color: sc, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {d.availability_status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>
                <span>License: {d.license_number}</span>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Rs. {Number(d.charge_per_day).toLocaleString()}/day</span>
              </div>

              <select
                value={d.availability_status}
                onChange={e => handleStatusChange(d.driver_id, e.target.value)}
                style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}>
                <option>Available</option>
                <option>On Trip</option>
                <option>Inactive</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
