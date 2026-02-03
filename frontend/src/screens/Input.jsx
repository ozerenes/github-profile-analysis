import { useState, useRef } from 'react';

const MAX_MB = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function Input({ onBack, onSubmit }) {
  const [file, setFile] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [formError, setFormError] = useState('');
  const [cvError, setCvError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setCvError('');
    if (!f) {
      setFile(null);
      return;
    }
    if (f.type !== 'application/pdf') {
      setCvError('Please use a PDF file.');
      setFile(null);
      return;
    }
    if (f.size > MAX_BYTES) {
      setCvError(`File must be under ${MAX_MB} MB.`);
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      const dt = new DataTransfer();
      dt.items.add(f);
      if (fileInputRef.current) fileInputRef.current.files = dt.files;
      handleFileChange({ target: { files: [f] } });
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!file) {
      setFormError('Please upload a PDF to continue.');
      setCvError('Please upload a PDF to continue.');
      return;
    }
    onSubmit({
      file,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    });
  };

  const removeFile = () => {
    setFile(null);
    setCvError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const inputBaseStyle = {
    display: 'block',
    width: '100%',
    minHeight: 'var(--btn-height)',
    padding: '0 14px',
    fontSize: '0.9375rem',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
  };

  return (
    <section style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 24 }}>Add your materials</h2>
        <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 'var(--space-24)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {formError && (
          <div
            role="alert"
            style={{
              marginBottom: 16,
              padding: '12px 16px',
              fontSize: '0.875rem',
              color: '#b91c1c',
              background: '#fef2f2',
              borderRadius: 4,
            }}
          >
            {formError}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label
            style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 500 }}
          >
            CV (PDF) <span style={{ color: 'var(--text-secondary)' }}>Required</span>
          </label>
          <div
            className="drop-zone"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              minHeight: 88,
              padding: 20,
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-page)',
              cursor: 'pointer',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 12,
              transition: 'border-color var(--transition), background var(--transition)',
            }}
          >
            {file ? (
              <>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  style={{
                    marginLeft: 'auto',
                    minHeight: 'var(--btn-height)',
                    padding: '0 14px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </>
            ) : (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Drop your PDF here or click to browse
              </span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' }}
            aria-label="CV file"
          />
          <p style={{ marginTop: 8, fontSize: '0.8125rem', color: '#a3a3a3' }}>
            PDF only, max 10 MB
          </p>
          {cvError && (
            <p style={{ marginTop: 4, fontSize: '0.8125rem', color: '#b91c1c' }}>{cvError}</p>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 500 }}
          >
            GitHub profile
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username"
            style={inputBaseStyle}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label
            style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 500 }}
          >
            LinkedIn profile
          </label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            style={inputBaseStyle}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label
            style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 500 }}
          >
            Portfolio or website
          </label>
          <input
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="https://…"
            style={inputBaseStyle}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 24,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
          }}
        >
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button
            type="submit"
            disabled={!file}
            className="btn-primary"
            style={
              file
                ? undefined
                : {
                    background: 'var(--text-muted)',
                    cursor: 'not-allowed',
                  }
            }
          >
            Analyze
          </button>
        </div>
      </form>
    </section>
  );
}

export default Input;
