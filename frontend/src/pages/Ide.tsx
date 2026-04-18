import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send } from 'lucide-react';

const Ide = () => {
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState('class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}');
  const [verdict, setVerdict] = useState<string | null>(null);

  const handleRun = () => {
    setVerdict('Running...');
    setTimeout(() => {
      setVerdict('Accepted');
    }, 1500);
  };

  const handleSubmit = () => {
    setVerdict('Evaluating...');
    setTimeout(() => {
      setVerdict('Accepted');
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 73px)' }}>
      {/* Problem Description Panel */}
      <div style={{ flex: '1', padding: '2rem', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--bg-darker)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>1. Two Sum</h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--success)', fontWeight: 500 }}>Easy</span>
        </div>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem' }}>
          <p style={{ marginBottom: '1rem' }}>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
          <p style={{ marginBottom: '1rem' }}>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
          <p>You can return the answer in any order.</p>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Example 1:</h3>
          <pre style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }} className="code-font">
            Input: nums = [2,7,11,15], target = 9<br/>
            Output: [0,1]<br/>
            Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
          </pre>
        </div>
      </div>

      {/* Editor Panel */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#252526', borderBottom: '1px solid #333' }}>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ background: '#3c3c3c', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', outline: 'none' }}
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleRun} style={{ background: '#3c3c3c', color: 'white', border: 'none', padding: '0.25rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Play size={14} /> Run
            </button>
            <button onClick={handleSubmit} style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '0.25rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Send size={14} /> Submit
            </button>
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            language={language === 'python' ? 'python' : language === 'cpp' ? 'cpp' : 'java'}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono',
              padding: { top: 16 }
            }}
          />
        </div>

        {/* Console / Output Panel */}
        <div style={{ height: '200px', background: '#1e1e1e', borderTop: '1px solid #333', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#ccc', fontWeight: 600, fontSize: '0.9rem' }}>Console</span>
            {verdict && (
              <span style={{ color: verdict === 'Accepted' ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
                {verdict}
              </span>
            )}
          </div>
          <div style={{ flex: 1, background: '#000', borderRadius: '4px', padding: '0.5rem', color: '#0f0', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', overflowY: 'auto' }}>
            {verdict ? `> Execution Output:\n\nBuild Finished.\nVerdict: ${verdict}\nRuntime: 12ms` : '> Ready.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ide;
