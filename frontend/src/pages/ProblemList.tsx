import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, BookOpen } from 'lucide-react';

interface Problem {
  problemId: number;
  title: string;
  difficulty: string;
  description: string;
}

const ProblemList = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch from backend API
    axios.get('/api/problems')
      .then(res => {
        setProblems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend not running, falling back to mock data.", err);
        // Fallback data if DB isn't up
        setProblems([
            { problemId: 1, title: 'Two Sum', difficulty: 'EASY', description: 'Given an array...' },
            { problemId: 2, title: 'Add Two Numbers', difficulty: 'MEDIUM', description: 'Linked lists...' },
            { problemId: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'MEDIUM', description: 'Strings...' },
            { problemId: 4, title: 'Median of Two Sorted Arrays', difficulty: 'HARD', description: 'Arrays...' },
            { problemId: 5, title: 'Valid Parentheses', difficulty: 'EASY', description: 'Stacks...' },
            { problemId: 6, title: 'Merge Intervals', difficulty: 'MEDIUM', description: 'Sorting...' },
            { problemId: 7, title: 'Trapping Rain Water', difficulty: 'HARD', description: 'Two Pointers...' },
            { problemId: 8, title: 'Climbing Stairs', difficulty: 'EASY', description: 'DP...' },
            { problemId: 9, title: 'Coin Change', difficulty: 'MEDIUM', description: 'DP...' },
            { problemId: 10, title: 'N-Queens', difficulty: 'HARD', description: 'Backtracking...' }
        ]);
        setLoading(false);
      });
  }, []);

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toUpperCase()) {
      case 'EASY': return 'var(--success)';
      case 'MEDIUM': return 'var(--warning)';
      case 'HARD': return 'var(--error)';
      default: return 'var(--text-primary)';
    }
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header and Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={36} color="var(--accent-primary)" /> Problem Set
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Master algorithmic reasoning across {problems.length || 10} structured challenges.</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>EASY</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{problems.filter(p => p.difficulty === 'EASY').length} problems</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning)' }}>MED</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{problems.filter(p => p.difficulty === 'MEDIUM').length} problems</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--error)' }}>HARD</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{problems.filter(p => p.difficulty === 'HARD').length} problems</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search problems..." style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', outline: 'none' }} />
        </div>
        <button className="btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Filter size={18} /> Filters</button>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', width: '60px' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Title</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Acceptance</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading problems...</td></tr>
            ) : problems.map((p) => (
              <tr key={p.problemId} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="problem-row">
                <td style={{ padding: '1rem' }}>-</td>
                <td style={{ padding: '1rem' }}>
                  <Link to={`/problem/${p.problemId}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, fontSize: '1.05rem', transition: 'color 0.2s' }}>
                    {p.problemId}. {p.title}
                  </Link>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{(Math.random() * (70 - 20) + 20).toFixed(1)}%</td>
                <td style={{ padding: '1rem', color: getDifficultyColor(p.difficulty), fontWeight: 600, letterSpacing: '0.5px' }}>{p.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList;
