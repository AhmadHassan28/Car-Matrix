import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const STATUS_COLORS = { Available: '#34C759', 'On Trip': 'var(--gold)', Inactive: '#FF3B30' };

function StatCard({ label, value, color = 'var(--gold)' }) {
  return (
    <div className="card" style={{ padding: '20px 22px', transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: 'Playfair Display, serif' }}>{value}</div>
    </div>
  );
}

export default function DriverDashboard() {
  const { user } = useAuth();
  const _navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  

  useEffect(() => {
    Promise.all([
      api.get('/drivers/me'),
      api.get('/drivers/me/trips'),
    ]).then(([p, t]) => {
      setProfile(p.data);
      setTrips(t.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.patch('/drivers/me/status', { availability_status: newStatus });
      setProfile(p => ({ ...p, availability_status: newStatus }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    } finally { setUpdatingStatus(false); }
  };

  const stars = (rating) => [1,2,3,4,5].map(s => (
    <span key={s} style={{ fontSize: 13, color: s <= Math.round(rating) ? 'var(--gold)' : 'var(--text-muted)' }}>★</span>
  ));

  const TRIP_STATUS_COLORS = { Confirmed: '#34C759', Completed: 'var(--text-secondary)', Cancelled: '#FF3B30' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>Driver Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Welcome back, <span style={{ color: 'var(--gold-light)' }}>{user?.name?.split(' ')[0]}</span>
            </p>
          </div>

          {/* Availability toggle */}
          {profile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Status:</span>
              <select
                value={profile.availability_status}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                style={{
                  background: 'var(--bg-elevated)', border: `1px solid ${STATUS_COLORS[profile.availability_status] || 'var(--border)'}44`,
                  borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600,
                  color: STATUS_COLORS[profile.availability_status] || 'var(--text-primary)',
                  cursor: 'pointer', outline: 'none',
                }}>
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
            {[1,2,3,4].map(i => <div key={i} className="card skeleton" style={{ height: 90 }} />)}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginBottom: 28 }} className="fade-up">
              <StatCard label="Total Trips"    value={profile?.total_trips ?? 0}    color="var(--text-primary)" />
              <StatCard label="Avg Rating"     value={profile?.avg_rating ? `${Number(profile.avg_rating).toFixed(1)} ★` : 'N/A'} />
              <StatCard label="Total Ratings"  value={profile?.total_ratings ?? 0}  color="var(--text-secondary)" />
              <StatCard label="Est. Earnings"  value={`Rs. ${Number(profile?.total_earnings ?? 0).toLocaleString()}`} color="#34C759" />
            </div>

            {/* Profile card + trips side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

              {/* Profile card */}
              <div className="card" style={{ padding: 22 }}>
                <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28 }}>👨‍✈️</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{profile?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{profile?.email}</div>
                  {profile?.avg_rating > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 4 }}>
                      {stars(profile.avg_rating)}
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 4 }}>{Number(profile.avg_rating).toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {[
                  ['Phone',       profile?.phone],
                  ['License',     profile?.license_number],
                  ['Daily rate',  `Rs. ${Number(profile?.charge_per_day ?? 0).toLocaleString()}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}

                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Availability</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[profile?.availability_status] || 'var(--text-muted)' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: STATUS_COLORS[profile?.availability_status] || 'var(--text-secondary)' }}>
                      {profile?.availability_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trips list */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>My Trips</h3>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{trips.length} total</span>
                </div>
                {trips.length === 0 ? (
                  <div style={{ padding: '52px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🚗</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No trips assigned yet. Make sure your status is set to <strong>Available</strong>.</p>
                  </div>
                ) : (
                  <div>
                    {trips.map(t => {
                      const tc = TRIP_STATUS_COLORS[t.booking_status] || 'var(--text-secondary)';
                      const days = Math.ceil((new Date(t.end_date) - new Date(t.start_date)) / 86400000);
                      const _earning = Number(t.base_price * 0.2 + (t.driver_id === profile?.driver_id ? (profile?.charge_per_day * days) : 0)).toLocaleString();
                      return (
                        <div key={t.booking_id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🚗</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{t.car_name || 'Car'}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                {t.customer_name} · {t.start_date} → {t.end_date} · {days} days
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: `${tc}18`, color: tc, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                              {t.booking_status}
                            </span>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#34C759' }}>
                              Rs. {Number(profile?.charge_per_day * days).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
