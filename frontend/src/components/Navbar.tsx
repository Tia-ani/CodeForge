import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Flame, LogOut, Code2 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const navLinkStyle = (path: string): React.CSSProperties => ({
    color: isActive(path) ? 'var(--lc-brand)' : 'var(--lc-text-secondary)',
    fontWeight: isActive(path) ? 600 : 400,
    fontSize: '14px',
    padding: '0 12px',
    lineHeight: '50px',
    borderBottom: isActive(path) ? '2px solid var(--lc-brand)' : '2px solid transparent',
    transition: 'all 0.15s',
    cursor: 'pointer',
    position: 'relative',
  });

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      height: 50, padding: '0 16px',
      background: 'var(--lc-bg-layer1)',
      borderBottom: '1px solid var(--lc-border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
          <Code2 size={22} color="var(--lc-brand)" strokeWidth={1.5} style={{ marginRight: 6 }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--lc-text)', letterSpacing: '-0.3px' }}>CodeForge</span>
        </Link>
        <Link to="/" style={navLinkStyle('/')}>Explore</Link>
        <Link to="/problems" style={navLinkStyle('/problems')}>Problems</Link>
        <Link to="/leaderboard" style={navLinkStyle('/leaderboard')}>Leaderboard</Link>
        <Link to="/submissions" style={navLinkStyle('/submissions')}>Submissions</Link>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--lc-bg-layer2)', padding: '5px 12px',
          borderRadius: 'var(--radius)', border: '1px solid var(--lc-border)',
          minWidth: 160, cursor: 'pointer',
        }}>
          <Search size={14} color="#ffffff59" />
          <span style={{ color: 'var(--lc-text-muted)', fontSize: 13 }}>Search</span>
        </div>

        {isAuthenticated ? (
          <>
            <Bell size={18} color="var(--lc-text-secondary)" strokeWidth={1.5} style={{ cursor: 'pointer' }} onClick={() => navigate('/submissions')} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--lc-text-secondary)', fontSize: 13, cursor: 'pointer' }}
              onClick={() => navigate('/leaderboard')}>
              <Flame size={15} strokeWidth={1.5} /> 0
            </div>

            {/* Avatar */}
            <div onClick={() => navigate('/profile')} title="Profile" style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--lc-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer',
              border: '2px solid var(--lc-brand-dim)',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <button onClick={() => { logout(); navigate('/'); }} style={{
              background: 'none', border: 'none', color: 'var(--lc-text-muted)',
              cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <LogOut size={14} strokeWidth={1.5} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/auth">
              <button className="lc-btn" style={{ fontSize: 13 }}>Sign in</button>
            </Link>
            <Link to="/auth">
              <button className="lc-btn-primary" style={{ padding: '6px 16px', fontSize: 13 }}>
                Premium
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
