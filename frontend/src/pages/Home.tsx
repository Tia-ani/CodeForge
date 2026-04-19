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
      <div className="hero-section" style={{
        margin: '24px',
        padding: '60px 40px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 50 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
              A New Way to Learn <span style={{ color: 'var(--lc-brand)', textShadow: '0 0 20px rgba(255, 87, 34, 0.5)' }}>Algorithms</span>
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 17, lineHeight: 1.7, marginBottom: 28, maxWidth: 520 }}>
              CodeForge is the best platform to help you enhance your skills, expand your knowledge,
              and prepare for technical interviews with real-time execution tracing.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to={isAuthenticated ? '/problems' : '/auth'}>
                <button className="lc-btn-primary" style={{ padding: '12px 32px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isAuthenticated ? 'Start Solving' : 'Create Account'} <ArrowRight size={18} strokeWidth={2} />
                </button>
              </Link>
              <Link to="/problems">
                <button className="lc-btn" style={{ padding: '12px 32px', fontSize: 16, background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  Explore Problems
                </button>
              </Link>
            </div>
          </div>

          {/* Stats - High Contrast White Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
            {[
              { val: '120', label: 'Coding Problems', color: 'var(--lc-brand)', Icon: Code2 },
              { val: '3', label: 'Languages', color: '#4CAF50', Icon: Zap },
              { val: '3', label: 'Difficulty Levels', color: '#F44336', Icon: BarChart3 },
            ].map((s, i) => (
              <div key={i} className="card-white" style={{
                padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 16,
                minWidth: 280,
              }}>
                <s.Icon size={28} color={s.color} strokeWidth={1.5} />
                <span style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.val}</span>
                <span style={{ color: 'var(--lc-card-text)', fontSize: 14, fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 28, color: 'var(--lc-text)' }}>Platform Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card-dark">
              <f.Icon size={32} color={f.color} strokeWidth={1.5} style={{ marginBottom: 14 }} />
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10, color: f.color }}>{f.title}</div>
              <div style={{ color: 'var(--lc-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
