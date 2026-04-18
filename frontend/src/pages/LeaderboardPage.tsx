import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import { Trophy, Medal, Award } from 'lucide-react';

interface Entry {
  rank: number; userId: number; userName: string; totalScore: number; problemsSolved: number;
}

const LeaderboardPage = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardAPI.getAll()
      .then(res => { setEntries(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <Trophy size={18} color="#ffd700" />;
    if (rank === 2) return <Medal size={18} color="#c0c0c0" />;
    if (rank === 3) return <Award size={18} color="#cd7f32" />;
    return <span style={{ fontSize: 14, fontWeight: 500 }}>{rank}</span>;
  };

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Trophy size={24} color="var(--lc-brand)" />
          <span style={{ fontSize: 24, fontWeight: 700 }}>Global Leaderboard</span>
        </div>
        <p style={{ color: 'var(--lc-text-muted)', fontSize: 13, marginTop: 6 }}>
          Rankings update on each accepted submission
        </p>
      </div>

      <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px',
          padding: '12px 20px', borderBottom: '1px solid var(--lc-border)',
          color: 'var(--lc-text-muted)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          <span>Rank</span><span>User</span><span style={{ textAlign: 'right' }}>Solved</span><span style={{ textAlign: 'right' }}>Score</span>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--lc-text-muted)' }}><span className="spinner" /></div>
        ) : entries.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--lc-text-muted)' }}>No entries yet. Start solving!</div>
        ) : entries.map(e => (
          <div key={e.userId} style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px',
            padding: '12px 20px', borderBottom: '1px solid var(--lc-border)',
            alignItems: 'center', background: e.rank <= 3 ? 'var(--lc-bg-hover)' : 'transparent',
            transition: 'background 0.1s',
          }}
          onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--lc-bg-hover)')}
          onMouseLeave={ev => (ev.currentTarget.style.background = e.rank <= 3 ? 'var(--lc-bg-hover)' : 'transparent')}>
            <span>{getRankDisplay(e.rank)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: `hsl(${e.userId * 60}, 60%, 40%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'white',
              }}>{e.userName.charAt(0).toUpperCase()}</div>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{e.userName}</span>
            </div>
            <span style={{ textAlign: 'right', color: 'var(--lc-text-secondary)', fontSize: 14 }}>{e.problemsSolved}</span>
            <span style={{ textAlign: 'right', fontWeight: 700, color: 'var(--lc-brand)', fontSize: 14 }}>{e.totalScore}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
