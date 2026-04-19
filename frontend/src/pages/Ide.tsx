import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { problemAPI, submissionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Play, RotateCcw, CheckCircle2, XCircle, Clock, AlertTriangle, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProblemDetail {
  problemId: number; title: string; description: string;
  difficulty: string; tag: string; constraints: string;
  examples: { input: string; expectedOutput: string }[];
}

interface TraceStep {
  line_number: number;
  variable_snapshots: Record<string, any>;
  call_stack_depth: number;
  function_name?: string;
}

const BOILERPLATE: Record<string, string> = {
  java: 'import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
  python: 'class Solution:\n    def solve(self, *args):\n        # Write your code here\n        pass\n',
  cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};',
};

const VERDICT_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  ACCEPTED: { color: '#4CAF50', icon: CheckCircle2, label: 'Accepted' },
  WRONG_ANSWER: { color: '#F44336', icon: XCircle, label: 'Wrong Answer' },
  TIME_LIMIT_EXCEEDED: { color: '#FF9800', icon: Clock, label: 'Time Limit Exceeded' },
  RUNTIME_ERROR: { color: '#F44336', icon: AlertTriangle, label: 'Runtime Error' },
  COMPILATION_ERROR: { color: '#F44336', icon: AlertTriangle, label: 'Compilation Error' },
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
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'result'>('testcase');
  const [traceData, setTraceData] = useState<TraceStep[] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTrace, setShowTrace] = useState(false);
  const [loadingTrace, setLoadingTrace] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (id) {
      problemAPI.getById(Number(id)).then(res => {
        setProblem(res.data);
        // Set default test input from first example
        if (res.data.examples && res.data.examples.length > 0) {
          setTestInput(res.data.examples[0].input);
        }
      }).catch(() => {});
      if (isAuthenticated) {
        submissionAPI.getForProblem(Number(id)).then(res => setHistory(res.data)).catch(() => {});
      }
    }
  }, [id, isAuthenticated]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(BOILERPLATE[lang] || '');
    setShowTrace(false);
    setTraceData(null);
  };

  const handleViewTrace = async () => {
    if (!result?.submissionId) return;
    
    setLoadingTrace(true);
    try {
      const res = await submissionAPI.getTrace(result.submissionId);
      setTraceData(res.data.trace);
      setCurrentStep(0);
      setShowTrace(true);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to load trace');
    } finally {
      setLoadingTrace(false);
    }
  };

  const handleCloseTrace = () => {
    setShowTrace(false);
    setTraceData(null);
    setCurrentStep(0);
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleNextStep = () => {
    if (traceData) {
      setCurrentStep(Math.min(traceData.length - 1, currentStep + 1));
    }
  };

  // Update editor decorations when trace step changes
  useEffect(() => {
    if (showTrace && traceData && editorRef.current) {
      const editor = editorRef.current;
      const monaco = (window as any).monaco;
      
      if (monaco && traceData[currentStep]) {
        const lineNumber = traceData[currentStep].line_number;
        
        // Highlight current line
        const decorations = editor.deltaDecorations([], [
          {
            range: new monaco.Range(lineNumber, 1, lineNumber, 1),
            options: {
              isWholeLine: true,
              className: 'trace-highlight-line',
              glyphMarginClassName: 'trace-highlight-glyph',
            }
          }
        ]);
        
        // Scroll to line
        editor.revealLineInCenter(lineNumber);
        
        return () => {
          editor.deltaDecorations(decorations, []);
        };
      }
    }
  }, [showTrace, traceData, currentStep]);

  const handleRun = async () => {
    if (!isAuthenticated) { 
      navigate('/auth'); 
      return; 
    }
    
    if (!testInput.trim()) {
      setTestOutput('❌ Please enter test input');
      setConsoleTab('result');
      return;
    }
    
    setIsRunning(true);
    setTestOutput('Running your code...');
    setConsoleTab('result');
    
    try {
      const res = await submissionAPI.run({ 
        problemId: Number(id), 
        language, 
        code,
        input: testInput 
      });
      
      const { output, runtime, error } = res.data;
      
      if (error) {
        setTestOutput(`❌ Error:\n\n${error}`);
      } else {
        setTestOutput(`✓ Executed successfully\n\nInput:\n${testInput}\n\nOutput:\n${output}\n\nRuntime: ${runtime?.toFixed(1)} ms`);
      }
    } catch (err: any) {
      setTestOutput(`❌ Error: ${err.message || 'Failed to run code'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    setSubmitting(true);
    setResult(null);
    setConsoleTab('result');
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

  const verdictInfo = result ? (VERDICT_CONFIG[result.verdict] || { color: '#ef4743', icon: XCircle, label: result.verdict }) : null;

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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 20, fontWeight: 700 }}>{problem.problemId}. {problem.title}</span>
                <span className={getDiffClass(problem.difficulty)} style={{ fontSize: 13, fontWeight: 500 }}>
                  {problem.difficulty === 'EASY' ? 'Easy' : problem.difficulty === 'MEDIUM' ? 'Medium' : 'Hard'}
                </span>
                <span style={{
                  padding: '2px 10px', borderRadius: 10, fontSize: 11,
                  background: 'var(--lc-bg-layer2)', color: 'var(--lc-text-muted)', fontWeight: 500,
                }}>
                  {problem.tag}
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

              {/* Test Cases Section */}
              {problem.examples && problem.examples.length > 0 && (
                <div style={{ marginTop: 24, marginBottom: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--lc-text)' }}>
                    Test Cases
                  </div>
                  <div style={{ 
                    background: 'var(--lc-bg-layer1)', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--lc-border)',
                    overflow: 'hidden',
                  }}>
                    {problem.examples.map((ex, i) => (
                      <div key={i} style={{
                        padding: '14px 16px',
                        borderBottom: i < problem.examples.length - 1 ? '1px solid var(--lc-border)' : 'none',
                      }}>
                        <div style={{ 
                          fontSize: 12, 
                          fontWeight: 600, 
                          color: 'var(--lc-brand)', 
                          marginBottom: 8,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Test Case {i + 1}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 11, color: 'var(--lc-text-muted)', marginBottom: 4, fontWeight: 600 }}>
                            INPUT:
                          </div>
                          <div className="code-font" style={{
                            background: 'var(--lc-bg)', 
                            padding: '8px 10px', 
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 12, 
                            lineHeight: 1.6,
                            color: 'var(--lc-text-secondary)',
                            whiteSpace: 'pre-wrap',
                            border: '1px solid var(--lc-border)',
                          }}>
                            {ex.input}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--lc-text-muted)', marginBottom: 4, fontWeight: 600 }}>
                            EXPECTED OUTPUT:
                          </div>
                          <div className="code-font" style={{
                            background: 'var(--lc-bg)', 
                            padding: '8px 10px', 
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 12, 
                            lineHeight: 1.6,
                            color: 'var(--lc-accepted)',
                            whiteSpace: 'pre-wrap',
                            border: '1px solid var(--lc-border)',
                            fontWeight: 600,
                          }}>
                            {ex.expectedOutput}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
            <button className="lc-btn" onClick={handleRun} disabled={isRunning}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', fontSize: 13, background: '#3c3c3c' }}>
              {isRunning ? <span className="spinner" /> : <Play size={14} />} Run
            </button>
            <button className="lc-btn-success" onClick={handleSubmit} disabled={submitting}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', fontSize: 13 }}>
              {submitting ? <span className="spinner" /> : <CheckCircle2 size={14} />} Submit
            </button>
          </div>
        </div>

        {/* Monaco Editor with Trace Viewer */}
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Editor height="100%" language={language === 'cpp' ? 'cpp' : language}
              theme="vs-dark" value={code} onChange={val => setCode(val || '')}
              onMount={(editor) => { editorRef.current = editor; }}
              options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'JetBrains Mono', monospace",
                padding: { top: 12 }, scrollBeyondLastLine: false, wordWrap: 'on', readOnly: showTrace }} />
          </div>

          {/* Trace Viewer Sidebar */}
          {showTrace && traceData && (
            <div style={{
              width: 350,
              background: '#1e1e1e',
              borderLeft: '1px solid #333',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Trace Header */}
              <div style={{
                padding: '10px 12px',
                background: '#252526',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Eye size={16} color="var(--lc-brand)" strokeWidth={1.5} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--lc-brand)' }}>
                    Forge-Sight Tracer
                  </span>
                </div>
                <button onClick={handleCloseTrace}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Step Navigation */}
              <div style={{
                padding: '12px',
                background: '#252526',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <button onClick={handlePrevStep} disabled={currentStep === 0}
                  className="lc-btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    opacity: currentStep === 0 ? 0.5 : 1,
                  }}>
                  <ChevronLeft size={14} /> Prev
                </button>
                
                <span style={{ fontSize: 12, color: '#aaa' }}>
                  Step <strong style={{ color: 'var(--lc-brand)' }}>{currentStep + 1}</strong> / {traceData.length}
                </span>
                
                <button onClick={handleNextStep} disabled={currentStep === traceData.length - 1}
                  className="lc-btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    opacity: currentStep === traceData.length - 1 ? 0.5 : 1,
                  }}>
                  Next <ChevronRight size={14} />
                </button>
              </div>

              {/* Variable Inspector */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Line {traceData[currentStep].line_number}
                    {traceData[currentStep].function_name && (
                      <span> • {traceData[currentStep].function_name}()</span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: '#666' }}>
                    Call Depth: {traceData[currentStep].call_stack_depth}
                  </div>
                </div>

                <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Variables
                </div>

                {Object.keys(traceData[currentStep].variable_snapshots).length === 0 ? (
                  <div style={{ color: '#666', fontSize: 12, fontStyle: 'italic' }}>
                    No variables in scope
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.entries(traceData[currentStep].variable_snapshots).map(([key, value]) => (
                      <div key={key} style={{
                        background: '#252526',
                        padding: '8px 10px',
                        borderRadius: 4,
                        border: '1px solid #333',
                      }}>
                        <div style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#4ec9b0',
                          marginBottom: 4,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          {key}
                        </div>
                        <div style={{
                          fontSize: 11,
                          color: '#ce9178',
                          fontFamily: "'JetBrains Mono', monospace",
                          wordBreak: 'break-all',
                        }}>
                          {typeof value === 'string' ? `"${value}"` : JSON.stringify(value, null, 2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trace Info */}
                <div style={{
                  marginTop: 16,
                  padding: 10,
                  background: '#1a1a1a',
                  borderRadius: 4,
                  border: '1px solid #333',
                }}>
                  <div style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>
                    💡 Tip: Use Previous/Next to step through execution
                  </div>
                  <div style={{ fontSize: 10, color: '#666' }}>
                    🔍 Watch how variables change at each line
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Console — enhanced with tabs and scrollable */}
        <div style={{
          height: 280, background: '#1a1a1a',
          borderTop: '1px solid #333', display: 'flex', flexDirection: 'column',
        }}>
          {/* Console Header with Tabs */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #333',
            background: '#252526',
          }}>
            <button
              onClick={() => setConsoleTab('testcase')}
              style={{
                padding: '8px 16px',
                background: consoleTab === 'testcase' ? '#1a1a1a' : 'transparent',
                border: 'none',
                borderBottom: consoleTab === 'testcase' ? '2px solid var(--lc-brand)' : '2px solid transparent',
                color: consoleTab === 'testcase' ? 'var(--lc-text)' : 'var(--lc-text-muted)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Testcase
            </button>
            <button
              onClick={() => setConsoleTab('result')}
              style={{
                padding: '8px 16px',
                background: consoleTab === 'result' ? '#1a1a1a' : 'transparent',
                border: 'none',
                borderBottom: consoleTab === 'result' ? '2px solid var(--lc-brand)' : '2px solid transparent',
                color: consoleTab === 'result' ? 'var(--lc-text)' : 'var(--lc-text-muted)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Test Result
            </button>
          </div>

          {/* Console Content - Scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
            {consoleTab === 'testcase' ? (
              <div>
                <div style={{ color: '#aaa', fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
                  Test Input:
                </div>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter test input (one value per line)"
                  style={{
                    width: '100%',
                    minHeight: 120,
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: 4,
                    color: '#fff',
                    padding: 10,
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', monospace",
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
                <div style={{ marginTop: 8, fontSize: 11, color: '#666' }}>
                  💡 Tip: Enter each input parameter on a new line
                </div>
              </div>
            ) : (
              <div>
                {verdictInfo && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: '1px solid #333',
                  }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: verdictInfo.color,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      <verdictInfo.icon size={16} /> {verdictInfo.label}
                    </span>
                  </div>
                )}

                {result && (
                  <div className="code-font" style={{
                    fontSize: 12,
                    lineHeight: 1.7,
                  }}>
                    <div style={{ color: '#aaa', marginBottom: 8 }}>
                      Test Cases: <strong style={{ color: verdictInfo?.color }}>{result.passedTestCases || 0}/{result.totalTestCases || '?'}</strong> passed
                    </div>
                    <div style={{ color: '#aaa', marginBottom: 12 }}>
                      Runtime: <strong>{result.runtime?.toFixed(1)} ms</strong>
                    </div>

                    {result.verdict === 'ACCEPTED' && (
                      <div style={{
                        color: '#2cbb5d',
                        marginTop: 8,
                        fontWeight: 600,
                        padding: 12,
                        background: '#0a2a0a',
                        borderRadius: 6,
                        border: '1px solid #2cbb5d33',
                      }}>
                        ✓ All test cases passed! Great job!
                      </div>
                    )}

                    {result.verdict === 'WRONG_ANSWER' && result.failedTestCase && (
                      <div style={{
                        marginTop: 8,
                        padding: 12,
                        background: '#1a0000',
                        borderRadius: 6,
                        border: '1px solid #331111',
                      }}>
                        <div style={{ color: '#ef4743', fontWeight: 600, marginBottom: 8 }}>
                          ✗ Failed on Test Case {result.failedTestCase}
                        </div>
                        {result.failedInput && (
                          <div style={{ color: '#888', marginBottom: 4 }}>
                            Input: <span style={{ color: '#ccc' }}>{result.failedInput}</span>
                          </div>
                        )}
                        {result.expectedOutput && (
                          <div style={{ color: '#888', marginBottom: 4 }}>
                            Expected: <span style={{ color: '#2cbb5d' }}>{result.expectedOutput}</span>
                          </div>
                        )}
                        {result.actualOutput && (
                          <div style={{ color: '#888', marginBottom: 8 }}>
                            Your Output: <span style={{ color: '#ef4743' }}>{result.actualOutput}</span>
                          </div>
                        )}
                        
                        {/* Trace Execution Button */}
                        {result.submissionId && language === 'python' && (
                          <button
                            onClick={handleViewTrace}
                            disabled={loadingTrace}
                            className="lc-btn"
                            style={{
                              marginTop: 8,
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                              padding: '8px 12px',
                              fontSize: 12,
                              background: 'var(--lc-brand)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          >
                            {loadingTrace ? (
                              <>
                                <span className="spinner" /> Loading Trace...
                              </>
                            ) : (
                              <>
                                <Eye size={14} /> View Execution Trace
                              </>
                            )}
                          </button>
                        )}
                        
                        {language !== 'python' && (
                          <div style={{ marginTop: 8, fontSize: 10, color: '#666', fontStyle: 'italic' }}>
                            💡 Execution tracing is currently only available for Python
                          </div>
                        )}
                      </div>
                    )}

                    {(result.verdict === 'COMPILATION_ERROR' || result.verdict === 'RUNTIME_ERROR') && result.actualOutput && (
                      <div style={{
                        marginTop: 8,
                        padding: 12,
                        background: '#1a0000',
                        borderRadius: 6,
                        border: '1px solid #331111',
                        whiteSpace: 'pre-wrap',
                        fontSize: 11,
                        color: '#ef4743',
                        maxHeight: 150,
                        overflowY: 'auto',
                      }}>
                        {result.actualOutput}
                      </div>
                    )}

                    {result.verdict === 'TIME_LIMIT_EXCEEDED' && (
                      <div style={{
                        color: 'var(--lc-medium)',
                        marginTop: 8,
                        padding: 12,
                        background: '#2a1a00',
                        borderRadius: 6,
                        border: '1px solid var(--lc-medium-bg)',
                      }}>
                        ⏱ Test case {result.failedTestCase} exceeded the time limit ({result.runtime} ms)
                      </div>
                    )}
                  </div>
                )}

                {testOutput && !result && (
                  <div className="code-font" style={{
                    fontSize: 12,
                    color: '#ccc',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7,
                  }}>
                    {testOutput}
                  </div>
                )}

                {!result && !testOutput && !submitting && !isRunning && (
                  <div className="code-font" style={{ color: '#555', fontSize: 12 }}>
                    {'>'} Click "Run" to test with custom input or "Submit" to run against all test cases.
                  </div>
                )}

                {(submitting || isRunning) && (
                  <div className="code-font" style={{ color: 'var(--lc-brand)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="spinner" /> {submitting ? 'Judging your submission...' : 'Running your code...'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ide;
