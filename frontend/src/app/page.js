import Link from 'next/link';

export default function Home() {
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
        <Link href="/mnda" className="cta-button">
          Generate Mutual NDA
        </Link>

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
