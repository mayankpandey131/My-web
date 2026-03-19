import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { userAPI } from '../services/api';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (q) {
      setLoading(true);
      userAPI.searchUsers(q)
        .then(res => { setUsers(res.data); setSearched(true); })
        .finally(() => setLoading(false));
    }
  }, [q]);

  return (
    <div style={{ minHeight: '80vh', padding: '48px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ marginBottom: 12 }}>Explore Portfolios</h1>
          <p style={{ color: 'var(--gray-500)', maxWidth: 400, margin: '0 auto' }}>Discover students and their amazing work</p>
        </div>

        {q && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
              {loading ? 'Searching...' : `${users.length} result${users.length !== 1 ? 's' : ''} for "${q}"`}
            </p>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)}
          </div>
        ) : users.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {users.map(user => (
              <UserCard key={user._id} user={user} onClick={() => navigate(`/profile/${user.username}`)} />
            ))}
          </div>
        ) : searched ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No users found</div>
            <p className="empty-text">Try searching by name, username, or stream</p>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🌍</div>
            <div className="empty-title">Search for students</div>
            <p className="empty-text">Use the search bar above to find students by name, username, or field of study</p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({ user, onClick }) {
  const initials = user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div onClick={onClick} style={{
      background: 'white', borderRadius: 16, border: '1px solid var(--gray-200)',
      padding: '24px', cursor: 'pointer', transition: 'all 0.25s ease'
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0, overflow: 'hidden' }}>
          {user.profilePicture ? <img src={`http://localhost:5000${user.profilePicture}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)' }}>{user.fullName}</p>
            {user.isCollegeVerified && <span style={{ fontSize: '0.7rem', background: '#d1fae5', color: '#059669', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>✓</span>}
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>@{user.username}</p>
        </div>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 10 }}>🎓 {user.degree} · {user.stream}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>🏫 {user.collegeName}</p>
    </div>
  );
}
