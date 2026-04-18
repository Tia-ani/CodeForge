import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemAPI } from '../services/api';
import { Search, ArrowUpDown, Filter, BookOpen, Swords, GraduationCap, Lock, Unlock, Grid3X3, Settings, DollarSign, Shuffle, FileCode, FolderOpen, Star, ChevronLeft, ChevronRight, Building } from 'lucide-react';

interface Problem {
  problemId: number;
  title: string;
  difficulty: string;
  testCaseCount: number;
}

const TOPIC_TAGS = ['Array', 'String', 'Hash Table', 'Math', 'Dynamic Programming', 'Sorting', 'Greedy', 'Binary Search', 'Tree', 'Stack'];
const CATEGORY_ICONS = [
  { label: 'All Topics', icon: Grid3X3 },
  { label: 'Algorithms', icon: Settings },
  { label: 'Database', icon: Grid3X3 },
  { label: 'Shell', icon: DollarSign },
  { label: 'Concurrency', icon: Shuffle },
  { label: 'JavaScript', icon: FileCode },
];

const ProblemList = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    problemAPI.getAll()
      .then(res => { setProblems(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = !diffFilter || p.difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  const getDiffClass = (d: string) => d === 'EASY' ? 'diff-easy' : d === 'MEDIUM' ? 'diff-medium' : 'diff-hard';
  const getDiffLabel = (d: string) => d === 'EASY' ? 'Easy' : d === 'MEDIUM' ? 'Med.' : 'Hard';

  // Generate stable acceptance rates
  const getAcceptance = (id: number) => (((id * 7 + 13) % 50) + 30).toFixed(1);

  return (
    <div className="fade-in" style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', padding: '20px 16px', gap: 24 }}>

      {/* Left Sidebar */}
      <div style={{ width: 160, flexShrink: 0 }}>
        {[
          { icon: BookOpen, label: 'Library', active: true },
          { icon: Swords, label: 'Quest', badge: 'New' },
          { icon: GraduationCap, label: 'Study Plan' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 'var(--radius)',
            color: item.active ? 'var(--lc-text)' : 'var(--lc-text-secondary)',
            background: item.active ? 'var(--lc-bg-layer2)' : 'transparent',
            cursor: 'pointer', marginBottom: 2, fontSize: 14, fontWeight: 500,
          }}>
            <item.icon size={16} /> {item.label}
            {item.badge && <span style={{
              background: 'var(--lc-brand)', color: '#1a1a1a',
              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
            }}>{item.badge}</span>}
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--lc-border)', margin: '16px 0' }} />
        <div style={{ padding: '0 14px', color: 'var(--lc-text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>My Lists +</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', fontSize: 14, color: 'var(--lc-text-secondary)', cursor: 'pointer' }}>
          <Star size={14} color="var(--lc-brand)" /> Favorite
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>

        {/* Topic tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {TOPIC_TAGS.map((tag, i) => (
            <span key={i} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12,
              background: 'var(--lc-bg-layer2)', color: 'var(--lc-text-secondary)',
              cursor: 'pointer',
            }}>
              {tag} <span style={{ color: 'var(--lc-text-muted)' }}>{((i * 317 + 100) % 2000) + 100}</span>
            </span>
          ))}
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {CATEGORY_ICONS.map((cat, i) => (
            <button key={i} style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: i === 0 ? 'var(--lc-bg-layer3)' : 'transparent',
              border: `1px solid ${i === 0 ? 'var(--lc-text-muted)' : 'var(--lc-border)'}`,
              color: i === 0 ? 'var(--lc-text)' : 'var(--lc-text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <cat.icon size={14} /> {cat.label}
            </button>
          ))}
        </div>

        {/* Difficulty filter row */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['', 'EASY', 'MEDIUM', 'HARD'].map(d => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className={diffFilter === d ? 'lc-btn-primary' : 'lc-btn'}
              style={{ padding: '4px 12px', fontSize: 12, borderRadius: 14 }}>
              {d === '' ? 'All' : d === 'EASY' ? 'Easy' : d === 'MEDIUM' ? 'Medium' : 'Hard'}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--lc-bg-layer2)', padding: '7px 12px',
            borderRadius: 'var(--radius)', border: '1px solid var(--lc-border)', flex: '0 0 260px',
          }}>
            <Search size={14} color="var(--lc-text-muted)" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search questions"
              style={{ background: 'none', border: 'none', color: 'var(--lc-text)', outline: 'none', fontSize: 13, fontFamily: 'inherit', width: '100%' }} />
          </div>
          <button className="lc-btn" style={{ padding: '6px 10px' }}>
            <ArrowUpDown size={14} />
          </button>
          <button className="lc-btn" style={{ padding: '6px 10px' }}>
            <Filter size={14} />
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ color: 'var(--lc-text-muted)', fontSize: 13 }}>
            {filtered.length}/{problems.length} Solved
          </span>
        </div>

        {/* Problem table */}
        <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--lc-text-muted)' }}>
              <span className="spinner" style={{ marginRight: 8 }} /> Loading problems...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--lc-text-muted)' }}>
              No problems match your search.
            </div>
          ) : filtered.map((p, idx) => (
            <Link to={`/problem/${p.problemId}`} key={p.problemId}
              style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', padding: '11px 16px',
                background: idx % 2 === 0 ? 'var(--lc-bg-layer1)' : 'var(--lc-bg)',
                borderBottom: '1px solid var(--lc-border)',
                transition: 'background 0.1s', cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--lc-bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? 'var(--lc-bg-layer1)' : 'var(--lc-bg)')}>

                <div style={{ width: 30, flexShrink: 0, color: 'var(--lc-text-muted)' }}>
                  <span style={{ fontSize: 12 }}>—</span>
                </div>

                <div style={{ flex: 1, fontWeight: 500, fontSize: 14, color: 'var(--lc-text)' }}>
                  {p.problemId}. {p.title}
                </div>

                <div style={{ width: 70, textAlign: 'right', color: 'var(--lc-text-muted)', fontSize: 13 }}>
                  {getAcceptance(p.problemId)}%
                </div>

                <div style={{ width: 60, textAlign: 'right' }}>
                  <span className={getDiffClass(p.difficulty)} style={{ fontSize: 13, fontWeight: 500 }}>
                    {getDiffLabel(p.difficulty)}
                  </span>
                </div>

                <div style={{ width: 40, textAlign: 'right', color: 'var(--lc-text-muted)' }}>
                  <Unlock size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ width: 260, flexShrink: 0 }}>
        {/* Calendar */}
        <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              Day {new Date().getDate()} <span style={{ color: 'var(--lc-text-muted)', fontSize: 11 }}>
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <ChevronLeft size={14} color="var(--lc-text-muted)" style={{ cursor: 'pointer' }} />
              <ChevronRight size={14} color="var(--lc-text-muted)" style={{ cursor: 'pointer' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--lc-text-muted)', padding: 4 }}>{d}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 2;
              const today = new Date().getDate();
              return (
                <div key={i} style={{
                  fontSize: 12, padding: 4, borderRadius: 4,
                  color: day === today ? '#1a1a1a' : day > 0 && day <= 30 ? 'var(--lc-text-secondary)' : 'var(--lc-text-muted)',
                  background: day === today ? 'var(--lc-brand)' : 'transparent',
                  fontWeight: day === today ? 700 : 400,
                }}>
                  {day > 0 && day <= 30 ? day : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trending Companies */}
        <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Trending Companies</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <ChevronLeft size={14} color="var(--lc-text-muted)" style={{ cursor: 'pointer' }} />
              <ChevronRight size={14} color="var(--lc-text-muted)" style={{ cursor: 'pointer' }} />
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--lc-bg-layer2)', padding: '6px 10px',
            borderRadius: 'var(--radius)', border: '1px solid var(--lc-border)', marginBottom: 12,
          }}>
            <Search size={13} color="var(--lc-text-muted)" />
            <span style={{ color: 'var(--lc-text-muted)', fontSize: 12 }}>Search for a company...</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { n: 'Uber', c: 362 }, { n: 'Google', c: 2259 }, { n: 'Amazon', c: 1967 },
              { n: 'Microsoft', c: 1375 }, { n: 'Apple', c: 811 }, { n: 'Bloomberg', c: 1179 },
              { n: 'Meta', c: 1385 }, { n: 'Adobe', c: 158 }, { n: 'Airbnb', c: 62 }, { n: 'TikTok', c: 357 },
            ].map((co, i) => (
              <span key={i} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 14, fontSize: 12,
                background: 'var(--lc-bg-layer2)', color: 'var(--lc-text-secondary)',
                cursor: 'pointer',
              }}>
                {co.n} <span style={{
                  background: 'var(--lc-brand)', color: '#1a1a1a',
                  fontSize: 10, fontWeight: 700, padding: '0 5px', borderRadius: 8,
                }}>{co.c}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemList;
