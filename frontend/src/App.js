import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TopicsPage from './pages/TopicsPage';
import VocabularyPage from './pages/VocabularyPage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/topics/:topicId/vocabularies" element={<VocabularyPage />} />
        <Route path="/topics/:topicId/test" element={<TestPage />} />
        <Route path="/topics/:topicId/result" element={<ResultPage />} />
        <Route path="/topics/:topicId/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
