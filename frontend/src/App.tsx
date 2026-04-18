import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProblemList from './pages/ProblemList';
import Ide from './pages/Ide';
import LeaderboardPage from './pages/LeaderboardPage';
import AuthPage from './pages/AuthPage';
import SubmissionHistory from './pages/SubmissionHistory';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/problems" element={<ProblemList />} />
              <Route path="/problem/:id" element={<Ide />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/submissions" element={<SubmissionHistory />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
