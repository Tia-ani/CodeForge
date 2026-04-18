import { Link } from 'react-router-dom';
import { Zap, Shield, Activity, Code2, ChevronRight, Users, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="fade-in" style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.3rem 1rem', background: 'rgba(59, 130, 246, 0.08)',
          borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
          color: 'var(--accent-primary)', border: '1px solid rgba(59,130,246,0.15)',
          marginBottom: '1.5rem',
        }}>
          <Zap size={14} /> 20 Algorithmic Challenges Available
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1,
          marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Forge Your Code.<br />Prove Your Logic.
        </h1>

        <p style={{
          fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '560px',
          margin: '0 auto 2rem', lineHeight: 1.7,
        }}>
          An online judge platform where you write code, fight test cases,
          and climb the leaderboard. Built with Spring Boot and React.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/problems">
            <button className="btn-primary" style={{
              padding: '0.85rem 2rem', fontSize: '1rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              Start Solving <ChevronRight size={18} />
            </button>
          </Link>
          <Link to="/leaderboard">
            <button className="btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              View Rankings
            </button>
          </Link>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem',
        marginBottom: '4rem',
      }}>
        {[
          { icon: <Code2 size={22} />, value: '20', label: 'Coding Problems', color: 'var(--accent-primary)' },
          { icon: <Users size={22} />, value: '3', label: 'Languages Supported', color: 'var(--accent-purple)' },
          { icon: <Award size={22} />, value: '∞', label: 'Submissions', color: 'var(--success)' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{
            padding: '1.5rem', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          }}>
            <div style={{ color: stat.color }}>{stat.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {[
          {
            icon: <Zap size={28} color="var(--accent-primary)" />,
            title: 'Automated Judge Engine',
            desc: 'Submit code in Java, Python, or C++ and get instant verdicts — Accepted, Wrong Answer, TLE, or Compilation Error.',
          },
          {
            icon: <Shield size={28} color="var(--success)" />,
            title: 'JWT Authentication',
            desc: 'Secure role-based access with JWT. Users solve problems, admins manage the platform. Every request is authenticated.',
          },
          {
            icon: <Activity size={28} color="var(--accent-purple)" />,
            title: 'Live Leaderboard',
            desc: 'Observer Pattern triggers instant leaderboard updates on each accepted submission. Scores scale with difficulty.',
          },
        ].map((feat, i) => (
          <div key={i} className="glass-card slide-up" style={{
            padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
            animationDelay: `${i * 0.1}s`, animationFillMode: 'backwards',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)', padding: '0.75rem',
              borderRadius: '10px', width: 'fit-content',
            }}>
              {feat.icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{feat.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
