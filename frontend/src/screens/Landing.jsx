function Landing({ onStart }) {
  return (
    <section style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 8 }}>
        Professional Presence Analyzer
      </h1>
      <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
        Understand your job-finding potential and get a clear path forward.
      </p>
      <p style={{ fontSize: '0.9375rem', textAlign: 'left', marginBottom: 16 }}>
        Upload your CV and, if you like, add your GitHub, LinkedIn, or portfolio. We analyze your
        materials and return a job potential score, best-fit roles, skill gaps, and a personalized
        learning roadmap. All based only on what you provide.
      </p>
      <p style={{ fontSize: '0.875rem', color: '#a3a3a3', marginBottom: 32 }}>
        Analysis is based only on the documents and links you provide.
      </p>
      <button
        type="button"
        onClick={onStart}
        style={{
          minHeight: 'var(--btn-height)',
          padding: '0 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#fff',
          background: '#171717',
          border: 'none',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
        }}
      >
        Start analysis
      </button>
      <p style={{ marginTop: 32, fontSize: '0.8125rem', color: '#a3a3a3' }}>PDF only, max 10 MB</p>
    </section>
  );
}

export default Landing;
