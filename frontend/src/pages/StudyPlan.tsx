import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, TrendingUp, Calendar, CheckCircle2, Clock, Award } from 'lucide-react';

interface StudyPlan {
  id: number;
  title: string;
  description: string;
  duration: string;
  problems: number;
  difficulty: string;
  progress: number;
  icon: any;
  color: string;
}

const StudyPlan = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const studyPlans: StudyPlan[] = [
    {
      id: 1,
      title: 'Beginner Friendly',
      description: 'Perfect for those starting their coding journey. Master the fundamentals with easy problems.',
      duration: '2 weeks',
      problems: 30,
      difficulty: 'Easy',
      progress: 45,
      icon: BookOpen,
      color: 'var(--success)',
    },
    {
      id: 2,
      title: 'Data Structures',
      description: 'Deep dive into arrays, linked lists, trees, graphs, and more essential data structures.',
      duration: '4 weeks',
      problems: 50,
      difficulty: 'Medium',
      progress: 20,
      icon: Target,
      color: 'var(--brand-primary)',
    },
    {
      id: 3,
      title: 'Algorithms Mastery',
      description: 'Master sorting, searching, dynamic programming, and advanced algorithmic techniques.',
      duration: '6 weeks',
      problems: 75,
      difficulty: 'Hard',
      progress: 10,
      icon: TrendingUp,
      color: 'var(--error)',
    },
    {
      id: 4,
      title: 'Interview Prep',
      description: 'Top 100 interview questions from FAANG companies. Get interview-ready in 30 days.',
      duration: '4 weeks',
      problems: 100,
      difficulty: 'Mixed',
      progress: 0,
      icon: Award,
      color: 'var(--warning)',
    },
  ];

  const recentActivity = [
    { problem: 'Two Sum', date: '2 hours ago', status: 'completed' },
    { problem: 'Valid Parentheses', date: '1 day ago', status: 'completed' },
    { problem: 'Merge Intervals', date: '2 days ago', status: 'attempted' },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: 'var(--lc-text)' }}>
          Study Plans
        </h1>
        <p style={{ color: 'var(--lc-text-secondary)', fontSize: 16 }}>
          Structured learning paths to master coding interviews
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Active Plans', value: '2', icon: BookOpen, color: 'var(--lc-brand)' },
          { label: 'Problems Solved', value: '45', icon: CheckCircle2, color: 'var(--lc-easy)' },
          { label: 'Current Streak', value: '7 days', icon: Calendar, color: 'var(--lc-medium)' },
          { label: 'Study Time', value: '12h', icon: Clock, color: 'var(--lc-purple)' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'var(--lc-bg-layer1)',
            padding: 20,
            borderRadius: 'var(--radius)',
            border: '1px solid var(--lc-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius)',
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--lc-text)' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'var(--lc-text-muted)' }}>{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Study Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>
        {studyPlans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            style={{
              background: 'var(--lc-bg-layer1)',
              borderRadius: 'var(--radius)',
              border: selectedPlan === plan.id ? `2px solid ${plan.color}` : '1px solid var(--lc-border)',
              padding: 24,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Icon */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius)',
              background: `${plan.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <plan.icon size={28} color={plan.color} />
            </div>

            {/* Title & Description */}
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--lc-text)' }}>
              {plan.title}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--lc-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
              {plan.description}
            </p>

            {/* Meta Info */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: 11,
                fontWeight: 600,
                background: 'var(--lc-bg-layer2)',
                color: 'var(--lc-text-secondary)',
              }}>
                {plan.duration}
              </span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: 11,
                fontWeight: 600,
                background: 'var(--lc-bg-layer2)',
                color: 'var(--lc-text-secondary)',
              }}>
                {plan.problems} problems
              </span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: 11,
                fontWeight: 600,
                background: plan.difficulty === 'Easy' ? 'var(--lc-easy-bg)' : plan.difficulty === 'Hard' ? 'var(--lc-hard-bg)' : 'var(--lc-medium-bg)',
                color: plan.difficulty === 'Easy' ? 'var(--lc-easy)' : plan.difficulty === 'Hard' ? 'var(--lc-hard)' : 'var(--lc-medium)',
              }}>
                {plan.difficulty}
              </span>
            </div>

            {/* Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--lc-text-muted)' }}>Progress</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: plan.color }}>{plan.progress}%</span>
              </div>
              <div style={{
                height: 6,
                background: 'var(--lc-bg-layer2)',
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${plan.progress}%`,
                  background: plan.color,
                  transition: 'width 0.3s',
                }} />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/problems');
              }}
              style={{
                marginTop: 16,
                width: '100%',
                padding: '10px',
                background: plan.color,
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {plan.progress > 0 ? 'Continue' : 'Start Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'var(--lc-bg-layer1)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--lc-border)',
        padding: 24,
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--lc-text)' }}>
          Recent Activity
        </h3>
        {recentActivity.map((activity, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: i < recentActivity.length - 1 ? '1px solid var(--lc-border)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircle2
                size={20}
                color={activity.status === 'completed' ? 'var(--lc-easy)' : 'var(--lc-text-muted)'}
              />
              <div>
                <div style={{ fontWeight: 500, color: 'var(--lc-text)' }}>{activity.problem}</div>
                <div style={{ fontSize: 12, color: 'var(--lc-text-muted)' }}>{activity.date}</div>
              </div>
            </div>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: 11,
              fontWeight: 600,
              background: activity.status === 'completed' ? 'var(--lc-easy-bg)' : 'var(--lc-bg-layer2)',
              color: activity.status === 'completed' ? 'var(--lc-easy)' : 'var(--lc-text-muted)',
            }}>
              {activity.status === 'completed' ? 'Completed' : 'Attempted'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlan;
