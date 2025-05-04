import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function VocabularyPage() {
  const { topicId } = useParams();
  const [vocabularies, setVocabularies] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVocabularies = async () => {
      try {
        const res = await api.get(`/learning/topics/${topicId}/vocabularies`);
        if (res.data && (res.data.code === 401 || res.data.code === 403)) {
          navigate('/login');
          return;
        }
        setVocabularies(res.data);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
          return;
        }
        setError('Đã xảy ra lỗi khi lấy danh sách từ vựng.');
      }
    };
    fetchVocabularies();
  }, [topicId, navigate]);

  if (error) {
    return <div><h2>Vocabulary List</h2><p>{error}</p></div>;
  }

  return (
    <div>
      <h2>Vocabulary List</h2>
      <ul>
        {vocabularies.map(v => (
          <li key={v.id}>
            <b>{v.word}</b> - {v.meaning} <i>{v.phonetic}</i>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/topics/${topicId}/test`)}>Take Test</button>
    </div>
  );
} 