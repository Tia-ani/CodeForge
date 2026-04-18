import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { leaderboardAPI } from '../services/api';

interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  totalScore: number;
  problemsSolved: number;
}

const FALLBACK: LeaderboardEntry[] = [
  { rank: 1, userId: 1, userName: 'Admin', totalScore: 0, problemsSolved: 0 },
  { rank: 2, userId: 2, userName: 'Anishka Khurana', totalScore: 0, problemsSolved: 0 },
];

const LeaderboardPage = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardAPI.getAll()
      .then(res => { setEntries(res.data); setLoading(false); })
      .catch(() => { setEntries(FALLBACK); setLoading(false); });
  }, []);

  const getRankDecoration = (rank: number) => {
    if (rank === 1) return <Crown size={20} color="#fbbf24" />;
    if (rank === 2) return <Medal size={18} color="#d1d5db" />;
    if (rank === 3) return <Medal size={18} color="#d97706" />;
    return <span style={{ color: 'var(--text-muted)', fontWeight: 600, width: 20, textAlign: 'center', display: 'inline-block' }}>{rank}</span>;
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))',
          width: 56, height: 56, borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 0.75rem', border: '1px solid rgba(251,191,36,0.15)',
        }}>
          <Trophy size={28} color="var(--warning)" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Global Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', fontSize: '0.9rem' }}>
          Rankings update automatically on each accepted submission
        </p>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, width: 70 }}>Rank</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>User</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Solved</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <span className="spinner" style={{ marginRight: 8 }} /> Loading leaderboard...
              </td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No submissions yet. Be the first to solve a problem!
              </td></tr>
            ) : entries.map((e) => (
              <tr key={e.userId} className="table-row" style={{
                borderBottom: '1px solid var(--border)',
                background: e.rank === 1 ? 'rgba(251,191,36,0.03)' : 'transparent',
              }}>
                <td style={{ padding: '1rem', paddingLeft: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {getRankDecoration(e.rank)}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: `linear-gradient(135deg, hsl(${e.userId * 60}, 70%, 50%), hsl(${e.userId * 60 + 40}, 70%, 40%))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: 'white',
                    }}>
                      {e.userName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600 }}>{e.userName}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                  {e.problemsSolved}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {e.totalScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
