import { useState } from "react";
import ChavrutaClassroom from "./components/ChavrutaClassroom.jsx";

const zeffyLink =
  "https://www.zeffy.com/en-US/donation-form/luminanexus-a-digital-sanctuary-of-light";

const tracks = [
  {
    letter: "א",
    title: "Aleph Track",
    subtitle: "First Beginning",
    image: "/images/aleph-doorway.webp",
    alt: "An illustrated Hebrew workbook beside a glowing doorway",
    description:
      "For students who are new to Hebrew at any grade level. Learners begin with directionality, letter recognition, sounds, names, simple words, and confidence.",
  },
  {
    letter: "ב",
    title: "Bet Track",
    subtitle: "Building the Word",
    image: "/images/bet-building-words.webp",
    alt: "Illustrated Hebrew letter blocks arranged for word-building",
    description:
      "For students who know some letters and are ready for vowels, syllables, decoding, vocabulary, roots, and simple phrases.",
  },
  {
    letter: "ג",
    title: "Gimel Track",
    subtitle: "Reading with Meaning",
    image: "/images/gimel-reading-meaning.webp",
    alt: "An illustrated path of Hebrew letters rising from an open book",
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
            <a href="#mission" onClick={closeMenu}>
              Mission
            </a>

            <a href="#ivrit-haor" onClick={closeMenu}>
              Ivrit HaOr
            </a>

            <a href="#schools" onClick={closeMenu}>
              Schools
            </a>

            <a href="#resources" onClick={closeMenu}>
              Resources
            </a>

            <a href="/sources.html" onClick={closeMenu}>
              Sources
            </a>

            <a href="#teacher-dashboard" onClick={closeMenu}>
              Dashboard
            </a>

            <a href="#chavruta" onClick={closeMenu}>
              Havari
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
        <section id="home" className="hero">
          <div>
            <p className="eyebrow">Hebrew for Every Grade, Every Beginning</p>

            <h1>
              No student is late to Hebrew.
              <span>Every letter is a beginning.</span>
            </h1>

            <p className="hero-text">
              Accessible Hebrew enrichment for schools, families, and beginning
              learners—meeting every student by readiness, not shame or grade level.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#ivrit-haor">
                Explore Ivrit HaOr
              </a>

              <a className="button secondary" href="#chavruta">
                Open Chavruta / Havari
              </a>

              <a className="button secondary" href="#resources">
                View Resources
              </a>

              <a className="button secondary" href="#support">
                Support the Work
              </a>
            </div>
          </div>

          <aside className="hero-card hero-image-card" aria-label="Hebrew word for light">
            <img
              src="/images/ivrit-haor-hero.webp"
              alt="A luminous tree and doorway rising from an open book with Hebrew letters"
              fetchPriority="high"
            />
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
          <div className="section-heading">
            <p className="eyebrow">Ivrit HaOr</p>

            <h2>Hebrew of Light: the LuminaNexus curriculum.</h2>

            <p className="section-intro">
              Ivrit HaOr is a readiness-based Hebrew enrichment program for K–12
              students. It introduces Hebrew letters, sounds, names, roots,
              culture, and meaning through a gentle one-hour-per-week model.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <h3>What it teaches</h3>
              <p>
                Hebrew directionality, letter recognition, basic sounds, vowels,
                syllables, simple vocabulary, roots, names in Hebrew, cultural
                literacy, and confidence.
              </p>
            </article>

            <article className="feature-card">
              <h3>Who it serves</h3>
              <p>
                Students may begin in kindergarten, middle school, high school,
                or anywhere in between. A student who starts later is not
                behind; they are simply beginning at their doorway.
              </p>
            </article>

            <article className="feature-card">
              <h3>How it works</h3>
              <p>
                Students enter through Aleph, Bet, or Gimel Tracks based on
                readiness. Each lesson gives learners a clear skill, a simple
                practice, and a meaningful next step.
              </p>
            </article>
          </div>

          <div className="two-column">
            <div className="feature-card">
              <h3>The one-hour lesson rhythm</h3>

              <p>
                A typical Ivrit HaOr lesson includes welcome, review, new Hebrew
                learning, guided practice, student participation, and a short
                closing reflection.
              </p>

              <p>
                The structure is simple enough for weekly enrichment, but
                flexible enough for mixed-age groups and students who enter at
                different levels.
              </p>
            </div>

            <div className="feature-card">
              <h3>Curriculum materials in development</h3>

              <p>
                LuminaNexus Foundation is developing a Master Curriculum
                Framework, Teacher Guide, Aleph / Bet / Gimel Track maps,
                student worksheets, printable Hebrew charts, and school-facing
                overview materials.
              </p>

              <p>
                These resources are being shaped through the pilot phase and
                will grow into downloadable classroom materials.
              </p>
            </div>
          </div>

          <div className="hero-actions">
            <a className="button primary" href="#tracks">
              View the Tracks
            </a>

            <a className="button secondary" href="#schools">
              For Schools
            </a>

            <a className="button secondary" href="#resources">
              Curriculum Resources
            </a>

            <a className="button secondary" href="#chavruta">
              Try Chavruta
            </a>
          </div>
        </section>

        <section id="schools" className="section">
          <div className="section-heading">
            <p className="eyebrow">For Schools</p>

            <h2>A gentle Hebrew enrichment model for real classrooms.</h2>

            <p className="section-intro">
              Ivrit HaOr is designed for schools, homeschool groups, enrichment
              programs, and pilot classrooms that want to introduce Hebrew in a
              respectful, accessible, and readiness-based way.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <h3>One hour per week</h3>
              <p>
                The program is built around a practical weekly enrichment block.
                Each lesson can include letter review, sound practice,
                vocabulary, student names, short activities, and a simple
                confidence-building close.
              </p>
            </article>

            <article className="feature-card">
              <h3>Readiness-based placement</h3>
              <p>
                Students enter through Aleph, Bet, or Gimel Tracks based on
                Hebrew readiness rather than grade level. A student who begins
                later is not behind; they are simply at their first doorway.
              </p>
            </article>

            <article className="feature-card">
              <h3>School-safe boundaries</h3>
              <p>
                Ivrit HaOr teaches Hebrew language, letters, sounds, roots,
                culture, and meaning. It is not a conversion program, religious
                authority, or substitute for a rabbi or Jewish educator.
              </p>
            </article>
          </div>

          <div className="two-column">
            <div className="feature-card">
              <h3>What a school can expect</h3>

              <p>
                LuminaNexus Foundation provides a flexible framework for Hebrew
                enrichment: teacher guidance, student-friendly pacing, printable
                materials, family-facing language, and Chavruta Classroom
                support.
              </p>

              <p>
                The goal is to help students recognize Hebrew as approachable,
                beautiful, and meaningful while building literacy confidence one
                letter at a time.
              </p>
            </div>

            <div className="feature-card">
              <h3>Program guardrails</h3>

              <p>
                Sacred language is handled respectfully and sparingly. Lessons
                may acknowledge Jewish culture and tradition, but the classroom
                focus remains Hebrew enrichment, cultural literacy, and language
                learning.
              </p>

              <p>
                Questions involving Jewish law, conversion, religious rulings,
                or personal spiritual authority should be directed to a
                qualified rabbi or Jewish educator.
              </p>
            </div>
          </div>
        </section>

        <section id="resources" className="section warm">
          <div className="section-heading">
            <p className="eyebrow">Curriculum Resources</p>

            <h2>Living curriculum pages for the Ivrit HaOr classroom.</h2>

            <p className="section-intro">
              Ivrit HaOr materials are being prepared for the pilot classroom.
              These pages are intentionally updateable as lessons, worksheets,
              illustrations, and teacher notes are completed.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <h3>Teacher Guide</h3>
              <p>
                Read the online Teacher Guide for classroom posture, the
                one-hour rhythm, Chavruta Classroom, assessment without shame,
                family communication, and the developing lesson sequence.
              </p>
              <a className="button primary" href="/teacher-guide.html">
                Open Teacher Guide
              </a>
              <a className="button secondary" href="/placement-quick-check.html">
                Placement Quick-Check
              </a>
            </article>

            <article className="feature-card">
              <h3>Aleph Track Workbook</h3>
              <p>
                First Beginning. A gentle student workbook for Hebrew
                directionality, letter recognition, tracing, Aleph and Ayin, Bet
                and Vet, and early Hebrew confidence. This track is being
                expanded lesson by lesson.
              </p>
              <a className="button secondary" href="/aleph-track.html">
                Open Aleph Track
              </a>
              <a
                className="button secondary"
                href="/downloads/Aleph_Track_Printable.pdf"
              >
                Download PDF
              </a>
            </article>

            <article className="feature-card">
              <h3>Bet Track Workbook</h3>
              <p>
                Building the Word. A developing track for students ready to move
                from letter recognition into right-to-left word-building, simple
                sounds, syllables, vowels, and early decoding.
              </p>
              <a className="button secondary" href="/bet-track.html">
                Open Bet Track
              </a>
              <a className="button secondary" href="/downloads/Bet_Track_Printable.pdf">
                Download PDF
              </a>
            </article>

            <article className="feature-card">
              <h3>Gimel Track Workbook</h3>
              <p>
                Reading with Meaning. A developing track for students ready to
                read short Hebrew words, connect them to meaning, notice roots,
                and begin simple Hebrew explanation.
              </p>
              <a className="button secondary" href="/gimel-track.html">
                Open Gimel Track
              </a>
              <a className="button secondary" href="/downloads/Gimel_Track_Printable.pdf">
                Download PDF
              </a>
            </article>

            <article className="feature-card">
              <h3>Placement Quick-Check</h3>
              <p>
                Find the right starting doorway without ranking or shaming a
                student. Placement supports confidence and may change over time.
              </p>
              <a className="button secondary" href="/placement-quick-check.html">
                Open Placement Tool
              </a>
            </article>

            <article className="feature-card">
              <h3>Printable Downloads</h3>
              <p>
                Printable workbooks are prepared during the pilot phase. Aleph,
                Bet, and Gimel Track PDFs are available now and will continue to
                grow with their living curriculum pages.
              </p>
              <a className="button secondary" href="/downloads/Aleph_Track_Printable.pdf">
                Aleph Printable
              </a>
              <a className="button secondary" href="/downloads/Bet_Track_Printable.pdf">
                Bet Printable
              </a>
              <a className="button secondary" href="/downloads/Gimel_Track_Printable.pdf">
                Gimel Printable
              </a>
            </article>

            <article className="feature-card">
              <h3>Source Library</h3>
              <p>
                Sefaria.org provides access to Jewish texts and translations.
                Ivrit HaOr may link to selected Hebrew source passages for
                cultural literacy and teacher reference.
              </p>
              <a
                className="button secondary"
                href="https://www.sefaria.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Sefaria
              </a>
              <a className="button secondary" href="/sources.html">
                Open Source Library
              </a>
            </article>
          </div>
        </section>

        <section id="teacher-dashboard" className="section">
          <div className="section-heading">
            <p className="eyebrow">Teacher Dashboard</p>
            <h2>A practical doorway for the pilot classroom.</h2>
            <p className="section-intro">
              Prepare a first session, find each student’s starting doorway,
              and move into track work without labels or shame.
            </p>
          </div>

          <img
            className="section-banner"
            src="/images/teacher-dashboard.webp"
            alt="A warm illustrated teacher workspace with curriculum cards, notebooks, and Hebrew letter blocks"
            loading="lazy"
          />

          <div className="feature-grid">
            <article className="feature-card">
              <h3>Week 1 Teaching Packet</h3>
              <p>
                Start with the placement quick-check, then guide students into
                Aleph, Bet, or Gimel readiness work.
              </p>
              <a className="button primary" href="/teacher-guide.html">
                Open Teacher Guide
              </a>
            </article>

            <article className="feature-card">
              <h3>Placement Quick-Check</h3>
              <p>
                A no-shame way to observe whether a student begins with
                letters, word-building, or reading with meaning.
              </p>
              <a className="button secondary" href="/placement-quick-check.html">
                Find the Right Doorway
              </a>
            </article>

            <article className="feature-card">
              <h3>Printable Materials</h3>
              <p>
                Print-ready Aleph, Bet, and Gimel workbooks are available now
                and will be refreshed as the tracks expand.
              </p>
              <a className="button secondary" href="/downloads/Aleph_Track_Printable.pdf">
                Aleph Printable
              </a>
              <a className="button secondary" href="/downloads/Bet_Track_Printable.pdf">
                Bet Printable
              </a>
              <a className="button secondary" href="/downloads/Gimel_Track_Printable.pdf">
                Gimel Printable
              </a>
            </article>

            <article className="feature-card">
              <h3>Chavruta / Havari Support</h3>
              <p>
                Use Chavruta / Havari for gentle review questions, student next
                steps, and teacher language.
              </p>
              <a className="button secondary" href="#chavruta">
                Ask Havari
              </a>
            </article>
          </div>
        </section>

        <ChavrutaClassroom />

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
                <img className="track-image" src={track.image} alt={track.alt} loading="lazy" />
                <div className="track-letter">{track.letter}</div>
                <h3>{track.title}</h3>
                <p className="track-subtitle">{track.subtitle}</p>
                <p>{track.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="noahide-parchat" className="section noahide-path">
          <div className="section-heading">
            <p className="eyebrow">A Separate Study Path</p>
            <h2>Noahide Parchat</h2>
            <p className="section-intro">
              The weekly Torah portion through the eyes of the nations—honoring
              Israel, respecting the Torah, and receiving universal wisdom
              without claiming Jewish obligation or replacing Jewish interpretation.
            </p>
          </div>
          <img
            className="section-banner"
            src="/images/noahide-parchat.webp"
            alt="An illuminated scroll and open book beneath a pathway of Hebrew letters"
            loading="lazy"
          />
          <div className="feature-grid">
            <article className="feature-card">
              <h3>Honor the source</h3>
              <p>Torah is entrusted to Israel. This path approaches as a respectful guest, with gratitude and care.</p>
            </article>
            <article className="feature-card">
              <h3>Light for the nations</h3>
              <p>Each portion asks what universal wisdom may shape justice, mercy, speech, family, and responsibility.</p>
            </article>
            <article className="feature-card">
              <h3>Keep clear boundaries</h3>
              <p>Questions of Jewish law, conversion, or religious rulings belong with a qualified rabbi or Jewish educator.</p>
            </article>
          </div>
          <div className="hero-actions">
            <a
              className="button secondary"
              href="https://luminanexus-noahide-parchat.richardatf.chatgpt.site"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Noahide Parchat
            </a>
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
              enrichment, classroom materials, teacher guides, student resources,
              family handouts, pilot documentation, Noahide study materials, and
              future school partnerships.
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
