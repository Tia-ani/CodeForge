import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Lock, Trophy, Building2, BarChart3, Puzzle, ArrowRight, Code2, Eye, Play, BookOpen, Star, Sparkles } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { title: 'Judge Engine', desc: 'Strategy + Factory patterns power automatic code evaluation across Java, Python, and C++.', Icon: Zap, color: 'var(--lc-brand)' },
    { title: 'JWT Authentication', desc: 'Secure role-based access control — users solve problems, admins manage the platform.', Icon: Lock, color: 'var(--lc-easy)' },
    { title: 'Live Leaderboard', desc: 'Observer Pattern triggers instant ranking updates. Scores scale with problem difficulty.', Icon: Trophy, color: 'var(--lc-medium)' },
    { title: 'Clean Architecture', desc: 'Controllers → Services → Models. TypeScript everywhere with proper OOP patterns.', Icon: Building2, color: 'var(--lc-hard)' },
    { title: 'Profile & Stats', desc: 'Track your progress with donut charts, submission heatmaps, and difficulty breakdowns.', Icon: BarChart3, color: '#a855f7' },
    { title: 'Design Patterns', desc: 'Strategy, Factory, Singleton, and Observer patterns implemented across the backend.', Icon: Puzzle, color: '#0a84ff' },
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="hero-section" style={{
        margin: '24px',
        padding: '60px 40px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 50 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
              A New Way to Learn <span style={{ color: 'var(--lc-brand)', textShadow: '0 0 20px rgba(255, 87, 34, 0.5)' }}>Algorithms</span>
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 17, lineHeight: 1.7, marginBottom: 28, maxWidth: 520 }}>
              CodeForge is the best platform to help you enhance your skills, expand your knowledge,
              and prepare for technical interviews with real-time execution tracing.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to={isAuthenticated ? '/problems' : '/auth'}>
                <button className="lc-btn-primary" style={{ padding: '12px 32px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isAuthenticated ? 'Start Solving' : 'Create Account'} <ArrowRight size={18} strokeWidth={2} />
                </button>
              </Link>
              <Link to="/problems">
                <button className="lc-btn" style={{ padding: '12px 32px', fontSize: 16, background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                  Explore Problems
                </button>
              </Link>
            </div>
          </div>

          {/* Stats - High Contrast White Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
            {[
              { val: '120', label: 'Coding Problems', color: 'var(--lc-brand)', Icon: Code2 },
              { val: '3', label: 'Languages', color: '#4CAF50', Icon: Zap },
              { val: '3', label: 'Difficulty Levels', color: '#F44336', Icon: BarChart3 },
            ].map((s, i) => (
              <div key={i} className="card-white" style={{
                padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 16,
                minWidth: 280,
              }}>
                <s.Icon size={28} color={s.color} strokeWidth={1.5} />
                <span style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.val}</span>
                <span style={{ color: 'var(--lc-card-text)', fontSize: 14, fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unique Features Showcase */}
      <div style={{ 
        maxWidth: 1100, 
        margin: '60px auto', 
        padding: '0 24px',
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 48,
        }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            background: 'var(--lc-brand-dim)', 
            padding: '8px 20px', 
            borderRadius: 'var(--radius-lg)',
            marginBottom: 16,
          }}>
            <Sparkles size={18} color="var(--lc-brand)" strokeWidth={2} />
            <span style={{ 
              color: 'var(--lc-brand)', 
              fontSize: 13, 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '1px' 
            }}>
              What Makes Us Different
            </span>
          </div>
          <h2 style={{ 
            fontSize: 36, 
            fontWeight: 800, 
            marginBottom: 16, 
            color: 'var(--lc-text)',
            lineHeight: 1.2,
          }}>
            Features You Won't Find Anywhere Else
          </h2>
          <p style={{ 
            color: 'var(--lc-text-secondary)', 
            fontSize: 16, 
            maxWidth: 600, 
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            We've built unique tools to help you debug, learn, and master coding challenges faster than ever before.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Forge-Sight Tracer - Featured */}
          <div className="card-white" style={{ 
            gridColumn: '1 / -1',
            padding: 32,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'var(--lc-brand)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: 'var(--radius)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              🔥 Most Popular
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 10, 
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, var(--lc-brand) 0%, #d84315 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Eye size={24} color="white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: 24, 
                      fontWeight: 700, 
                      color: 'var(--lc-card-text)',
                      marginBottom: 2,
                    }}>
                      Forge-Sight Visual Tracer
                    </h3>
                    <span style={{ 
                      color: 'var(--lc-brand)', 
                      fontSize: 13, 
                      fontWeight: 600,
                    }}>
                      Step-by-step execution debugging
                    </span>
                  </div>
                </div>
                <p style={{ 
                  color: 'var(--lc-card-text-secondary)', 
                  fontSize: 15, 
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}>
                  When your code fails, don't just see "Wrong Answer" — see <strong>exactly what happened</strong>. 
                  Step through your code line-by-line, watch variables change in real-time, and understand 
                  where your logic went wrong. It's like having a debugger built into the platform.
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      background: 'var(--lc-brand)' 
                    }} />
                    <span style={{ fontSize: 13, color: 'var(--lc-card-text-secondary)' }}>
                      Variable snapshots at each line
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      background: 'var(--lc-brand)' 
                    }} />
                    <span style={{ fontSize: 13, color: 'var(--lc-card-text-secondary)' }}>
                      Line-by-line execution flow
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      background: 'var(--lc-brand)' 
                    }} />
                    <span style={{ fontSize: 13, color: 'var(--lc-card-text-secondary)' }}>
                      Call stack depth tracking
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ 
                flex: '0 0 200px',
                background: 'var(--lc-bg-layer1)',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
                border: '1px solid var(--lc-border)',
              }}>
                <div style={{ 
                  fontSize: 11, 
                  color: 'var(--lc-text-muted)', 
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                }}>
                  How to Use
                </div>
                <ol style={{ 
                  margin: 0, 
                  paddingLeft: 20, 
                  color: 'var(--lc-text-secondary)',
                  fontSize: 13,
                  lineHeight: 1.8,
                }}>
                  <li>Submit wrong code</li>
                  <li>Click "View Trace"</li>
                  <li>Step through execution</li>
                  <li>Watch variables change</li>
                  <li>Find the bug!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Custom Test Cases */}
          <div className="card-dark" style={{ padding: 28 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(76, 175, 80, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Play size={22} color="#4CAF50" strokeWidth={2} />
            </div>
            <h3 style={{ 
              fontSize: 19, 
              fontWeight: 700, 
              marginBottom: 12, 
              color: 'var(--lc-text)',
            }}>
              Custom Test Cases
            </h3>
            <p style={{ 
              color: 'var(--lc-text-secondary)', 
              fontSize: 14, 
              lineHeight: 1.7,
              marginBottom: 16,
            }}>
              Test your code with custom inputs before submitting. No more wasting submissions on edge cases you could have caught yourself.
            </p>
            <div style={{ 
              background: 'var(--lc-bg-layer1)', 
              padding: '10px 14px', 
              borderRadius: 'var(--radius)',
              border: '1px solid var(--lc-border)',
              fontSize: 12,
              color: 'var(--lc-text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              💡 Click "Run" to test instantly
            </div>
          </div>

          {/* Study Plans */}
          <div className="card-dark" style={{ padding: 28 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <BookOpen size={22} color="#a855f7" strokeWidth={2} />
            </div>
            <h3 style={{ 
              fontSize: 19, 
              fontWeight: 700, 
              marginBottom: 12, 
              color: 'var(--lc-text)',
            }}>
              Curated Study Plans
            </h3>
            <p style={{ 
              color: 'var(--lc-text-secondary)', 
              fontSize: 14, 
              lineHeight: 1.7,
              marginBottom: 16,
            }}>
              Follow structured learning tracks: Beginner Fundamentals, Data Structures, Algorithms, and Interview Prep. No more random problem solving.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 8, 
              flexWrap: 'wrap',
            }}>
              {['Beginner', 'DS Mastery', 'Algorithms', 'Interview'].map((track, i) => (
                <span key={i} style={{
                  background: 'var(--lc-bg-layer1)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius)',
                  fontSize: 11,
                  color: 'var(--lc-text-secondary)',
                  border: '1px solid var(--lc-border)',
                }}>
                  {track}
                </span>
              ))}
            </div>
          </div>

          {/* Favorites System */}
          <div className="card-dark" style={{ padding: 28 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 193, 7, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Star size={22} color="#FFC107" strokeWidth={2} />
            </div>
            <h3 style={{ 
              fontSize: 19, 
              fontWeight: 700, 
              marginBottom: 12, 
              color: 'var(--lc-text)',
            }}>
              Smart Favorites
            </h3>
            <p style={{ 
              color: 'var(--lc-text-secondary)', 
              fontSize: 14, 
              lineHeight: 1.7,
              marginBottom: 16,
            }}>
              Organize problems into folders: "To Review", "Interview Prep", "Tricky Ones". Keep track of what matters to you.
            </p>
            <div style={{ 
              background: 'var(--lc-bg-layer1)', 
              padding: '10px 14px', 
              borderRadius: 'var(--radius)',
              border: '1px solid var(--lc-border)',
              fontSize: 12,
              color: 'var(--lc-text-muted)',
            }}>
              📁 Access from Problems sidebar
            </div>
          </div>

          {/* High Contrast Theme */}
          <div className="card-dark" style={{ padding: 28 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 87, 34, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Sparkles size={22} color="var(--lc-brand)" strokeWidth={2} />
            </div>
            <h3 style={{ 
              fontSize: 19, 
              fontWeight: 700, 
              marginBottom: 12, 
              color: 'var(--lc-text)',
            }}>
              Mocha & Clay Theme
            </h3>
            <p style={{ 
              color: 'var(--lc-text-secondary)', 
              fontSize: 14, 
              lineHeight: 1.7,
              marginBottom: 16,
            }}>
              Beautiful high-contrast design with 7:1 contrast ratio (WCAG AAA). Easy on the eyes, accessible for everyone.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 6,
              alignItems: 'center',
            }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#0D0D0D', border: '1px solid var(--lc-border)' }} />
              <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--lc-brand)' }} />
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#3D1F16' }} />
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#FFFFFF' }} />
              <span style={{ fontSize: 11, color: 'var(--lc-text-muted)', marginLeft: 6 }}>
                Custom palette
              </span>
            </div>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: 40,
        }}>
          <Link to="/problems">
            <button className="lc-btn-primary" style={{ 
              padding: '14px 36px', 
              fontSize: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}>
              Try These Features Now <ArrowRight size={18} strokeWidth={2} />
            </button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 28, color: 'var(--lc-text)' }}>Platform Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card-dark">
              <f.Icon size={32} color={f.color} strokeWidth={1.5} style={{ marginBottom: 14 }} />
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10, color: f.color }}>{f.title}</div>
              <div style={{ color: 'var(--lc-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
