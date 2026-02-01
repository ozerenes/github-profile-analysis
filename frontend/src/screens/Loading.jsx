function Loading() {
  return (
    <section style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--border)',
              animation: 'loading-dot 1.2s ease-in-out infinite both',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
        Analyzing your profile. This usually takes under a minute.
      </p>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          fontSize: '0.8125rem',
          color: '#a3a3a3',
        }}
      >
        <li style={{ padding: '4px 0' }}>— Reading CV</li>
        <li style={{ padding: '4px 0' }}>— Extracting profile</li>
        <li style={{ padding: '4px 0' }}>— Scoring job potential</li>
        <li style={{ padding: '4px 0' }}>— Finding best-fit roles</li>
        <li style={{ padding: '4px 0' }}>— Building roadmap</li>
      </ul>
      <style>{`
        @keyframes loading-dot {
          0%, 80%, 100% { opacity: 0.4; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

export default Loading;
