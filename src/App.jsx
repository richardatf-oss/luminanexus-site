import { useState } from "react";

const zeffyLink =
  "https://www.zeffy.com/en-US/donation-form/luminanexus-a-digital-sanctuary-of-light";

const tracks = [
  {
    letter: "א",
    title: "Aleph Track",
    subtitle: "First Beginning",
    description:
      "For students who are new to Hebrew at any grade level. Learners begin with directionality, letter recognition, sounds, names, simple words, and confidence.",
  },
  {
    letter: "ב",
    title: "Bet Track",
    subtitle: "Building the Word",
    description:
      "For students who know some letters and are ready for vowels, syllables, decoding, vocabulary, roots, and simple phrases.",
  },
  {
    letter: "ג",
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
        <nav className="nav-container" aria-label="Main navigation">
          <a href="#home" className="brand" onClick={closeMenu}>
            <span className="brand-mark">א</span>
            <span className="brand-text">LuminaNexus</span>
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
            <a href="#mission" onClick={closeMenu}>Mission</a>
            <a href="#ivrit-haor" onClick={closeMenu}>Ivrit HaOr</a>
            <a href="#tracks" onClick={closeMenu}>Tracks</a>
            <a href="#pilot" onClick={closeMenu}>Pilot</a>
            <a href="#support" onClick={closeMenu}>Support</a>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <div>
            <p className="eyebrow">Hebrew for Every Grade, Every Beginning</p>

            <h1>
              No student is late to Hebrew.
              <span>Every letter is a beginning.</span>
            </h1>

            <p className="hero-text">
              LuminaNexus Foundation creates welcoming Hebrew enrichment
              programs that meet students by readiness, not shame or grade
              level.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#ivrit-haor">
                Explore the Program
              </a>

              <a className="button secondary" href="#support">
                Support the Work
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Hebrew word for light">
            <div className="hebrew-large" dir="rtl">
              אור
            </div>
            <p className="translit">or</p>
            <p className="meaning">Light</p>
          </aside>
        </section>

        <section id="mission" className="section">
          <div className="section-heading">
            <p className="eyebrow">Our Mission</p>

            <h2>Every student begins somewhere.</h2>

            <p className="section-intro">
              LuminaNexus Foundation provides accessible Hebrew education for
              K–12 students through a one-hour-per-week enrichment program
              designed so learners can enter at any grade level and quickly
              find their place.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <h3>Begin with letters</h3>
              <p>
                Students learn Hebrew directionality, letter shapes, sounds, and
                confidence through clear, gentle instruction.
              </p>
            </article>

            <article className="feature-card">
              <h3>Begin with names</h3>
              <p>
                Students see themselves inside the language by learning how
                Hebrew letters can form names and meaningful words.
              </p>
            </article>

            <article className="feature-card">
              <h3>Begin with meaning</h3>
              <p>
                Students discover roots, vocabulary, culture, and the beauty of
                Hebrew as a language of memory and light.
              </p>
            </article>
          </div>
        </section>

        <section id="ivrit-haor" className="section warm">
          <div className="two-column">
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

            <div className="feature-card">
              <h3>What students learn</h3>

              <p>
                Hebrew directionality, letter recognition, sounds, names,
                vowels, syllables, simple vocabulary, roots, culture, meaning,
                and confidence.
              </p>

              <p>
                The goal is not only to teach students how Hebrew looks and
                sounds, but to help them feel that Hebrew is approachable,
                beautiful, and meaningful.
              </p>
            </div>
          </div>
        </section>

        <section id="tracks" className="section">
          <div className="section-heading">
            <p className="eyebrow">Flexible Learning Paths</p>

            <h2>Three tracks. Many beginnings.</h2>

            <p className="section-intro">
              Students are placed by Hebrew readiness, not shame or grade level.
              Each track gives learners a clear doorway and a next step.
            </p>
          </div>

          <div className="track-grid">
            {tracks.map((track) => (
              <article className="track-card" key={track.title}>
                <div className="track-letter">{track.letter}</div>
                <h3>{track.title}</h3>
                <p className="track-subtitle">{track.subtitle}</p>
                <p>{track.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pilot" className="section pilot">
          <div>
            <p className="eyebrow">Pilot Program</p>

            <h2>A classroom doorway in Kingman, Arizona.</h2>

            <div className="pilot-box">
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

        <section id="support" className="section support">
          <div className="support-content">
            <p className="eyebrow">Support the Work</p>

            <h2>Help build the first doorway into Hebrew learning.</h2>

            <p>
              Your gift helps LuminaNexus Foundation provide accessible Hebrew
              enrichment, classroom materials, teacher guides, student
              resources, family handouts, pilot documentation, and future school
              partnerships.
            </p>

            <a
              className="button primary"
              href={zeffyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Donate with Zeffy
            </a>

            <p>
              <strong>Every donation helps a student begin.</strong>
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
