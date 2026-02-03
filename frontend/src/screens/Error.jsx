function Error({ message, onDismiss }) {
  return (
    <section
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 560,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          padding: 'var(--space-24)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 8 }}>
          Something went wrong
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
          {message}
        </p>
        <button type="button" onClick={onDismiss} className="btn-primary">
          Try again
        </button>
      </div>
    </section>
  );
}

export default Error;
