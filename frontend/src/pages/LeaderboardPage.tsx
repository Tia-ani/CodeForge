import React, { useState } from 'react';
import { Trophy } from 'lucide-react';

const LeaderboardPage = () => {
  const [users] = useState([
    { rank: 1, name: 'Anishka Khurana', score: 2500, solved: 450 },
    { rank: 2, name: 'Alex Johnson', score: 2340, solved: 410 },
    { rank: 3, name: 'Jane Doe', score: 2120, solved: 380 },
    { rank: 4, name: 'John Smith', score: 1980, solved: 320 },
    { rank: 5, name: 'Alice Walker', score: 1850, solved: 290 },
  ]);

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <Trophy size={48} color="var(--warning)" />
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Global Leaderboard</h1>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Rank</th>
              <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>User</th>
              <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Score</th>
              <th style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Solved</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.rank} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s', background: i === 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent' }}>
                <td style={{ padding: '1.5rem', fontWeight: 700, color: i < 3 ? 'var(--warning)' : 'var(--text-primary)' }}>
                  #{u.rank}
                </td>
                <td style={{ padding: '1.5rem', fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 700 }}>{u.score}</td>
                <td style={{ padding: '1.5rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{u.solved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
