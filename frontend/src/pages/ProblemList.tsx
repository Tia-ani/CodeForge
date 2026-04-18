import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemAPI } from '../services/api';
import { Search, BookOpen, CheckCircle2 } from 'lucide-react';

interface Problem {
  problemId: number;
  title: string;
  difficulty: string;
  testCaseCount: number;
}

const FALLBACK: Problem[] = [
  { problemId: 1, title: 'Two Sum', difficulty: 'EASY', testCaseCount: 3 },
  { problemId: 2, title: 'Valid Parentheses', difficulty: 'EASY', testCaseCount: 4 },
  { problemId: 3, title: 'Climbing Stairs', difficulty: 'EASY', testCaseCount: 3 },
  { problemId: 4, title: 'Best Time to Buy and Sell Stock', difficulty: 'EASY', testCaseCount: 2 },
  { problemId: 5, title: 'Reverse Linked List', difficulty: 'EASY', testCaseCount: 3 },
  { problemId: 6, title: 'Maximum Subarray', difficulty: 'EASY', testCaseCount: 3 },
  { problemId: 7, title: 'Merge Two Sorted Lists', difficulty: 'EASY', testCaseCount: 3 },
  { problemId: 8, title: 'Add Two Numbers', difficulty: 'MEDIUM', testCaseCount: 3 },
  { problemId: 9, title: 'Longest Substring Without Repeating Characters', difficulty: 'MEDIUM', testCaseCount: 3 },
  { problemId: 10, title: 'Merge Intervals', difficulty: 'MEDIUM', testCaseCount: 2 },
  { problemId: 11, title: 'Coin Change', difficulty: 'MEDIUM', testCaseCount: 3 },
  { problemId: 12, title: '3Sum', difficulty: 'MEDIUM', testCaseCount: 3 },
  { problemId: 13, title: 'Group Anagrams', difficulty: 'MEDIUM', testCaseCount: 3 },
  { problemId: 14, title: 'Median of Two Sorted Arrays', difficulty: 'HARD', testCaseCount: 2 },
  { problemId: 15, title: 'Trapping Rain Water', difficulty: 'HARD', testCaseCount: 2 },
  { problemId: 16, title: 'N-Queens', difficulty: 'HARD', testCaseCount: 2 },
  { problemId: 17, title: 'Merge K Sorted Lists', difficulty: 'HARD', testCaseCount: 3 },
  { problemId: 18, title: 'Longest Valid Parentheses', difficulty: 'HARD', testCaseCount: 3 },
  { problemId: 19, title: 'Word Search II', difficulty: 'HARD', testCaseCount: 1 },
  { problemId: 20, title: 'Regular Expression Matching', difficulty: 'HARD', testCaseCount: 3 },
];

const ProblemList = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    problemAPI.getAll()
      .then(res => { setProblems(res.data); setLoading(false); })
      .catch(() => { setProblems(FALLBACK); setLoading(false); });
  }, []);

  const filtered = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === 'ALL' || p.difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  const counts = {
    EASY: problems.filter(p => p.difficulty === 'EASY').length,
    MEDIUM: problems.filter(p => p.difficulty === 'MEDIUM').length,
    HARD: problems.filter(p => p.difficulty === 'HARD').length,
  };

  const getBadgeClass = (d: string) => {
    switch (d) { case 'EASY': return 'badge-easy'; case 'MEDIUM': return 'badge-medium'; case 'HARD': return 'badge-hard'; default: return ''; }
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={28} color="var(--accent-primary)" /> Problem Set
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', fontSize: '0.9rem' }}>
            {problems.length} problems across 3 difficulty levels
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {(['EASY', 'MEDIUM', 'HARD'] as const).map(d => (
            <div key={d} className="glass-card" style={{ padding: '0.6rem 1rem', textAlign: 'center', cursor: 'pointer', minWidth: 70 }}
              onClick={() => setDiffFilter(diffFilter === d ? 'ALL' : d)}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: d === 'EASY' ? 'var(--success)' : d === 'MEDIUM' ? 'var(--warning)' : 'var(--error)' }}>{counts[d]}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input className="input-field" type="text" placeholder="Search problems by title..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '2.5rem' }} />
      </div>

      {/* Difficulty filter indicator */}
      {diffFilter !== 'ALL' && (
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Filtering:</span>
          <span className={getBadgeClass(diffFilter)}>{diffFilter}</span>
          <button className="btn-ghost" onClick={() => setDiffFilter('ALL')} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, width: 50 }}>
                <CheckCircle2 size={14} />
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Title</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Tests</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <span className="spinner" style={{ marginRight: 8 }} /> Loading problems...
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No problems found.
              </td></tr>
            ) : filtered.map((p) => (
              <tr key={p.problemId} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>—</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <Link to={`/problem/${p.problemId}`} style={{ color: 'var(--text-primary)', fontWeight: 500, transition: 'color 0.2s' }}>
                    {p.problemId}. {p.title}
                  </Link>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {p.testCaseCount} cases
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className={getBadgeClass(p.difficulty)}>{p.difficulty}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList;
