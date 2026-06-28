'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/me', {
      credentials: 'include',
      cache: 'no-store'
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/logout', {
        method: 'POST',
        credentials: 'include'
      });
      // Force reload to clear client state and redirect if needed
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid #334155', display: 'flex', gap: '2rem', background: '#0f172a', alignItems: 'center' }}>
      <Link href="/" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>Leaseefy</Link>
      <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
      <Link href="/create-document" style={{ color: '#94a3b8', textDecoration: 'none' }}>Create Document</Link>
      
      {/* Spacer */}
      <div style={{ flexGrow: 1 }} />
      
      {!loading && (
        <>
          {user ? (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{user.email}</span>
              <Link href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Saved Documents</Link>
              <button 
                onClick={handleLogout}
                style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/signin" style={{ color: '#f8fafc', textDecoration: 'none' }}>Sign In</Link>
              <Link href="/signup" style={{ background: '#3b82f6', color: 'white', padding: '0.4rem 1rem', borderRadius: '4px', textDecoration: 'none' }}>Sign Up</Link>
            </div>
          )}
        </>
      )}
    </nav>
  );
}
