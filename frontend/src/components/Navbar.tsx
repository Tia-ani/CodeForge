import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Trophy, List, User as UserIcon, LogOut, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.9rem 2rem',
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-purple))',
          padding: '0.45rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)',
        }}>
          <Code2 color="white" size={20} />
        </div>
        <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
          CodeForge
        </span>
      </Link>

      {/* Center Nav */}
      <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
        <Link to="/problems" className={`nav-link ${isActive('/problems') ? 'active' : ''}`}
          style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <List size={16} /> Problems
        </Link>
        <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
          style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <Trophy size={16} /> Leaderboard
        </Link>
        {isAuthenticated && (
          <Link to="/submissions" className={`nav-link ${isActive('/submissions') ? 'active' : ''}`}
            style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <History size={16} /> My Submissions
          </Link>
        )}
      </div>

      {/* Right — Auth */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-purple))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: 'white',
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
              <LogOut size={15} /> Logout
            </button>
          </>
        ) : (
          <Link to="/auth">
            <button className="btn-primary" style={{
              display: 'flex', gap: '0.4rem', alignItems: 'center',
              padding: '0.5rem 1.1rem', fontSize: '0.85rem'
            }}>
              <UserIcon size={15} /> Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
