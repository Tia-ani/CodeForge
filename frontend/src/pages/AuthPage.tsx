import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Mail, Lock, User as UserIcon } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/problems');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.errors?.email || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 60px)', padding: '2rem',
    }}>
      <div className="glass-card" style={{
        width: '100%', maxWidth: '420px', padding: '2.5rem',
        animation: 'slideUp 0.5s ease-out',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-purple))',
            width: 48, height: 48, borderRadius: '12px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
          }}>
            <Code2 color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            {isLogin ? 'Sign in to continue solving problems' : 'Join CodeForge and start coding'}
          </p>
        </div>

        {/* Demo credentials hint */}
        {isLogin && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '1.5rem',
            fontSize: '0.8rem', color: 'var(--accent-primary)',
          }}>
            <strong>Demo:</strong> anishka@codeforge.com / user123
          </div>
        )}

        {error && (
          <div style={{
            background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '1rem',
            fontSize: '0.85rem', color: 'var(--error)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <UserIcon size={16} style={{
                position: 'absolute', left: '0.9rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
              <input className="input-field" type="text" placeholder="Full name"
                value={name} onChange={e => setName(e.target.value)} required
                style={{ paddingLeft: '2.5rem' }} />
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{
              position: 'absolute', left: '0.9rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
            }} />
            <input className="input-field" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} required
              style={{ paddingLeft: '2.5rem' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{
              position: 'absolute', left: '0.9rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
            }} />
            <input className="input-field" type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)} required
              style={{ paddingLeft: '2.5rem' }} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            {loading ? <span className="spinner" /> : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: '1.5rem',
          color: 'var(--text-secondary)', fontSize: '0.9rem',
        }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
