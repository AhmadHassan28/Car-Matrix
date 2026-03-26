import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate( data.role === 'Admin'  ? '/admin' : data.role === 'Driver' ? '/driver/dashboard' : '/cars');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-deep)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 80px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="fade-up">
          {/* Logo */}
          <div style={{ marginBottom: 48 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dim))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: '#0E0E10',
              }}>C</div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600 }}>CarMatrix</span>
            </Link>
          </div>

          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: 15 }}>
            Sign in to your account to continue
          </p>

          {error && (
            <div style={{
              background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)',
              borderRadius: 8, padding: '12px 16px', marginBottom: 20,
              color: '#FF3B30', fontSize: 13,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Email address
              </label>
              <input
                className="input-base"
                type="email" placeholder="ali@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Password
                </label>
              </div>
              <input
                className="input-base"
                type="password" placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit" className="btn-gold"
              style={{ width: '100%', padding: '14px', marginTop: 8, fontSize: 15 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel — decorative */}
      <div style={{
        width: 480,
        background: 'var(--bg-card)',
        borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: 60, position: 'relative', overflow: 'hidden',
      }}>
        {/* Gold circle decoration */}
        <div style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.1)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />
        <div style={{
          position: 'absolute', width: 260, height: 260,
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.15)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />
        <div style={{
          position: 'absolute', width: 120, height: 120,
          borderRadius: '50%',
          background: 'rgba(201,168,76,0.06)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🚗</div>
          <h2 style={{ fontSize: 26, marginBottom: 12, lineHeight: 1.3 }}>
            Drive the car<br/>of your dreams
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
            Access Pakistan's finest fleet of vehicles. From daily commutes to luxury getaways — we have you covered.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40 }}>
            {[['50+', 'Cars'], ['1000+', 'Trips'], ['4.9★', 'Rating']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Playfair Display, serif' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
