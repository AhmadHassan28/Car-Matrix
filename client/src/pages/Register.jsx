import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', cnic: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return setError('Please fill all fields');
    setError(''); setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setError(''); setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name, email: form.email,
        phone: form.phone, cnic: form.cnic, password: form.password,
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-deep)' }}>
      {/* Left decorative sidebar */}
      <div style={{
        width: 440, background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: 60,
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, var(--gold), var(--gold-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#0E0E10' }}>C</div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 600 }}>CarMatrix</span>
        </Link>

        <div>
          <h2 style={{ fontSize: 28, lineHeight: 1.3, marginBottom: 20 }}>
            Join thousands of<br/>happy drivers
          </h2>
          {[
            ['Instant booking', 'Confirm your car in under 2 minutes'],
            ['Transparent pricing', 'No hidden fees, ever'],
            ['Flexible rentals', 'Hourly, daily, or weekly options'],
            ['Verified fleet', 'Every car inspected & insured'],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Want to drive for us?{' '}
            <Link to="/driver/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>Apply as a Driver</Link>
          </p>
        </div>
      </div>

      {/* Main Form Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 80px' }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="fade-up">
          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600,
                  background: step >= s ? 'linear-gradient(135deg, var(--gold), var(--gold-dim))' : 'var(--bg-elevated)',
                  color: step >= s ? '#0E0E10' : 'var(--text-muted)',
                  border: step >= s ? 'none' : '1px solid var(--border)',
                  transition: 'all 0.3s',
                }}>{s}</div>
                <span style={{ fontSize: 12, color: step === s ? 'var(--gold-light)' : 'var(--text-muted)', fontWeight: step === s ? 600 : 400 }}>
                  {s === 1 ? 'Personal info' : 'Security'}
                </span>
                {s < 2 && <div style={{ width: 40, height: 1, background: step > s ? 'var(--gold-dim)' : 'var(--border)', transition: 'all 0.3s' }} />}
              </div>
            ))}
          </div>

          <h1 style={{ fontSize: 28, marginBottom: 6 }}>
            {step === 1 ? 'Create account' : 'Set your password'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 14 }}>
            {step === 1 ? 'Step 1 of 2 — Tell us about yourself' : 'Step 2 of 2 — Secure your account'}
          </p>

          {error && (
            <div style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#FF3B30', fontSize: 13 }}>
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'name', label: 'Full name', type: 'text', placeholder: 'Ali Hassan' },
                { key: 'email', label: 'Email address', type: 'email', placeholder: 'ali@example.com' },
                { key: 'phone', label: 'Phone number', type: 'tel', placeholder: '03001234567' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{f.label}</label>
                  <input className="input-base" type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => set(f.key, e.target.value)} required />
                </div>
              ))}
              <button type="submit" className="btn-gold" style={{ width: '100%', padding: 14, marginTop: 8, fontSize: 15 }}>
                Continue →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>CNIC number</label>
                <input className="input-base" type="text" placeholder="35202-1234567-1" value={form.cnic} onChange={e => set('cnic', e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Password</label>
                <input className="input-base" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Confirm password</label>
                <input className="input-base" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn-ghost" style={{ flex: 1, padding: 14 }} onClick={() => { setStep(1); setError(''); }}>← Back</button>
                <button type="submit" className="btn-gold" style={{ flex: 2, padding: 14, fontSize: 15 }} disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          )}
          
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--text-muted)' }}>
             Professional driver?{' '}
             <Link to="/driver/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Apply here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}