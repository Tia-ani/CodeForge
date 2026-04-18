import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { problemAPI, submissionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Play, RotateCcw, ChevronDown, Terminal } from 'lucide-react';

interface ProblemDetail {
  problemId: number; title: string; description: string;
  difficulty: string; constraints: string;
  examples: { input: string; expectedOutput: string }[];
}

const BOILERPLATE: Record<string, string> = {
  java: 'import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
  python: 'class Solution:\n    def solve(self, *args):\n        # Write your code here\n        pass\n',
  cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};',
};

const Ide = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(BOILERPLATE.python);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');

  useEffect(() => {
    if (id) {
      problemAPI.getById(Number(id)).then(res => setProblem(res.data)).catch(() => {});
      if (isAuthenticated) {
        submissionAPI.getForProblem(Number(id)).then(res => setHistory(res.data)).catch(() => {});
      }
    }
  }, [id, isAuthenticated]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(BOILERPLATE[lang] || '');
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await submissionAPI.submit({ problemId: Number(id), language, code });
      setResult(res.data);
      submissionAPI.getForProblem(Number(id)).then(r => setHistory(r.data)).catch(() => {});
    } catch (err: any) {
      setResult({ verdict: err.response?.data?.error || 'ERROR', runtime: 0, language });
    } finally {
      setSubmitting(false);
    }
  };

  const getDiffClass = (d: string) => d === 'EASY' ? 'diff-easy' : d === 'MEDIUM' ? 'diff-medium' : 'diff-hard';

  if (!problem) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 50px)' }}><span className="spinner" /></div>;
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>

      {/* Left Panel — Problem Description */}
      <div style={{
        width: '45%', minWidth: 360, display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--lc-border)', background: 'var(--lc-bg)',
      }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--lc-border)', background: 'var(--lc-bg-layer1)' }}>
          <button onClick={() => navigate('/problems')} className="lc-btn"
            style={{ borderRadius: 0, border: 'none', borderRight: '1px solid var(--lc-border)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Back
          </button>
          {(['description', 'submissions'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 18px', background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--lc-brand)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--lc-text)' : 'var(--lc-text-muted)',
                fontWeight: activeTab === tab ? 600 : 400, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
              }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {activeTab === 'description' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 20, fontWeight: 700 }}>{problem.problemId}. {problem.title}</span>
                <span className={getDiffClass(problem.difficulty)} style={{ fontSize: 13, fontWeight: 500 }}>
                  {problem.difficulty === 'EASY' ? 'Easy' : problem.difficulty === 'MEDIUM' ? 'Medium' : 'Hard'}
                </span>
              </div>

              <div style={{ color: 'var(--lc-text-secondary)', lineHeight: 1.8, fontSize: 14, marginBottom: 20 }}>
                {problem.description.split('\n').map((line, i) => (
                  <p key={i} style={{ marginBottom: line ? 6 : 12 }}>
                    {line.split('`').map((part, j) =>
                      j % 2 === 1 ? <code key={j} className="code-font" style={{
                        background: 'var(--lc-bg-layer2)', padding: '1px 6px',
                        borderRadius: 4, fontSize: 13, color: 'var(--lc-brand)',
                      }}>{part}</code> : part
                    )}
                  </p>
                ))}
              </div>

              {problem.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Example {i + 1}:</div>
                  <div className="code-font" style={{
                    background: 'var(--lc-bg-layer1)', padding: 14, borderRadius: 'var(--radius)',
                    border: '1px solid var(--lc-border)', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap',
                  }}>
                    <span style={{ color: 'var(--lc-text-muted)' }}>Input: </span>{ex.input}{'\n'}
                    <span style={{ color: 'var(--lc-text-muted)' }}>Output: </span><span style={{ color: 'var(--lc-accepted)' }}>{ex.expectedOutput}</span>
                  </div>
                </div>
              ))}

              {problem.constraints && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Constraints:</div>
                  <div className="code-font" style={{
                    background: 'var(--lc-bg-layer1)', padding: 12, borderRadius: 'var(--radius)',
                    border: '1px solid var(--lc-border)', fontSize: 12, lineHeight: 1.7,
                    whiteSpace: 'pre-wrap', color: 'var(--lc-text-secondary)',
                  }}>{problem.constraints}</div>
                </div>
              )}
            </>
          ) : (
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Submission History</div>
              {!isAuthenticated ? (
                <div style={{ color: 'var(--lc-text-muted)' }}>Please sign in to view submissions.</div>
              ) : history.length === 0 ? (
                <div style={{ color: 'var(--lc-text-muted)' }}>No submissions yet for this problem.</div>
              ) : history.map((s: any, i: number) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: 'var(--lc-bg-layer1)',
                  borderRadius: 'var(--radius)', marginBottom: 6, border: '1px solid var(--lc-border)',
                }}>
                  <span style={{
                    fontWeight: 600, fontSize: 13,
                    color: s.verdict === 'ACCEPTED' ? 'var(--lc-accepted)' : 'var(--lc-wrong)',
                  }}>
                    {s.verdict.replace('_', ' ')}
                  </span>
                  <div style={{ display: 'flex', gap: 12, color: 'var(--lc-text-muted)', fontSize: 12 }}>
                    <span>{s.language}</span>
                    <span>{s.runtime?.toFixed(1)} ms</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — Code Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '6px 12px', background: '#252526', borderBottom: '1px solid #333',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <select value={language} onChange={e => handleLanguageChange(e.target.value)}
              style={{
                background: '#3c3c3c', color: 'white', border: '1px solid #555',
                padding: '4px 10px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', outline: 'none',
              }}>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="lc-btn" onClick={() => setCode(BOILERPLATE[language])}
              style={{ padding: '4px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <RotateCcw size={12} /> Reset
            </button>
            <button className="lc-btn-success" onClick={handleSubmit} disabled={submitting}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', fontSize: 13 }}>
              {submitting ? <span className="spinner" /> : <Play size={14} />} Submit
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div style={{ flex: 1 }}>
          <Editor height="100%" language={language === 'cpp' ? 'cpp' : language}
            theme="vs-dark" value={code} onChange={val => setCode(val || '')}
            options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'JetBrains Mono', monospace",
              padding: { top: 12 }, scrollBeyondLastLine: false, wordWrap: 'on' }} />
        </div>

        {/* Console */}
        <div style={{
          height: result ? 130 : 50, background: '#1a1a1a',
          borderTop: '1px solid #333', padding: '8px 14px', transition: 'height 0.2s',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#666', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Terminal size={12} /> Console
            </span>
            {result && (
              <span style={{
                fontWeight: 700, fontSize: 14,
                color: result.verdict === 'ACCEPTED' ? 'var(--lc-accepted)' : 'var(--lc-wrong)',
              }}>
                {result.verdict?.replace('_', ' ')}
              </span>
            )}
          </div>
          {result && (
            <div className="code-font" style={{
              marginTop: 6, padding: 8, background: '#111', borderRadius: 4,
              color: result.verdict === 'ACCEPTED' ? '#0f0' : '#f66', fontSize: 12, lineHeight: 1.6,
            }}>
              <div>Verdict: <strong>{result.verdict?.replace('_', ' ')}</strong></div>
              <div>Runtime: {result.runtime?.toFixed(1)} ms</div>
              {result.verdict === 'ACCEPTED' && <div style={{ color: '#0f0', marginTop: 2 }}>All test cases passed!</div>}
            </div>
          )}
          {!result && !submitting && (
            <div className="code-font" style={{ marginTop: 6, color: '#555', fontSize: 12 }}>
              {'>'} Ready.
            </div>
          )}
          {submitting && (
            <div className="code-font" style={{ marginTop: 6, color: '#ff0', fontSize: 12 }}>
              Judging...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ide;
