import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Send, ChevronLeft, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { problemAPI, submissionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ProblemDetail {
  problemId: number;
  title: string;
  description: string;
  difficulty: string;
  constraints: string;
  examples: { input: string; expectedOutput: string }[];
}

interface SubmissionResult {
  submissionId: number;
  verdict: string;
  runtime: number;
  language: string;
}

const BOILERPLATE: Record<string, string> = {
  java: 'import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
  python: 'class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        pass',
  cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};',
};

const Ide = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState(BOILERPLATE.java);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [history, setHistory] = useState<SubmissionResult[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');

  useEffect(() => {
    if (id) {
      problemAPI.getById(Number(id))
        .then(res => setProblem(res.data))
        .catch(() => {
          // Fallback for when backend is not running
          setProblem({
            problemId: Number(id),
            title: 'Two Sum',
            description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.',
            difficulty: 'EASY',
            constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
            examples: [
              { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
              { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
            ],
          });
        });

      // Load submission history for this problem
      if (isAuthenticated) {
        submissionAPI.getForProblem(Number(id))
          .then(res => setHistory(res.data))
          .catch(() => {});
      }
    }
  }, [id, isAuthenticated]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(BOILERPLATE[lang] || '');
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await submissionAPI.submit({
        problemId: Number(id),
        language,
        code,
      });
      setResult(res.data);
      // Refresh history
      submissionAPI.getForProblem(Number(id))
        .then(r => setHistory(r.data))
        .catch(() => {});
    } catch (err: any) {
      setResult({
        submissionId: 0,
        verdict: err.response?.data?.error || 'ERROR',
        runtime: 0,
        language,
      });
    } finally {
      setSubmitting(false);
    }
  };

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
      case 'PENDING': return 'verdict-pending';
      default: return 'verdict-ce';
    }
  };

  const getBadge = (d: string) => {
    switch (d) { case 'EASY': return 'badge-easy'; case 'MEDIUM': return 'badge-medium'; case 'HARD': return 'badge-hard'; default: return ''; }
  };

  if (!problem) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 60px)' }}>
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 53px)' }}>

      {/* ── Left Panel: Problem Description ─────────────── */}
      <div style={{
        width: '45%', minWidth: 350, display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--border)', background: 'var(--bg-darker)',
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', borderBottom: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <button onClick={() => navigate('/problems')} className="btn-ghost"
            style={{ padding: '0.7rem 0.75rem', borderRight: '1px solid var(--border)' }}>
            <ChevronLeft size={16} />
          </button>
          {(['description', 'submissions'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.7rem 1.25rem', background: 'transparent', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
                textTransform: 'capitalize',
              }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {activeTab === 'description' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{problem.problemId}. {problem.title}</h1>
                <span className={getBadge(problem.difficulty)}>{problem.difficulty}</span>
              </div>

              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {problem.description.split('\n').map((line, i) => (
                  <p key={i} style={{ marginBottom: line ? '0.5rem' : '0.75rem' }}>
                    {line.split('`').map((part, j) =>
                      j % 2 === 1 ? <code key={j} className="code-font" style={{
                        background: 'rgba(59,130,246,0.1)', padding: '0.1rem 0.4rem',
                        borderRadius: '4px', fontSize: '0.85rem', color: 'var(--accent-primary)',
                      }}>{part}</code> : part
                    )}
                  </p>
                ))}
              </div>

              {/* Examples */}
              {problem.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    Example {i + 1}:
                  </h3>
                  <pre className="code-font" style={{
                    background: 'rgba(15, 23, 42, 0.8)', padding: '1rem',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                    fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Input: </span>{ex.input}{'\n'}
                    <span style={{ color: 'var(--text-muted)' }}>Output: </span><span style={{ color: 'var(--success)' }}>{ex.expectedOutput}</span>
                  </pre>
                </div>
              ))}

              {/* Constraints */}
              {problem.constraints && (
                <div style={{ marginTop: '1rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Constraints:</h3>
                  <pre className="code-font" style={{
                    background: 'rgba(15, 23, 42, 0.8)', padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                    fontSize: '0.8rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)',
                  }}>
                    {problem.constraints}
                  </pre>
                </div>
              )}
            </>
          ) : (
            /* Submissions Tab */
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Submission History</h2>
              {!isAuthenticated ? (
                <p style={{ color: 'var(--text-muted)' }}>Please sign in to view submissions.</p>
              ) : history.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No submissions yet for this problem.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {history.map((s, i) => (
                    <div key={i} className="glass-card" style={{
                      padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getVerdictIcon(s.verdict)}
                        <span className={getVerdictClass(s.verdict)} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {s.verdict.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <span>{s.language}</span>
                        <span>{s.runtime?.toFixed(2) || '—'} ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel: Code Editor ───────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>

        {/* Toolbar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.4rem 0.75rem', background: '#252526',
          borderBottom: '1px solid #333',
        }}>
          <select value={language} onChange={e => handleLanguageChange(e.target.value)}
            style={{
              background: '#3c3c3c', color: 'white', border: '1px solid #555',
              padding: '0.3rem 0.6rem', borderRadius: '4px', outline: 'none',
              fontFamily: 'inherit', fontSize: '0.85rem',
            }}>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSubmit} disabled={submitting}
              className="btn-success"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {submitting ? <span className="spinner" /> : <Send size={14} />}
              {submitting ? 'Judging...' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              padding: { top: 12 },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
            }}
          />
        </div>

        {/* Console / Result Panel */}
        <div style={{
          height: result ? 160 : 80,
          background: '#1a1a1a', borderTop: '1px solid #333',
          padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column',
          transition: 'height 0.3s',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#888', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Console</span>
            {result && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getVerdictIcon(result.verdict)}
                <span className={getVerdictClass(result.verdict)} style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {result.verdict.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
          <div className="code-font" style={{
            flex: 1, background: '#111', borderRadius: '4px', padding: '0.6rem',
            color: result?.verdict === 'ACCEPTED' ? '#0f0' : result ? '#f66' : '#666',
            fontSize: '0.8rem', overflowY: 'auto', lineHeight: 1.6,
          }}>
            {submitting ? (
              <span style={{ color: '#ff0' }}>⏳ Compiling and running test cases...</span>
            ) : result ? (
              <>
                <div>Verdict: <strong>{result.verdict.replace('_', ' ')}</strong></div>
                <div>Runtime: {result.runtime?.toFixed(2) || '—'} ms</div>
                <div>Language: {result.language}</div>
                {result.verdict === 'ACCEPTED' && <div style={{ marginTop: 4, color: '#0f0' }}>✓ All test cases passed!</div>}
              </>
            ) : (
              '> Ready. Write your solution and click Submit.'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ide;
