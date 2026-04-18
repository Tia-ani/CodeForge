import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Eye, CheckSquare, MessageCircle, Star, ClipboardList, List, FileEdit, ChevronRight } from 'lucide-react';

interface ProfileData {
  userId: number; name: string; email: string; role: string; rank: number;
  totalSolved: number; totalAttempting: number; totalProblems: number; totalScore: number;
  solvedByDifficulty: { EASY: number; MEDIUM: number; HARD: number };
  totalByDifficulty: { EASY: number; MEDIUM: number; HARD: number };
  totalSubmissions: number;
  heatmapData: Record<string, number>;
  recentAccepted: { problemId: number; problemTitle: string; language: string; submittedAt: string }[];
  languages: { language: string; count: number }[];
}

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

const Profile = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recent' | 'list' | 'solutions'>('recent');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize
    if (!isAuthenticated) { navigate('/auth'); return; }
    profileAPI.getProfile()
      .then(res => { setProfile(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAuthenticated, authLoading, navigate]);

  // Draw donut chart
  useEffect(() => {
    if (!canvasRef.current || !profile) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const size = 160;
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = `${size}px`; canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2, cy = size / 2, r = 58, lineWidth = 10;
    const total = profile.totalProblems || 1;
    const segments = [
      { value: profile.solvedByDifficulty.EASY, color: '#00b8a3' },
      { value: profile.solvedByDifficulty.MEDIUM, color: '#ffc01e' },
      { value: profile.solvedByDifficulty.HARD, color: '#ff375f' },
    ];

    // BG circle
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#3e3e3e'; ctx.lineWidth = lineWidth; ctx.stroke();

    // Segments
    let startAngle = -Math.PI / 2;
    for (const seg of segments) {
      if (seg.value === 0) continue;
      const sweepAngle = (seg.value / total) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, startAngle + sweepAngle);
      ctx.strokeStyle = seg.color; ctx.lineWidth = lineWidth; ctx.lineCap = 'round'; ctx.stroke();
      startAngle += sweepAngle;
    }

    // Center text
    ctx.fillStyle = '#eff1f6'; ctx.font = 'bold 28px Inter';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(profile.totalSolved), cx, cy - 6);
    ctx.fillStyle = '#ffffff59'; ctx.font = '11px Inter';
    ctx.fillText(`/${total}`, cx + 14, cy - 4);
    ctx.fillStyle = '#ffffff80'; ctx.font = '11px Inter';
    ctx.fillText('Solved', cx, cy + 16);
  }, [profile]);

  const generateHeatmapCells = () => {
    const cells = [];
    const now = new Date();
    for (let week = 0; week < 53; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(now);
        date.setDate(now.getDate() - ((52 - week) * 7 + (6 - day)));
        const dateStr = date.toISOString().split('T')[0];
        const count = profile?.heatmapData[dateStr] || 0;
        const color = count === 0 ? '#282828' : count === 1 ? '#0e4429' : count <= 3 ? '#006d32' : count <= 5 ? '#26a641' : '#39d353';
        cells.push(<div key={`${week}-${day}`} title={`${dateStr}: ${count} submissions`} style={{
          width: 11, height: 11, borderRadius: 2, background: color,
          gridColumn: week + 1, gridRow: day + 1,
        }} />);
      }
    }
    return cells;
  };

  const getTimeDiff = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  if (authLoading || loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><span className="spinner" /></div>;
  if (!profile) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--lc-text-muted)' }}>Could not load profile.</div>;

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Left Column */}
        <div style={{ width: 280, flexShrink: 0 }}>
          {/* User card */}
          <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--lc-brand), #ff6b00)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 700, color: '#1a1a1a',
              }}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{profile.name}</div>
                <div style={{ color: 'var(--lc-text-muted)', fontSize: 13 }}>{profile.email}</div>
                <div style={{ color: 'var(--lc-text-muted)', fontSize: 13, marginTop: 4 }}>
                  Rank <span style={{ color: 'var(--lc-text)', fontWeight: 600 }}>{profile.rank.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--lc-text-muted)', marginBottom: 16 }}>
              <span>0 Following</span> <span>0 Followers</span>
            </div>
            <button className="lc-btn" style={{ width: '100%', padding: '8px 0', fontSize: 14, fontWeight: 600 }}>
              Edit Profile
            </button>
          </div>

          {/* Community Stats */}
          <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Community Stats</div>
            {[
              { Icon: Eye, label: 'Views', val: 0 },
              { Icon: CheckSquare, label: 'Solution', val: profile.totalSolved },
              { Icon: MessageCircle, label: 'Discuss', val: 0 },
              { Icon: Star, label: 'Reputation', val: profile.totalScore },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                    <s.Icon size={15} color="var(--lc-text-secondary)" />
                    <span style={{ fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontWeight: 600 }}>{s.val}</span>
                  </div>
                  <div style={{ color: 'var(--lc-text-muted)', fontSize: 12, marginLeft: 26, marginTop: 2 }}>Last week 0</div>
                </div>
              </div>
            ))}
          </div>

          {/* Languages */}
          <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Languages</div>
            {profile.languages.length === 0 ? (
              <div style={{ color: 'var(--lc-text-muted)', fontSize: 13 }}>No submissions yet</div>
            ) : profile.languages.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ background: 'var(--lc-bg-layer2)', padding: '2px 10px', borderRadius: 4, color: 'var(--lc-text-secondary)' }}>
                  {l.language}
                </span>
                <span style={{ color: 'var(--lc-text-muted)' }}>{l.count} problems solved</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ flex: 1 }}>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{
              background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)',
              padding: 20, flex: 1, display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <canvas ref={canvasRef} style={{ width: 160, height: 160 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Easy', solved: profile.solvedByDifficulty.EASY, total: profile.totalByDifficulty.EASY, color: 'var(--lc-easy)', bg: 'var(--lc-easy-bg)' },
                  { label: 'Med.', solved: profile.solvedByDifficulty.MEDIUM, total: profile.totalByDifficulty.MEDIUM, color: 'var(--lc-medium)', bg: 'var(--lc-medium-bg)' },
                  { label: 'Hard', solved: profile.solvedByDifficulty.HARD, total: profile.totalByDifficulty.HARD, color: 'var(--lc-hard)', bg: 'var(--lc-hard-bg)' },
                ].map((d, i) => (
                  <div key={i} style={{
                    background: d.bg, padding: '6px 14px', borderRadius: 6,
                    fontSize: 13, fontWeight: 600, color: d.color, minWidth: 80, textAlign: 'center',
                  }}>
                    {d.label} <span style={{ fontWeight: 400 }}>{d.solved}/{d.total}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'auto', color: 'var(--lc-text-muted)', fontSize: 12 }}>
                {profile.totalAttempting} Attempting
              </div>
            </div>

            <div style={{
              background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', padding: 20, width: 200,
            }}>
              <div style={{ color: 'var(--lc-text-muted)', fontSize: 12, marginBottom: 4 }}>Badges</div>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>0</div>
              <div style={{ borderTop: '1px solid var(--lc-border)', paddingTop: 12 }}>
                <div style={{ color: 'var(--lc-text-muted)', fontSize: 12 }}>Locked Badge</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Apr CodeForge Challenge</div>
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {profile.totalSubmissions} submissions in the past one year
              </span>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--lc-text-muted)' }}>
                <span>Total active days: {Object.keys(profile.heatmapData).length}</span>
                <span>Max streak: {Object.keys(profile.heatmapData).length}</span>
                <button className="lc-btn" style={{ padding: '3px 10px', fontSize: 12 }}>Current</button>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 11px)', gridAutoFlow: 'column', gap: 3, overflowX: 'auto', paddingBottom: 20 }}>
                {generateHeatmapCells()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, color: 'var(--lc-text-muted)', fontSize: 11 }}>
                {MONTHS.map((m, i) => <span key={i}>{m}</span>)}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--lc-border)' }}>
              {[
                { key: 'recent', Icon: ClipboardList, label: 'Recent AC' },
                { key: 'list', Icon: List, label: 'List' },
                { key: 'solutions', Icon: FileEdit, label: 'Solutions' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    padding: '12px 20px', background: 'none', border: 'none',
                    borderBottom: activeTab === tab.key ? '2px solid var(--lc-text)' : '2px solid transparent',
                    color: activeTab === tab.key ? 'var(--lc-text)' : 'var(--lc-text-muted)',
                    fontWeight: activeTab === tab.key ? 600 : 400,
                    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <tab.Icon size={14} /> {tab.label}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button className="lc-btn" onClick={() => navigate('/submissions')}
                style={{ margin: '8px 12px', padding: '4px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                View all submissions <ChevronRight size={12} />
              </button>
            </div>

            <div>
              {profile.recentAccepted.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--lc-text-muted)' }}>
                  No accepted submissions yet. Start solving problems!
                </div>
              ) : profile.recentAccepted.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '13px 20px', borderBottom: '1px solid var(--lc-border)',
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                onClick={() => navigate(`/problem/${s.problemId}`)}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--lc-bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{s.problemTitle}</span>
                  <span style={{ color: 'var(--lc-text-muted)', fontSize: 13 }}>{getTimeDiff(s.submittedAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
