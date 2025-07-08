'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const getJwtFromCookie = () => {
    const cookies = document.cookie;
    return cookies
      .split('; ')
      .find((row) => row.startsWith('jwt='))
      ?.split('=')[1];
  };

  const register = async () => {
    if (!username && !email) {
      alert('Please provide either a username or an email.');
      return;
    }

    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      const tokenExists = getJwtFromCookie();
      if (tokenExists) {
        router.push('/api');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '360px',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
          }}
        >
          Register
        </h1>

        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Username
          <input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              marginTop: '6px',
              marginBottom: '1rem',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
              width: '100%',
            }}
          />
        </label>

        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Email
          <input
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              marginTop: '6px',
              marginBottom: '1rem',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
              width: '100%',
            }}
          />
        </label>

        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Password
          <input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginTop: '6px',
              marginBottom: '1.5rem',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
              width: '100%',
            }}
            required
          />
        </label>

        <button
          onClick={register}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
