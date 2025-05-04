import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function LeaderboardPage() {
  const { topicId } = useParams();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get(`/learning/topics/${topicId}/leaderboard`);
        if (res.data && (res.data.code === 401 || res.data.code === 403)) {
          navigate('/login');
          return;
        }
        setUsers(res.data);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
          return;
        }
        setError('Đã xảy ra lỗi khi lấy bảng xếp hạng.');
      }
    };
    fetchLeaderboard();
  }, [topicId, navigate]);

  if (error) {
    return <div><h2>Leaderboard</h2><p>{error}</p></div>;
  }

  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {users.map(u => (
          <li key={u.user_id}>
            User: {u.user_id} | Score: {u.total_score} | Avg: {u.average_score}
          </li>
        ))}
      </ol>
    </div>
  );
} 