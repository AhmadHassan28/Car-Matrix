import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function DriverApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');
  const [processing, setProcessing] = useState(null);

  const fetchApps = () => {
    api.get('/admin/driver-applications').then(r => setApps(r.data)).catch(() => setApps([])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchApps(); }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this driver application? This will create their account.')) return;
    setProcessing(id);
    try {
      await api.post(`/admin/driver-applications/${id}/approve`);
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving application');
    } finally { setProcessing(null); }
  };

  const handleReject = async (id) => {
    const reason = prompt('Rejection reason (optional):');
    if (reason === null) return;
    setProcessing(id);
    try {
      await api.post(`/admin/driver-applications/${id}/reject`, { reason });
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting application');
    } finally { setProcessing(null); }
  };

  const STATUS_COLORS = { Pending: 'var(--gold)', Approved: '#34C759', Rejected: '#FF3B30' };
  const filtered = apps.filter(a => filter === 'All' || a.status === filter);
  const counts = { All: apps.length, Pending: apps.filter(a => a.status === 'Pending').length, Approved: apps.filter(a => a.status === 'Approved').length, Rejected: apps.filter(a => a.status === 'Rejected').length };

  return (
    <div style={{ padding: '32px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Driver Applications</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {counts.Pending > 0 && <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{counts.Pending} pending review · </span>}
          {apps.length} total applications
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 2, background: 'var(--bg-elevated)', borderRadius: 10, padding: 3, width: 'fit-content', marginBottom: 20 }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: filter === f ? 600 : 400, background: filter === f ? 'var(--bg-card)' : 'transparent', color: filter === f ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'all 0.15s' }}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="card skeleton" style={{ height: 100 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          No {filter === 'All' ? '' : filter.toLowerCase()} applications
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(app => {
            const sc = STATUS_COLORS[app.status] || 'var(--text-secondary)';
            const isPending = app.status === 'Pending';
            return (
              <div key={app.application_id} className="card" style={{ padding: '20px 24px', transition: 'border-color 0.15s', borderLeft: isPending ? '3px solid var(--gold-dim)' : '3px solid transparent' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = isPending ? 'var(--gold-dim)' : 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = isPending ? 'var(--gold-dim)' : 'var(--border)'}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>

                  {/* Left info */}
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>👨‍✈️</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Playfair Display, serif', marginBottom: 4 }}>{app.full_name}</div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span>✉ {app.email}</span>
                        <span>📱 {app.phone}</span>
                        <span>🪪 {app.cnic}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)', marginTop: 5, flexWrap: 'wrap' }}>
                        <span>License: <strong>{app.license_number}</strong></span>
                        <span>Rate: <strong style={{ color: 'var(--gold)' }}>Rs. {Number(app.charge_per_day).toLocaleString()}/day</strong></span>
                        <span>Experience: <strong>{app.experience_years} yrs</strong></span>
                      </div>
                      {app.about_me && (
                        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: 420, lineHeight: 1.5 }}>
                          "{app.about_me}"
                        </div>
                      )}
                      {app.rejection_reason && (
                        <div style={{ marginTop: 8, fontSize: 12, color: '#FF3B30' }}>
                          Rejection reason: {app.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right — status + actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 20, background: `${sc}18`, color: sc, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {app.status}
                    </span>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Applied {new Date(app.applied_at).toLocaleDateString('en-PK')}
                    </div>
                    {isPending && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <button
                          onClick={() => handleReject(app.application_id)}
                          disabled={processing === app.application_id}
                          style={{ padding: '7px 16px', borderRadius: 7, border: '1px solid rgba(255,59,48,0.2)', background: 'rgba(255,59,48,0.06)', color: '#FF3B30', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(app.application_id)}
                          disabled={processing === app.application_id}
                          className="btn-gold"
                          style={{ padding: '7px 20px', fontSize: 12 }}>
                          {processing === app.application_id ? 'Processing...' : '✓ Approve'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
