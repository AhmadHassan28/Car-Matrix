import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.06)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.1)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }} className="fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border-gold)', background: 'rgba(201,168,76,0.06)', marginBottom: 28, fontSize: 12, fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Pakistan's Premium Car Rental
          </div>

          <h1 style={{ fontSize: 56, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.03em' }}>
            Drive in style,<br />
            <span style={{ color: 'var(--gold)' }}>anywhere</span> you go
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Choose from our premium fleet of verified vehicles. Instant booking, transparent pricing, no hidden fees.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold" style={{ padding: '14px 36px', fontSize: 15 }} onClick={() => navigate('/cars')}>
              Browse Cars
            </button>
            <button className="btn-ghost" style={{ padding: '14px 28px', fontSize: 15 }} onClick={() => navigate('/register')}>
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {[['50+','Cars Available'], ['1,200+','Happy Customers'], ['4.9★','Average Rating'], ['24/7','Support']].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Playfair Display, serif', marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, marginBottom: 12 }}>Why choose CarMatrix?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>Built for Pakistani drivers who demand reliability and comfort</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[
            { icon: '🔒', title: 'Fully verified', desc: 'Every car is inspected and insured before listing on our platform.' },
            { icon: '💳', title: 'Flexible payments', desc: 'Pay via Cash, Card, JazzCash, or EasyPaisa — your choice.' },
            { icon: '👨‍✈️', title: 'Professional drivers', desc: 'Hire a verified driver for any trip at a transparent daily rate.' },
            { icon: '⚡', title: 'Instant confirmation', desc: 'Your booking is confirmed immediately — no waiting, no calls.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ padding: 24, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, marginBottom: 8, fontFamily: 'Playfair Display, serif' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, marginBottom: 12 }}>Ready to hit the road?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 15 }}>Book your car in under 2 minutes</p>
        <button className="btn-gold" style={{ padding: '14px 40px', fontSize: 15 }} onClick={() => navigate('/cars')}>
          View Available Cars
        </button>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        © 2026 CarMatrix · FAST-NU Lahore · Database Systems Project
      </div>
    </div>
  );
}
