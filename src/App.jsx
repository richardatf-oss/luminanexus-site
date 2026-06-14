import { useState } from "react";

const zeffyLink =
  "https://www.zeffy.com/en-US/donation-form/luminanexus-a-digital-sanctuary-of-light";

const stripeLink = "https://buy.stripe.com/aFafZg7nf8R44ihewy4gg00";

const tracks = [
  {
    title: "Aleph Track",
    subtitle: "First Beginning",
    description:
      "For students who are new to Hebrew at any grade level. Learners begin with directionality, letter recognition, sounds, names, simple words, and confidence.",
  },
  {
    title: "Bet Track",
    subtitle: "Building the Word",
    description:
      "For students who know some letters and are ready for vowels, syllables, decoding, vocabulary, roots, and simple phrases.",
  },
  {
    title: "Gimel Track",
    subtitle: "Reading with Meaning",
    description:
      "For students ready to read words and short phrases while exploring roots, fluency, culture, meaning, and interpretation.",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site">
      <header className="site-header">
        <nav className="nav" aria-label="Main navigation">
          <a href="#home" className="brand" onClick={closeMenu}>
            <span className="brand-mark">א</span>
            <span className="brand-name">LuminaNexus</span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>

          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#mission" onClick={closeMenu}>
              Mission
            </a>
            <a href="#ivrit-haor" onClick={closeMenu}>
              Ivrit HaOr
            </a>
            <a href="#tracks" onClick={closeMenu}>
              Tracks
            </a>
            <a href="#pilot" onClick={closeMenu}>
              Pilot
            </a>
            <a href="#support" onClick={closeMenu}>
              Support
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="section-inner hero-inner">
            <p className="eyebrow">LuminaNexus Foundation</p>

            <h1>Hebrew for Every Grade, Every Beginning.</h1>

            <p className="hero-text">
              A one-hour-per-week Hebrew enrichment program for K–12 students,
              designed so learners can enter at any age, begin with confidence,
              and quickly find their place.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#ivrit-haor">
                Explore the Program
              </a>

              <a className="btn btn-secondary" href="#support">
                Support the Work
              </a>
            </div>
          </div>
        </section>

        <section id="mission" className="section">
          <div className="section-inner">
            <p className="eyebrow">Our Mission</p>

            <h2>Every student begins somewhere.</h2>

            <div className="card large-card">
              <p>
                Some begin with Aleph. Some begin with their name. Some begin
                with a song. Some begin with curiosity. Some begin because a
                teacher opened a door.
              </p>

              <p>
                LuminaNexus Foundation provides accessible Hebrew education for
                K–12 students through a flexible enrichment model designed for
                schools, homeschool groups, families, and educational partners.
              </p>

              <p>
                At LuminaNexus, beginning is not a disadvantage. Beginning is
                the whole point.
              </p>
            </div>
          </div>
        </section>

        <section id="ivrit-haor" className="section section-warm">
          <div className="section-inner two-column">
            <div>
              <p className="eyebrow">Ivrit HaOr</p>

              <h2>Hebrew of Light</h2>

              <p>
                Ivrit HaOr is the LuminaNexus Hebrew curriculum: a path of
                letters, sounds, names, roots, culture, and meaning.
              </p>

              <p>
                The program is built for one hour per week and welcomes students
                by readiness rather than embarrassment. A high school student
                who has never seen Hebrew can begin with Aleph in an
                age-appropriate way. A younger student who already knows letters
                can move forward into vowels, words, and roots.
              </p>
            </div>

            <div className="card">
              <h3>What students learn</h3>

              <ul className="clean-list">
                <li>Hebrew directionality</li>
                <li>Letter recognition and sounds</li>
                <li>Names in Hebrew</li>
                <li>Basic vowels and syllables</li>
                <li>Simple vocabulary</li>
                <li>Hebrew roots and word families</li>
                <li>Culture, meaning, and confidence</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="tracks" className="section">
          <div className="section-inner">
            <p className="eyebrow">Flexible Learning Paths</p>

            <h2>Three tracks. Many beginnings.</h2>

            <p className="section-lead">
              Students are placed by Hebrew readiness, not by shame or grade
              level. Each track gives learners a clear doorway and a next step.
            </p>

            <div className="track-grid">
              {tracks.map((track) => (
                <article className="card track-card" key={track.title}>
                  <p className="track-label">{track.title}</p>
                  <h3>{track.subtitle}</h3>
                  <p>{track.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pilot" className="section section-warm">
          <div className="section-inner">
            <p className="eyebrow">Pilot Program</p>

            <h2>A classroom doorway in Kingman, Arizona.</h2>

            <div className="card large-card">
              <p>
                LuminaNexus Foundation is honored to launch the pilot phase of{" "}
                <strong>Ivrit HaOr: Hebrew for Every Grade, Every Beginning</strong>{" "}
                in collaboration with{" "}
                <strong>Desert Ridge Preparatory in Kingman, Arizona</strong>.
              </p>

              <p>
                This pilot will help demonstrate how the Aleph, Bet, and Gimel
                Tracks can serve students of different ages, backgrounds, and
                Hebrew readiness levels within a flexible classroom setting.
              </p>

              <p>
                We gratefully acknowledge Desert Ridge Preparatory for helping
                make this first implementation possible and for welcoming a
                model designed to make Hebrew learning approachable, joyful, and
                confidence-building.
              </p>
            </div>
          </div>
        </section>

        <section id="support" className="section support-section">
          <div className="section-inner support-inner">
            <p className="eyebrow">Support the Work</p>

            <h2>Help build the first doorway into Hebrew learning.</h2>

            <p>
              Your gift helps LuminaNexus Foundation provide accessible Hebrew
              enrichment, classroom materials, teacher guides, student
              resources, family handouts, pilot documentation, and future school
              partnerships.
            </p>

            <div className="support-actions">
              <a
                className="btn btn-primary"
                href={zeffyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Donate with Zeffy
              </a>

              <a
                className="btn btn-secondary"
                href={stripeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Give with Stripe
              </a>
            </div>

            <p className="support-note">
              Every donation helps a student begin.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © 2026 LuminaNexus Foundation. Hebrew for Every Grade, Every
          Beginning.
        </p>
      </footer>
    </div>
  );
}

export default App;
