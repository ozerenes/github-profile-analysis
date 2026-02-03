const SECTION_IDS = {
  profile: 'section-profile',
  potential: 'section-potential',
  roles: 'section-roles',
  gaps: 'section-gaps',
  roadmap: 'section-roadmap',
  recommendations: 'section-recommendations',
};

const BREAKDOWN_LABELS = {
  market_readiness: 'Market readiness',
  profile_clarity: 'Profile clarity',
  skill_depth: 'Skill depth',
  positioning_strength: 'Positioning strength',
};

function Results({ report, onNewAnalysis }) {
  const j = report.job_potential_analysis;
  const roles = report.best_roles_to_target || [];
  const gaps = report.key_gaps || [];
  const r = report.learning_roadmap;
  const shortTerm = (r?.short_term?.length && r.short_term) || [];
  const midTerm = (r?.mid_term?.length && r.mid_term) || [];
  const longTerm = (r?.long_term?.length && r.long_term) || [];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const cardStyle = {
    padding: 20,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-sm)',
  };

  return (
    <section>
      <header style={{ marginBottom: 24 }}>
        <button type="button" onClick={onNewAnalysis} className="btn-secondary">
          New analysis
        </button>
      </header>

      <div
        style={{
          display: 'grid',
          gap: 16,
          marginBottom: 32,
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        }}
      >
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Job potential score
          </span>
          <p style={{ fontSize: '2rem', fontWeight: 600, margin: '4px 0 0' }}>
            {j?.overall_job_potential_score ?? '—'} <span style={{ color: '#a3a3a3' }}>/ 100</span>
          </p>
          {j?.explanation && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 8 }}>
              {j.explanation}
            </p>
          )}
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Best-fit roles
          </span>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {roles.slice(0, 5).map((item, i) => (
              <li key={i} style={{ padding: '4px 0', fontSize: '0.875rem' }}>
                <strong>{item.role}</strong> {item.reason}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => scrollTo(SECTION_IDS.roles)}
            style={{
              marginTop: 8,
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            View all
          </button>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Key gaps
          </span>
          <p style={{ fontSize: '2rem', fontWeight: 600, margin: '4px 0 0' }}>
            {gaps.length} <span style={{ color: '#a3a3a3' }}>to address</span>
          </p>
          <button
            type="button"
            onClick={() => scrollTo(SECTION_IDS.gaps)}
            style={{
              marginTop: 8,
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            View all
          </button>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Learning roadmap
          </span>
          <p style={{ fontSize: '1rem', fontWeight: 600, margin: '4px 0 0' }}>
            {shortTerm[0]?.outcome ? 'Ready' : '—'}
          </p>
          {shortTerm[0]?.outcome && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 8 }}>
              {shortTerm[0].outcome}
            </p>
          )}
          <button
            type="button"
            onClick={() => scrollTo(SECTION_IDS.roadmap)}
            style={{
              marginTop: 8,
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            View roadmap
          </button>
        </div>
      </div>

      <nav
        style={{
          marginBottom: 24,
          paddingBottom: 12,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          fontSize: '0.8125rem',
        }}
      >
        {[
          { id: SECTION_IDS.profile, label: 'Professional profile' },
          { id: SECTION_IDS.potential, label: 'Job potential' },
          { id: SECTION_IDS.roles, label: 'Role recommendations' },
          { id: SECTION_IDS.gaps, label: 'Key gaps' },
          { id: SECTION_IDS.roadmap, label: 'Learning roadmap' },
          { id: SECTION_IDS.recommendations, label: 'Final recommendations' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className="nav-link"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <article style={{ fontSize: '0.9375rem' }}>
        <section
          id={SECTION_IDS.profile}
          style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>
            Professional profile
          </h2>
          <p>{report.professional_summary || 'No summary available.'}</p>
        </section>

        <section
          id={SECTION_IDS.potential}
          style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>Job potential</h2>
          {j?.overall_job_potential_score != null ? (
            <>
              <p className="score-display" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {j.overall_job_potential_score} <span style={{ color: '#a3a3a3' }}>/ 100</span>
              </p>
              {j.explanation && <p>{j.explanation}</p>}
              {j.breakdown && typeof j.breakdown === 'object' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {Object.entries(j.breakdown).map(([key, value]) => (
                    <span
                      key={key}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        background: '#fafafa',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                      }}
                    >
                      {BREAKDOWN_LABELS[key] || key.replace(/_/g, ' ')}: {value}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p style={{ color: '#a3a3a3' }}>Score not available.</p>
          )}
        </section>

        <section
          id={SECTION_IDS.roles}
          style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>
            Best roles to target
          </h2>
          {roles.length ? (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {roles.map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: 16,
                    marginBottom: 8,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.role}</div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {item.reason}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#a3a3a3' }}>No roles identified.</p>
          )}
        </section>

        <section
          id={SECTION_IDS.gaps}
          style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>Key gaps</h2>
          {gaps.length ? (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {gaps.map((gap, i) => (
                <li
                  key={i}
                  style={{
                    padding: 16,
                    marginBottom: 8,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#a3a3a3',
                      textTransform: 'uppercase',
                    }}
                  >
                    {gap.title}
                  </span>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {gap.detail}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#a3a3a3' }}>No major gaps identified.</p>
          )}
        </section>

        <section
          id={SECTION_IDS.roadmap}
          style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>
            Learning roadmap
          </h2>
          {shortTerm.length || midTerm.length || longTerm.length ? (
            <>
              {shortTerm.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '16px 0 8px' }}>
                    Short-term (0–3 months)
                  </h3>
                  {shortTerm.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: 16,
                        paddingLeft: 16,
                        borderLeft: '3px solid var(--border)',
                      }}
                    >
                      <div style={{ fontWeight: 500, marginBottom: 8 }}>{item.outcome}</div>
                      {item.actions?.length > 0 && (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: 20,
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {item.actions.map((a, j) => (
                            <li key={j}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {midTerm.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '16px 0 8px' }}>
                    Mid-term (3–6 months)
                  </h3>
                  {midTerm.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: 16,
                        paddingLeft: 16,
                        borderLeft: '3px solid var(--border)',
                      }}
                    >
                      <div style={{ fontWeight: 500, marginBottom: 8 }}>{item.outcome}</div>
                      {item.actions?.length > 0 && (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: 20,
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {item.actions.map((a, j) => (
                            <li key={j}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {longTerm.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '16px 0 8px' }}>
                    Long-term (6–12 months)
                  </h3>
                  {longTerm.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: 16,
                        paddingLeft: 16,
                        borderLeft: '3px solid var(--border)',
                      }}
                    >
                      <div style={{ fontWeight: 500, marginBottom: 8 }}>{item.outcome}</div>
                      {item.actions?.length > 0 && (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: 20,
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {item.actions.map((a, j) => (
                            <li key={j}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p style={{ color: '#a3a3a3' }}>Roadmap not generated.</p>
          )}
        </section>

        <section id={SECTION_IDS.recommendations}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>
            Final recommendations
          </h2>
          <p>{report.final_recommendations || 'No recommendations.'}</p>
        </section>
      </article>
    </section>
  );
}

export default Results;
