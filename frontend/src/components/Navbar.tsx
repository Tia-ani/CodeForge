import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Trophy, List, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.25rem 2.5rem',
      backgroundColor: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
          padding: '0.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
        }}>
          <Code2 color="white" size={24} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', letterSpacing: '-0.025em' }}>CodeForge</span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/problems" className={`nav-link ${isActive('/problems') ? 'active' : ''}`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <List size={18} /> Problems
        </Link>
        <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Trophy size={18} /> Leaderboard
        </Link>
        <button className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem' }}>
          <UserIcon size={18} /> Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
