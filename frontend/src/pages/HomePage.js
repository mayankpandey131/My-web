import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="hero-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 999, background: 'var(--accent-pale)', border: '1px solid rgba(37,99,235,0.2)', marginBottom: 28 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1 }}>🚀 Student Portfolio Platform</span>
          </div>
          <h1 style={{ marginBottom: 20, maxWidth: 700, margin: '0 auto 20px', lineHeight: 1.15 }}>
            Build Your<br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Professional Identity</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--gray-500)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Showcase your projects, share certificates, and build a portfolio that gets you noticed by recruiters and peers.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <button className="btn btn-accent btn-lg" onClick={() => navigate(`/profile/${user.username}`)}>
                View My Portfolio →
              </button>
            ) : (
              <>
                <Link to="/register"><button className="btn btn-accent btn-lg">Get Started Free →</button></Link>
                <Link to="/explore"><button className="btn btn-outline btn-lg">Browse Portfolios</button></Link>
              </>
            )}
          </div>

          {/* Feature Pills */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48 }}>
            {['📁 Project Showcase', '🎥 Video Demos', '🏅 Certificates', '🎓 College Verified', '📄 Resume Link', '🌐 Public Profile'].map(f => (
              <div key={f} style={{ padding: '8px 18px', borderRadius: 999, background: 'var(--gray-100)', color: 'var(--gray-700)', fontSize: '0.84rem', fontWeight: 500, border: '1px solid var(--gray-200)' }}>{f}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '80px 0', background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2>How My-Web Works</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>Three steps to your professional online presence</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { step: '01', icon: '📝', title: 'Register', desc: 'Create your account with your academic details. Verified college members get a special badge.' },
              { step: '02', icon: '🚀', title: 'Upload Your Work', desc: 'Add projects with descriptions, video demos, and GitHub links. Upload certificates with images and credentials.' },
              { step: '03', icon: '🌍', title: 'Share Your Profile', desc: 'Your public portfolio is instantly accessible to anyone. Share the link with recruiters and the world.' }
            ].map(item => (
              <div key={item.step} style={{ background: 'white', borderRadius: 20, padding: '32px 28px', border: '1px solid var(--gray-200)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 20, right: 24, fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, color: 'var(--gray-100)' }}>{item.step}</div>
                <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ marginBottom: 10, fontSize: '1.15rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ padding: '80px 0', background: 'var(--ink)', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ color: 'white', marginBottom: 16 }}>Ready to Build Your Portfolio?</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>Join students who are already showcasing their work and landing opportunities.</p>
            <Link to="/register"><button className="btn btn-accent btn-lg">Create Free Account →</button></Link>
          </div>
        </section>
      )}
    </div>
  );
}
