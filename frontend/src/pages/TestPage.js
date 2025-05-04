import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function TestPage() {
  const { topicId } = useParams();
  const [tests, setTests] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get(`/learning/topics/${topicId}/tests`);
        if (res.data && (res.data.code === 401 || res.data.code === 403)) {
          navigate('/login');
          return;
        }
        setTests(res.data);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
          return;
        }
        setError('Đã xảy ra lỗi khi lấy bài kiểm tra.');
      }
    };
    fetchTests();
  }, [topicId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/learning/topics/${topicId}/tests`, {
        answers,
        completion_time: 120
      });
      if (res.data && (res.data.code === 401 || res.data.code === 403)) {
        navigate('/login');
        return;
      }
      navigate(`/topics/${topicId}/result`);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
        return;
      }
      setError('Đã xảy ra lỗi khi nộp bài kiểm tra.');
    }
  };

  if (error) {
    return <div><h2>Test</h2><p>{error}</p></div>;
  }

  return (
    <div>
      <h2>Test</h2>
      <form onSubmit={handleSubmit}>
        {tests.map(test => (
          <div key={test.id}>
            <p>{test.question}</p>
            {test.options.map(opt => (
              <label key={opt}>
                <input
                  type="radio"
                  name={`q${test.id}`}
                  value={opt}
                  checked={answers[test.id] === opt}
                  onChange={() => setAnswers({ ...answers, [test.id]: opt })}
                  required
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        <button type="submit">Submit Test</button>
      </form>
    </div>
  );
} 