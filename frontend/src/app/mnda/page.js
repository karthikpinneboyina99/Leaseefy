'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import generatePDF from 'react-to-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { Download, FileText } from 'lucide-react';
import { mergeMNDA } from '../../utils/mndaMerger';
import styles from './mnda.module.css';

export default function MNDAGenerator() {
  const [templates, setTemplates] = useState({ coverPage: '', terms: '' });
  const [mergedDoc, setMergedDoc] = useState('');
  
  const [formData, setFormData] = useState({
    purpose: '',
    effectiveDate: '',
    mndaTerm: '1 year',
    termOfConfidentiality: '1 year',
    governingLaw: '',
    jurisdiction: '',
    party1: { name: '', title: '', company: '', address: '', date: '', signature: null },
    party2: { name: '', title: '', company: '', address: '', date: '', signature: null }
  });

  const targetRef = useRef();
  const sigPad1 = useRef({});
  const sigPad2 = useRef({});

  useEffect(() => {
    fetch('/api/templates/mnda')
      .then(res => res.json())
      .then(data => {
        if (data.coverPage && data.terms) {
          setTemplates(data);
          setMergedDoc(mergeMNDA(data.coverPage, data.terms, formData));
        }
      })
      .catch(err => console.error("Failed to load templates:", err));
  }, []);

  useEffect(() => {
    if (templates.coverPage && templates.terms) {
      setMergedDoc(mergeMNDA(templates.coverPage, templates.terms, formData));
    }
  }, [formData, templates]);

  const updateParty = (partyNum, field, value) => {
    setFormData(prev => ({
      ...prev,
      [`party${partyNum}`]: { ...prev[`party${partyNum}`], [field]: value }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearSig = (partyNum) => {
    if (partyNum === 1 && sigPad1.current) sigPad1.current.clear();
    if (partyNum === 2 && sigPad2.current) sigPad2.current.clear();
    updateParty(partyNum, 'signature', null);
  };

  const saveSig = (partyNum) => {
    const pad = partyNum === 1 ? sigPad1.current : sigPad2.current;
    if (pad && !pad.isEmpty()) {
      updateParty(partyNum, 'signature', pad.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  const handleFileUpload = (partyNum, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateParty(partyNum, 'signature', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const isFormValid = formData.party1.name && formData.party2.name && formData.effectiveDate && formData.governingLaw && formData.jurisdiction && formData.purpose;

  const renderSignatureSection = (partyNum) => {
    const party = formData[`party${partyNum}`];
    
    if (party.signature) {
      return (
        <div className={styles.savedSig}>
          <img src={party.signature} alt={`Party ${partyNum} Signature`} />
          <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '1rem'}}>Signature Saved!</p>
          <button className={styles.sigButton} style={{color: 'black', border: '1px solid black', background: '#e2e8f0'}} onClick={() => clearSig(partyNum)}>Remove Signature</button>
        </div>
      );
    }

    return (
      <>
        <div className={styles.sigCanvasWrapper}>
          <SignatureCanvas 
            penColor="black" 
            canvasProps={{className: styles.sigCanvas}} 
            ref={partyNum === 1 ? sigPad1 : sigPad2} 
          />
        </div>
        <div className={styles.sigControls}>
          <button className={styles.sigButton} onClick={() => saveSig(partyNum)}>Save Drawing</button>
          <button className={styles.sigButton} onClick={() => clearSig(partyNum)}>Clear</button>
          <span style={{margin: '0 0.5rem', color: '#888'}}>OR</span>
          <input 
            type="file" 
            accept="image/*" 
            className={styles.fileInput} 
            onChange={(e) => handleFileUpload(partyNum, e)} 
          />
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      {/* LEFT: FORM */}
      <div className={styles.formPanel}>
        <div className={styles.header}>
          <h2><FileText size={24} style={{verticalAlign: 'middle', marginRight: '8px'}} /> Mutual NDA Generator</h2>
        </div>

        <div className={styles.disclaimer}>
          <strong>Disclaimer:</strong> This tool generates a draft Mutual Non-Disclosure Agreement based on the Common Paper standard. This does not constitute legal advice. Please consult an attorney before executing any legal documents.
        </div>

        <div className={styles.partySection}>
          <h3>Disclosing / Receiving Party 1</h3>
          <div className={styles.formGroup}>
            <label>Legal Name</label>
            <input className={styles.input} type="text" value={formData.party1.name} onChange={(e) => updateParty(1, 'name', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Company</label>
            <input className={styles.input} type="text" value={formData.party1.company} onChange={(e) => updateParty(1, 'company', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Signatory Name</label>
            <input className={styles.input} type="text" value={formData.party1.title} onChange={(e) => updateParty(1, 'title', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Notice Address</label>
            <input className={styles.input} type="text" value={formData.party1.address} onChange={(e) => updateParty(1, 'address', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Signature Date</label>
            <input className={styles.input} type="date" value={formData.party1.date} onChange={(e) => updateParty(1, 'date', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Digital Signature (max 2MB upload)</label>
            {renderSignatureSection(1)}
          </div>
        </div>

        <div className={styles.partySection}>
          <h3>Disclosing / Receiving Party 2</h3>
          <div className={styles.formGroup}>
            <label>Legal Name</label>
            <input className={styles.input} type="text" value={formData.party2.name} onChange={(e) => updateParty(2, 'name', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Company</label>
            <input className={styles.input} type="text" value={formData.party2.company} onChange={(e) => updateParty(2, 'company', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Signatory Name</label>
            <input className={styles.input} type="text" value={formData.party2.title} onChange={(e) => updateParty(2, 'title', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Notice Address</label>
            <input className={styles.input} type="text" value={formData.party2.address} onChange={(e) => updateParty(2, 'address', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Signature Date</label>
            <input className={styles.input} type="date" value={formData.party2.date} onChange={(e) => updateParty(2, 'date', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Digital Signature (max 2MB upload)</label>
            {renderSignatureSection(2)}
          </div>
        </div>

        <div className={styles.partySection}>
          <h3>Agreement Terms</h3>
          <div className={styles.formGroup}>
            <label>Purpose</label>
            <textarea className={styles.input} name="purpose" rows="3" value={formData.purpose} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Effective Date</label>
            <input className={styles.input} type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>MNDA Term</label>
            <select className={styles.select} name="mndaTerm" value={formData.mndaTerm} onChange={handleChange}>
              <option value="1 year">Expires 1 year from Effective Date</option>
              <option value="2 years">Expires 2 years from Effective Date</option>
              <option value="3 years">Expires 3 years from Effective Date</option>
              <option value="Continues until terminated">Continues until terminated</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Term of Confidentiality</label>
            <select className={styles.select} name="termOfConfidentiality" value={formData.termOfConfidentiality} onChange={handleChange}>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3 years">3 years</option>
              <option value="In perpetuity">In perpetuity</option>
            </select>
          </div>
        </div>

        <div className={styles.partySection}>
          <h3>Governing Law &amp; Jurisdiction</h3>
          <div className={styles.formGroup}>
            <label>Governing Law (State)</label>
            <input className={styles.input} type="text" name="governingLaw" value={formData.governingLaw} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label>Jurisdiction</label>
            <input className={styles.input} type="text" name="jurisdiction" value={formData.jurisdiction} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* RIGHT: PREVIEW */}
      <div className={styles.previewPanelWrapper}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', color: 'black' }}>
          <span style={{ fontWeight: '600' }}>Document Preview</span>
          <button className={styles.downloadBtn} disabled={!isFormValid} onClick={() => generatePDF(targetRef, { filename: 'Mutual-NDA.pdf' })}>
            <Download size={18} /> Download PDF
          </button>
        </div>
        
        <div className={styles.previewPanel} ref={targetRef}>
          <div className={styles.markdown}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              urlTransform={(value) => value}
              components={{
                img: ({node, ...props}) => {
                  if (!props.src || props.src.trim() === '') return null;
                  return <img {...props} />;
                }
              }}
            >
              {mergedDoc}
            </ReactMarkdown>
          </div>
          <div style={{ marginTop: '40px', fontSize: '10px', color: '#666', borderTop: '1px solid #ccc', paddingTop: '10px', textAlign: 'center' }}>
            Generated by Leaseefy. Based on the Common Paper Mutual Non-Disclosure Agreement Version 1.0 (free to use under CC BY 4.0). Not legal advice.
          </div>
        </div>
      </div>
    </div>
  );
}
