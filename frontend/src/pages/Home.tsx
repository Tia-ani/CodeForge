import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="fade-in" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'inline-block', padding: '0.25rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          Welcome to CodeForge v2.0
        </div>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master Your Coding<br/>Potential Offline & Online
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          The ultimate platform for competitive programming. Train your algorithmic skills with our blazing fast distributed judge engine.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/problems">
            <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Explore Problems</button>
          </Link>
          <Link to="/leaderboard">
            <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>View Leaderboard</button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
        {[
          { icon: <Zap size={32} color="var(--accent-primary)" />, title: 'Lightning Fast', desc: 'Our evaluation engine runs in isolated Docker containers yielding sub-millisecond execution times.' },
          { icon: <Shield size={32} color="#10b981" />, title: 'Secure Sandbox', desc: 'Code gets executed in strict unprivileged environments ensuring 100% security against malicious payloads.' },
          { icon: <Activity size={32} color="#8b5cf6" />, title: 'Realtime Leaderboard', desc: 'See your ranking update in absolute real-time as soon as the judge engine accepts a submission.' }
        ].map((feat, i) => (
          <div key={i} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', width: 'fit-content' }}>
              {feat.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{feat.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
