import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2, FolderOpen, Plus } from 'lucide-react';

interface FavoriteProblem {
  problemId: number;
  title: string;
  difficulty: string;
  tag: string;
  folder: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProblem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [folders] = useState<string[]>(['All', 'Arrays', 'Dynamic Programming', 'Trees', 'Interview Prep']);

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    } else {
      // Demo data
      setFavorites([
        { problemId: 1, title: 'Two Sum', difficulty: 'EASY', tag: 'Array', folder: 'Arrays' },
        { problemId: 3, title: 'Climbing Stairs', difficulty: 'EASY', tag: 'Dynamic Programming', folder: 'Dynamic Programming' },
        { problemId: 5, title: 'Reverse Linked List', difficulty: 'EASY', tag: 'Linked List', folder: 'Interview Prep' },
        { problemId: 41, title: 'Add Two Numbers', difficulty: 'MEDIUM', tag: 'Linked List', folder: 'Interview Prep' },
        { problemId: 43, title: 'Merge Intervals', difficulty: 'MEDIUM', tag: 'Sorting', folder: 'Interview Prep' },
      ]);
    }
  }, []);

  const removeFavorite = (problemId: number) => {
    const updated = favorites.filter(f => f.problemId !== problemId);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const filteredFavorites = selectedFolder === 'All' 
    ? favorites 
    : favorites.filter(f => f.folder === selectedFolder);

  const getDiffClass = (d: string) => d === 'EASY' ? 'diff-easy' : d === 'MEDIUM' ? 'diff-medium' : 'diff-hard';
  const getDiffLabel = (d: string) => d === 'EASY' ? 'Easy' : d === 'MEDIUM' ? 'Medium' : 'Hard';

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Star size={32} color="var(--lc-brand)" fill="var(--lc-brand)" />
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--lc-text)' }}>
            Favorite Problems
          </h1>
        </div>
        <p style={{ color: 'var(--lc-text-secondary)', fontSize: 16 }}>
          Your saved problems organized by folders
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{
          background: 'var(--lc-bg-layer1)',
          padding: 20,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--lc-border)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--lc-brand)', marginBottom: 4 }}>
            {favorites.length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--lc-text-muted)' }}>Total Favorites</div>
        </div>
        <div style={{
          background: 'var(--lc-bg-layer1)',
          padding: 20,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--lc-border)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--lc-easy)', marginBottom: 4 }}>
            {favorites.filter(f => f.difficulty === 'EASY').length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--lc-text-muted)' }}>Easy</div>
        </div>
        <div style={{
          background: 'var(--lc-bg-layer1)',
          padding: 20,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--lc-border)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--lc-medium)', marginBottom: 4 }}>
            {favorites.filter(f => f.difficulty === 'MEDIUM').length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--lc-text-muted)' }}>Medium</div>
        </div>
        <div style={{
          background: 'var(--lc-bg-layer1)',
          padding: 20,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--lc-border)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--lc-hard)', marginBottom: 4 }}>
            {favorites.filter(f => f.difficulty === 'HARD').length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--lc-text-muted)' }}>Hard</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Folders Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{
            background: 'var(--lc-bg-layer1)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--lc-border)',
            padding: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--lc-text)' }}>Folders</h3>
              <Plus size={16} color="var(--lc-brand)" style={{ cursor: 'pointer' }} />
            </div>
            {folders.map((folder) => (
              <div
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius)',
                  background: selectedFolder === folder ? 'var(--lc-brand-dim)' : 'transparent',
                  color: selectedFolder === folder ? 'var(--lc-brand)' : 'var(--lc-text-secondary)',
                  cursor: 'pointer',
                  marginBottom: 4,
                  fontWeight: selectedFolder === folder ? 600 : 400,
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedFolder !== folder) {
                    e.currentTarget.style.background = 'var(--lc-bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFolder !== folder) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <FolderOpen size={16} />
                <span>{folder}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--lc-text-muted)' }}>
                  {folder === 'All' ? favorites.length : favorites.filter(f => f.folder === folder).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Problems List */}
        <div style={{ flex: 1 }}>
          {filteredFavorites.length === 0 ? (
            <div style={{
              background: 'var(--lc-bg-layer1)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--lc-border)',
              padding: 60,
              textAlign: 'center',
            }}>
              <Star size={48} color="var(--lc-text-muted)" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--lc-text)' }}>
                No favorites yet
              </h3>
              <p style={{ color: 'var(--lc-text-muted)', marginBottom: 20 }}>
                Start adding problems to your favorites to see them here
              </p>
              <Link to="/problems">
                <button className="lc-btn-primary">
                  Browse Problems
                </button>
              </Link>
            </div>
          ) : (
            <div style={{
              background: 'var(--lc-bg-layer1)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--lc-border)',
              overflow: 'hidden',
            }}>
              {filteredFavorites.map((problem, idx) => (
                <div
                  key={problem.problemId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 20px',
                    background: idx % 2 === 0 ? 'var(--lc-bg-layer1)' : 'var(--lc-bg)',
                    borderBottom: idx < filteredFavorites.length - 1 ? '1px solid var(--lc-border)' : 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--lc-bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'var(--lc-bg-layer1)' : 'var(--lc-bg)'}
                >
                  <Star size={18} color="var(--lc-brand)" fill="var(--lc-brand)" style={{ marginRight: 16 }} />
                  
                  <Link to={`/problem/${problem.problemId}`} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--lc-text)' }}>
                      {problem.problemId}. {problem.title}
                    </div>
                  </Link>

                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: 11,
                    fontWeight: 600,
                    background: 'var(--lc-bg-layer2)',
                    color: 'var(--lc-text-secondary)',
                    marginRight: 12,
                  }}>
                    {problem.tag}
                  </span>

                  <span className={getDiffClass(problem.difficulty)} style={{ fontSize: 13, fontWeight: 600, width: 70, textAlign: 'right', marginRight: 12 }}>
                    {getDiffLabel(problem.difficulty)}
                  </span>

                  <button
                    onClick={() => removeFavorite(problem.problemId)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 8,
                      borderRadius: 'var(--radius)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--lc-hard-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Trash2 size={16} color="var(--lc-hard)" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
