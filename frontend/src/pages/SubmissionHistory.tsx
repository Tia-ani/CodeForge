import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { submissionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { History, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface Submission {
  submissionId: number;
  problemId: number;
  problemTitle: string;
  language: string;
  verdict: string;
  runtime: number;
  submittedAt: string;
}

const SubmissionHistory = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    submissionAPI.getMySubmissions()
      .then(res => { setSubmissions(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const getVerdictIcon = (v: string) => {
    switch (v) {
      case 'ACCEPTED': return <CheckCircle2 size={16} color="var(--success)" />;
      case 'WRONG_ANSWER': return <XCircle size={16} color="var(--error)" />;
      case 'TLE': return <Clock size={16} color="var(--warning)" />;
      default: return <AlertTriangle size={16} color="var(--accent-purple)" />;
    }
  };

  const getVerdictClass = (v: string) => {
    switch (v) {
      case 'ACCEPTED': return 'verdict-accepted';
      case 'WRONG_ANSWER': return 'verdict-wrong';
      case 'TLE': return 'verdict-tle';
      default: return 'verdict-ce';
    }
  };

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.5rem' }}>
        <History size={28} color="var(--accent-primary)" />
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>My Submissions</h1>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Problem</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Language</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Verdict</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Runtime</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <span className="spinner" style={{ marginRight: 8 }} /> Loading...
              </td></tr>
            ) : submissions.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No submissions yet. <Link to="/problems" style={{ color: 'var(--accent-primary)' }}>Start solving!</Link>
              </td></tr>
            ) : submissions.map((s) => (
              <tr key={s.submissionId} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <Link to={`/problem/${s.problemId}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {s.problemTitle}
                  </Link>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {s.language}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {getVerdictIcon(s.verdict)}
                    <span className={getVerdictClass(s.verdict)} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {s.verdict.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {s.runtime?.toFixed(2) || '—'} ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionHistory;
