export defexport default function Hero() {
  return (
    <section className="hero-shell">
      <div className="hero-grid">

        <div className="hero-copy">
          <div className="hero-eyebrow">
            Dedicated to sacred study, language, beauty, and light
          </div>

          <h1 className="hero-title">
            Enter a living architecture of study.
          </h1>

          <p className="hero-text">
            LuminaNexus is a quiet digital sanctuary shaped by the Tree of
            Life — a place where Hebrew letters, contemplative learning,
            sacred art, and symbolic design gather into one luminous order.
          </p>

          <div className="hero-actions">
            <a href="#tree" className="button-primary">
              Begin the Path
            </a>

            <a href="#chavruta" className="button-secondary">
              Ask ChavrutaGPT
            </a>
          </div>
        </div>

        <div>
          {/* HeroTree loads separately */}
        </div>

      </div>
    </section>
  )
}ault function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">
            Dedicated to sacred study, language, beauty, and light
          </p>

          <h1 className="hero__title">Enter a living architecture of study.</h1>

          <p className="hero__text">
            LuminaNexus is a quiet digital sanctuary shaped by the Tree of Life —
            a place where Hebrew letters, contemplative learning, sacred art,
            and symbolic design gather into one luminous order.
          </p>

          <div className="hero__actions">
            <a href="#tree" className="button button--primary">
              Begin the Path
            </a>

            <a href="#chavruta" className="button button--secondary">
              Ask ChavrutaGPT
            </a>
          </div>
        </div>

        <div className="hero__panel" aria-label="LuminaNexus introduction panel">
          <div className="hero__panel-inner">
            <p className="hero__panel-label">LuminaNexus</p>

            <h2 className="hero__panel-title">A quiet digital sanctuary</h2>

            <p className="hero__panel-text">
              Built for sacred study, Hebrew language, contemplative art,
              symbolic architecture, and the patient return of attention.
            </p>

            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">10</span>
                <span className="hero__stat-label">Sefirot gateways</span>
              </div>

              <div className="hero__stat">
                <span className="hero__stat-number">231</span>
                <span className="hero__stat-label">Letter gates</span>
              </div>

              <div className="hero__stat">
                <span className="hero__stat-number">1</span>
                <span className="hero__stat-label">Hidden Aleph Olam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
