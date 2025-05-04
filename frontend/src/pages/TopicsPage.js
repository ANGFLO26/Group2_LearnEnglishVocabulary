import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/learning/topics');
        if (res.data && (res.data.code === 401 || res.data.code === 403)) {
          navigate('/login');
          return;
        }
        setTopics(res.data);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
          return;
        }
        setError('Đã xảy ra lỗi khi lấy danh sách chủ đề.');
      }
    };
    fetchTopics();
  }, [navigate]);

  if (error) {
    return <div><h2>Vocabulary Topics</h2><p>{error}</p></div>;
  }

  return (
    <div>
      <h2>Vocabulary Topics</h2>
      <ul>
        {topics.map(topic => (
          <li key={topic.id}>
            <b>{topic.name}</b> - {topic.description}
            <button onClick={() => navigate(`/topics/${topic.id}/vocabularies`)}>View Vocabulary</button>
            <button onClick={() => navigate(`/topics/${topic.id}/test`)}>Take Test</button>
            <button onClick={() => navigate(`/topics/${topic.id}/leaderboard`)}>Leaderboard</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 