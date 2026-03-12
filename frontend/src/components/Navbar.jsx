import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        {/* LOGO — links to public portfolio */}
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="nav-logo-dot" />
          <span className="nav-logo-text">portfolio</span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                ⚙ Admin
              </Link>
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav-link-login">Owner Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
