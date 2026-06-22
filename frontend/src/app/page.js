'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/me', { credentials: 'include', cache: 'no-store' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="hero">
      <div className="hero-content">
        <h1 className="title">
          Legal Rental Agreements <br />
          <span className="highlight">in Minutes.</span>
        </h1>
        <p className="subtitle">
          Leaseefy helps landlords generate legally compliant rental and lease agreements quickly, no matter which state or country your property is in.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', width: '100%' }}>
          <Link href="/create-document" className="cta-button">
            Create Document
          </Link>
          
          {!loading && !user && (
            <>
              <Link href="/signup" className="cta-button" style={{ background: '#3b82f6' }}>
                Sign Up
              </Link>
              <Link href="/signin" className="cta-button" style={{ background: 'transparent', border: '1px solid #e2e8f0', color: '#f8fafc' }}>
                Sign In
              </Link>
            </>
          )}
        </div>

        <div className="glass-card">
          <div className="feature">
            <h3>Compliance Guaranteed</h3>
            <p>Always up to date with local state and national laws.</p>
          </div>
          <div className="feature">
            <h3>Global Coverage</h3>
            <p>From California to London, our templates adapt to you.</p>
          </div>
          <div className="feature">
            <h3>Fast &amp; Easy</h3>
            <p>Answer a few questions, and your agreement is ready to sign.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
