import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: 20 }}>
      <Link to="/topics">Topics</Link> |{' '}
      <Link to="/login">Login</Link> |{' '}
      <Link to="/register">Register</Link>
    </header>
  );
} 