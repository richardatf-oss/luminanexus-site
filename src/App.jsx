import { useState } from 'react'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="site-header">
        <nav className="nav-container" aria-label="Main navigation">
          <a href="#home" className="brand" onClick={closeMenu}>
            <span className="brand-mark">א</span>
            <span className="brand-text">LuminaNexus</span>
          </a>

          <button
            className="menu-toggle"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><a href="#mission" onClick={closeMenu}>Mission</a></li>
            <li><a href="#ivrit-haor" onClick={closeMenu}>Ivrit HaOr</a></li>
            <li><a href="#tracks" onClick={closeMenu}>Tracks</a></li>
            <li><a href="#pilot" onClick={closeMenu}>Pilot</a></li>
            <li><a href="#support" onClick={closeMenu}>Support</a></li>
          </ul>
        </nav>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Hebrew for Every Grade, Every Beginning</p>

            <h1>
              No student is late to Hebrew.
              <span>Every letter is a beginning.</span>
            </h1>

            <p className="hero-text">
              LuminaNexus Foundation creates welcoming Hebrew enrichment programs
              that meet students by readiness, not shame or grade level.
            </p>

            <div className="hero-actions">
              <a href="#ivrit-haor" className="button primary">Explore the Program</a>
              <a href="#support" className="button secondary">Support the Work</a>
            </div>
          </div>

          <div className="hero-card" aria-label="Hebrew learning card">
            <div className="hebrew-large">אוֹר</div>
            <p className="translit">or</p>
            <p className="meaning">light</p>
          </div>
        </section>

        <section id="mission" className="section">
          <div className="section-heading">
            <p className="eyebrow">Our Mission</p>
            <h2>Making Hebrew accessible, meaningful, and joyful.</h2>
          </div>

          <div className="two-column">
            <p>
              LuminaNexus Foundation supports Hebrew enrichment through language,
              culture, stories, letters, sounds, names, roots, and meaning.
              Our work is designed for students from diverse backgrounds, including
              Jewish and non-Jewish learners, charter schools, homeschool groups,
              and general educational settings.
            </p>

            <p>
              We believe Hebrew learning should begin with confidence. Students
              should not feel behind because they are beginning. Beginning is the
              doorway. Every learner deserves a beautiful first step.
            </p>
          </div>
        </section>

        <section id="ivrit-haor" className="section warm">
          <div className="section-heading">
            <p className="eyebrow">Signature Curriculum</p>
            <h2>Ivrit HaOr</h2>
            <p className="section-intro">
              <strong>Ivrit HaOr</strong>, “Hebrew of Light,” is a readiness-based
              Hebrew enrichment curriculum designed for one hour per week.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <h3>Language</h3>
              <p>
                Students learn Hebrew letters, sounds, vowels, words, roots,
                and reading patterns through simple, encouraging steps.
              </p>
            </article>

            <article className="feature-card">
              <h3>Culture</h3>
              <p>
                Students encounter Hebrew through stories, music, geography,
                history, names, and cultural memory.
              </p>
            </article>

            <article className="feature-card">
              <h3>Confidence</h3>
              <p>
                Students are placed by readiness so that every learner can begin
                successfully and grow without embarrassment.
              </p>
            </article>
          </div>
        </section>

        <section id="tracks" className="section">
          <div className="section-heading">
            <p className="eyebrow">Readiness-Based Learning</p>
            <h2>The Aleph, Bet, and Gimel Tracks</h2>
          </div>

          <div className="track-grid">
            <article className="track-card">
              <div className="track-letter">א</div>
              <h3>Aleph Track</h3>
              <p className="track-subtitle">First Beginning</p>
              <p>
                For students new to Hebrew at any grade level. Students learn
                directionality, first letters, sounds, simple words, Hebrew names,
                and confidence.
              </p>
            </article>

            <article className="track-card">
              <div className="track-letter">ב</div>
              <h3>Bet Track</h3>
              <p className="track-subtitle">Building the Word</p>
              <p>
                For students who know some Hebrew letters and are ready for vowels,
                syllables, decoding, vocabulary, roots, and simple phrases.
              </p>
            </article>

            <article className="track-card">
              <div className="track-letter">ג</div>
              <h3>Gimel Track</h3>
              <p className="track-subtitle">Reading with Meaning</p>
              <p>
                For students ready to read Hebrew words, phrases, and short texts
                while exploring roots, culture, context, and meaning.
              </p>
            </article>
          </div>
        </section>

        <section id="pilot" className="section pilot">
          <div className="section-heading">
            <p className="eyebrow">Pilot Program</p>
            <h2>Honoring Our First Educational Collaborator</h2>
          </div>

          <div className="pilot-box">
            <p>
              LuminaNexus Foundation is honored to launch the pilot phase of{' '}
              <strong>Ivrit HaOr: Hebrew for Every Grade, Every Beginning</strong>{' '}
              in collaboration with{' '}
              <strong>Desert Ridge Preparatory in Kingman, Arizona</strong>.
            </p>

            <p>
              This pilot will help demonstrate how the Aleph, Bet, and Gimel Tracks
              can serve students of different ages, backgrounds, and Hebrew readiness
              levels within a flexible classroom setting.
            </p>

            <p>
              We gratefully acknowledge Desert Ridge Preparatory for helping make
              this first implementation possible and for welcoming a model designed
              to make Hebrew learning approachable, joyful, and confidence-building.
            </p>
          </div>
        </section>

        <section id="support" className="section support">
          <div className="support-content">
            <p className="eyebrow">Support the Work</p>
            <h2>Help build the first doorway into Hebrew learning.</h2>

            <p>
              Grant support and donor partnerships help LuminaNexus develop
              curriculum materials, teacher guides, student resources, family
              handouts, pilot documentation, and future school partnerships.
            </p>

            <a href="mailto:info@luminanexus.org" className="button primary">
              Contact LuminaNexus
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} LuminaNexus Foundation.
          Hebrew for Every Grade, Every Beginning.
        </p>
      </footer>
    </>
  )
}
