function Landing({ onStart }) {
  return (
    <section style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
      <h1
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: 12,
          lineHeight: 1.3,
        }}
      >
        Professional Presence Analyzer
      </h1>
      <p
        style={{
          fontSize: '1.0625rem',
          color: 'var(--text-secondary)',
          marginBottom: 28,
          lineHeight: 1.5,
        }}
      >
        Understand your job-finding potential and get a clear path forward.
      </p>
      <p
        style={{
          fontSize: '0.9375rem',
          textAlign: 'left',
          marginBottom: 20,
          color: 'var(--text-primary)',
        }}
      >
        Upload your CV and, if you like, add your GitHub, LinkedIn, or portfolio. We analyze your
        materials and return a job potential score, best-fit roles, skill gaps, and a personalized
        learning roadmap. All based only on what you provide.
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 32 }}>
        Analysis is based only on the documents and links you provide.
      </p>
      <button type="button" onClick={onStart} className="btn-primary">
        Start analysis
      </button>
      <p style={{ marginTop: 28, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        PDF only, max 10 MB
      </p>
    </section>
  );
}

export default Landing;
