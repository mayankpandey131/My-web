import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');
  const menuRef = useRef();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMenu(false);
  };

  // Don't show navbar on auth pages
  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="nav-brand">My-<span>Web</span></Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 380, margin: '0 32px' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', fontSize: '0.9rem' }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search students, colleges..."
              style={{
                width: '100%', padding: '9px 16px 9px 40px',
                borderRadius: 999, border: '1.5px solid var(--gray-200)',
                fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                outline: 'none', transition: 'all 0.2s',
                background: 'var(--gray-100)'
              }}
              onFocus={e => { e.target.style.background = 'white'; e.target.style.borderColor = 'var(--accent)'; }}
              onBlur={e => { e.target.style.background = 'var(--gray-100)'; e.target.style.borderColor = 'var(--gray-200)'; }}
            />
          </div>
        </form>

        {/* Nav Actions */}
        <div className="nav-links">
          {user ? (
            <>
              <Link to={`/profile/${user.username}`} className="nav-link">My Portfolio</Link>
              <div style={{ position: 'relative' }} ref={menuRef}>
                <div className="nav-avatar" onClick={() => setShowMenu(!showMenu)} title={user.fullName}>
                  {initials}
                </div>
                {showMenu && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 12px)',
                    background: 'white', border: '1px solid var(--gray-200)',
                    borderRadius: 16, boxShadow: 'var(--shadow-xl)',
                    minWidth: 220, padding: '8px', zIndex: 200,
                    animation: 'slideUp 0.2s ease'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100)', marginBottom: 8 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>{user.fullName}</p>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>@{user.username}</p>
                    </div>
                    {[
                      { label: '👤 View Profile', action: () => { navigate(`/profile/${user.username}`); setShowMenu(false); } },
                      { label: '🔍 Browse Portfolios', action: () => { navigate('/explore'); setShowMenu(false); } }
                    ].map(item => (
                      <button key={item.label} onClick={item.action} style={{
                        width: '100%', padding: '10px 16px', border: 'none', background: 'none',
                        textAlign: 'left', cursor: 'pointer', borderRadius: 10,
                        fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--ink)',
                        transition: 'background 0.15s'
                      }}
                        onMouseEnter={e => e.target.style.background = 'var(--gray-100)'}
                        onMouseLeave={e => e.target.style.background = 'none'}
                      >{item.label}</button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: 8, paddingTop: 8 }}>
                      <button onClick={handleLogout} style={{
                        width: '100%', padding: '10px 16px', border: 'none', background: 'none',
                        textAlign: 'left', cursor: 'pointer', borderRadius: 10,
                        fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--error)',
                        transition: 'background 0.15s'
                      }}
                        onMouseEnter={e => e.target.style.background = '#fef2f2'}
                        onMouseLeave={e => e.target.style.background = 'none'}
                      >🚪 Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/explore" className="nav-link">Explore</Link>
              <Link to="/login" className="nav-link">Sign in</Link>
              <Link to="/register"><button className="nav-btn-primary">Get Started</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
