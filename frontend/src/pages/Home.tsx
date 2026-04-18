import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Lock, Trophy, Building2, BarChart3, Puzzle, ArrowRight, Code2 } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { title: 'Judge Engine', desc: 'Strategy + Factory patterns power automatic code evaluation across Java, Python, and C++.', Icon: Zap, color: 'var(--lc-brand)' },
    { title: 'JWT Authentication', desc: 'Secure role-based access control — users solve problems, admins manage the platform.', Icon: Lock, color: 'var(--lc-easy)' },
    { title: 'Live Leaderboard', desc: 'Observer Pattern triggers instant ranking updates. Scores scale with problem difficulty.', Icon: Trophy, color: 'var(--lc-medium)' },
    { title: 'Clean Architecture', desc: 'Controllers → Services → Models. TypeScript everywhere with proper OOP patterns.', Icon: Building2, color: 'var(--lc-hard)' },
    { title: 'Profile & Stats', desc: 'Track your progress with donut charts, submission heatmaps, and difficulty breakdowns.', Icon: BarChart3, color: '#a855f7' },
    { title: 'Design Patterns', desc: 'Strategy, Factory, Singleton, and Observer patterns implemented across the backend.', Icon: Puzzle, color: '#0a84ff' },
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #282828 0%, #1a1a1a 100%)',
        borderBottom: '1px solid var(--lc-border)',
        padding: '50px 0',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 50 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
              A New Way to Learn <span style={{ color: 'var(--lc-brand)' }}>Algorithms</span>
            </h1>
            <p style={{ color: 'var(--lc-text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 24, maxWidth: 500 }}>
              CodeForge is the best platform to help you enhance your skills, expand your knowledge,
              and prepare for technical interviews.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to={isAuthenticated ? '/problems' : '/auth'}>
                <button className="lc-btn-primary" style={{ padding: '10px 28px', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isAuthenticated ? 'Start Solving' : 'Create Account'} <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/problems">
                <button className="lc-btn" style={{ padding: '10px 28px', fontSize: 15 }}>
                  Explore Problems
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
            {[
              { val: '120', label: 'Coding Problems', color: 'var(--lc-brand)', Icon: Code2 },
              { val: '3', label: 'Languages', color: 'var(--lc-easy)', Icon: Zap },
              { val: '3', label: 'Difficulty Levels', color: 'var(--lc-hard)', Icon: BarChart3 },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)',
                padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16,
                border: '1px solid var(--lc-border)', minWidth: 260,
              }}>
                <s.Icon size={24} color={s.color} />
                <span style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</span>
                <span style={{ color: 'var(--lc-text-secondary)', fontSize: 14 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Platform Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)',
              padding: 24, border: '1px solid var(--lc-border)',
              transition: 'border-color 0.2s', cursor: 'default',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = f.color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--lc-border)')}>
              <f.Icon size={28} color={f.color} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: f.color }}>{f.title}</div>
              <div style={{ color: 'var(--lc-text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
