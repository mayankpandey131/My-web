import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar      from './components/Navbar';
import Portfolio   from './pages/Portfolio';
import Register    from './pages/Register';
import Login       from './pages/Login';
import Admin       from './pages/Admin';
import EditProfile from './pages/EditProfile';

const Spinner = () => (
  <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0d0d14' }}>
    <div className="spin" />
  </div>
);

// Protect admin routes
function OwnerRoute({ children }) {
  const { user, authReady } = useAuth();
  if (!authReady) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}

function AppInner() {
  const { user, registered, authReady } = useAuth();

  // Wait until BOTH status check + token check are done
  if (!authReady) return <Spinner />;

  return (
    <>
      <Navbar />
      <Routes>

        {/* 
          ROOT PATH LOGIC:
          - Not registered yet  → go to /register
          - Registered, not logged in → show public portfolio
          - Logged in → show public portfolio (with admin link in navbar)
        */}
        <Route path="/" element={
          !registered
            ? <Navigate to="/register" replace />
            : <Portfolio />
        } />

        {/* REGISTER — only if no owner exists yet */}
        <Route path="/register" element={
          registered
            ? <Navigate to="/login" replace />
            : <Register />
        } />

        {/* LOGIN — skip if already logged in */}
        <Route path="/login" element={
          user
            ? <Navigate to="/admin" replace />
            : <Login />
        } />

        {/* ADMIN — owner only */}
        <Route path="/admin"         element={<OwnerRoute><Admin /></OwnerRoute>} />
        <Route path="/admin/profile" element={<OwnerRoute><EditProfile /></OwnerRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#13131e',
              color: '#f1f1f8',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#a78bfa', secondary: '#13131e' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#13131e' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
