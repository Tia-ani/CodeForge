import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 50px)',
    }}>
      <div style={{
        width: 400, background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)',
        padding: 32, border: '1px solid var(--lc-border)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {isLogin ? 'Sign In' : 'Register'}
          </div>
          <p style={{ color: 'var(--lc-text-muted)', fontSize: 13, marginTop: 6 }}>
            {isLogin ? 'Sign in to track your progress' : 'Join CodeForge and start coding'}
          </p>
        </div>

        {isLogin && (
          <div style={{
            background: 'var(--lc-brand-dim)', border: '1px solid var(--lc-brand-dim)',
            borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 16,
            fontSize: 12, color: 'var(--lc-brand)',
          }}>
            <strong>Demo:</strong> anishka@codeforge.com / user123
          </div>
        )}

        {error && (
          <div style={{
            background: 'var(--lc-hard-bg)', border: '1px solid #ff375f44',
            borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16,
            fontSize: 12, color: 'var(--lc-hard)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!isLogin && (
            <input className="lc-input" type="text" placeholder="Full name"
              value={name} onChange={e => setName(e.target.value)} required />
          )}
          <input className="lc-input" type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="lc-input" type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} required />

          <button type="submit" className="lc-btn-primary" disabled={loading}
            style={{ width: '100%', padding: 10, marginTop: 4, fontSize: 14 }}>
            {loading ? <span className="spinner" /> : isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--lc-text-muted)', fontSize: 13 }}>
          {isLogin ? "Don't have an account?" : 'Already have one?'}{' '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--lc-brand)', cursor: 'pointer', fontWeight: 500 }}>
            {isLogin ? 'Register' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
