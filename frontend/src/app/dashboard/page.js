'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Calendar, ChevronRight } from 'lucide-react';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/documents', {
      method: 'GET',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized');
          throw new Error('Failed to fetch documents');
        }
        return res.json();
      })
      .then((data) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Documents</h1>
          <p className={styles.subtitle}>Manage your securely saved legal agreements.</p>
        </div>
        <Link href="/mnda" className={styles.newBtn}>
          + New MNDA
        </Link>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.emptyState}>Loading documents...</div>
        ) : error ? (
          <div className={styles.emptyState} style={{ color: '#ef4444' }}>
            {error}
          </div>
        ) : documents.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <p>You haven't saved any documents yet.</p>
            <Link href="/mnda" className={styles.newBtn} style={{ marginTop: '1rem', display: 'inline-block' }}>
              Create your first MNDA
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {documents.map((doc) => (
              <div key={doc.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <FileText size={20} color="#3b82f6" />
                  </div>
                  <h3 className={styles.cardTitle}>{doc.title}</h3>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardDate}>
                    <Calendar size={14} style={{ marginRight: '6px' }} />
                    Created: {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                  <p className={styles.cardPreview}>
                    {(doc.content || 'No preview available').substring(0, 100)}...
                  </p>
                </div>
                <div className={styles.cardFooter}>
                  <button className={styles.viewBtn} onClick={() => setSelectedDoc(doc)}>
                    View Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: '#1e293b', borderRadius: '12px', width: '100%', maxWidth: '800px',
            maxHeight: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid #334155'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem' }}>{selectedDoc.title}</h2>
              <button 
                onClick={() => setSelectedDoc(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
              >×</button>
            </div>
            <div style={{ padding: '2rem', overflowY: 'auto', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {selectedDoc.content || 'Document content could not be found.'}
            </div>
            <div style={{ padding: '1rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedDoc(null)}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', cursor: 'pointer' }}
              >Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
