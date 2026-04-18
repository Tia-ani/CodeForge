import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { submissionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Submission {
  submissionId: number; problemId: number; problemTitle: string;
  language: string; verdict: string; runtime: number; submittedAt: string;
}

const SubmissionHistory = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize
    if (!isAuthenticated) { navigate('/auth'); return; }
    submissionAPI.getMySubmissions()
      .then(res => { setSubmissions(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAuthenticated, authLoading, navigate]);

  const getVerdictIcon = (v: string) => {
    if (v === 'ACCEPTED') return <CheckCircle2 size={14} color="var(--lc-accepted)" />;
    if (v === 'WRONG_ANSWER') return <XCircle size={14} color="var(--lc-wrong)" />;
    if (v === 'TLE') return <Clock size={14} color="var(--lc-medium)" />;
    return <AlertCircle size={14} color="var(--lc-text-muted)" />;
  };

  const verdictColor = (v: string) => {
    if (v === 'ACCEPTED') return 'var(--lc-accepted)';
    if (v === 'WRONG_ANSWER') return 'var(--lc-wrong)';
    if (v === 'TLE') return 'var(--lc-medium)';
    return 'var(--lc-text-muted)';
  };

  if (authLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><span className="spinner" /></div>;

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>My Submissions</div>

      <div style={{ background: 'var(--lc-bg-layer1)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 90px 140px 80px',
          padding: '12px 20px', borderBottom: '1px solid var(--lc-border)',
          color: 'var(--lc-text-muted)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          <span>Problem</span><span>Language</span><span>Verdict</span><span style={{ textAlign: 'right' }}>Runtime</span>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--lc-text-muted)' }}><span className="spinner" /></div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--lc-text-muted)' }}>
            No submissions yet. <Link to="/problems" style={{ color: 'var(--lc-brand)' }}>Start solving!</Link>
          </div>
        ) : submissions.map(s => (
          <Link to={`/problem/${s.problemId}`} key={s.submissionId} style={{ display: 'block' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 90px 140px 80px',
              padding: '12px 20px', borderBottom: '1px solid var(--lc-border)',
              alignItems: 'center', transition: 'background 0.1s', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--lc-bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{s.problemTitle}</span>
              <span style={{ color: 'var(--lc-text-muted)', fontSize: 13 }}>{s.language}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: verdictColor(s.verdict), fontWeight: 600, fontSize: 13 }}>
                {getVerdictIcon(s.verdict)} {s.verdict.replace('_', ' ')}
              </span>
              <span style={{ textAlign: 'right', color: 'var(--lc-text-muted)', fontSize: 13 }}>
                {s.runtime?.toFixed(1) || '—'} ms
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubmissionHistory;
