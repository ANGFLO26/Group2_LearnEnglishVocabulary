import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResultPage() {
  const { topicId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/learning/user/topics/${topicId}/results`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setResult(res.data[0]);
        } else {
          setError('Không tìm thấy kết quả hoặc bạn chưa làm bài.');
        }
      })
      .catch(err => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
        } else {
          setError('Đã xảy ra lỗi khi lấy kết quả.');
        }
      });
  }, [topicId, navigate]);

  if (error) {
    return <div><h2>Test Result</h2><p>{error}</p></div>;
  }

  if (!result) {
    return <div><h2>Test Result</h2><p>Đang tải kết quả...</p></div>;
  }

  return (
    <div>
      <h2>Test Result</h2>
      <p><b>Score:</b> {result.score}</p>
      <p><b>Correct Answers:</b> {result.score} / {result.total_questions}</p>
      <p><b>Completion Time:</b> {result.completion_time} seconds</p>
      <p><b>Date:</b> {result.created_at}</p>
    </div>
  );
} 