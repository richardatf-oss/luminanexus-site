import Header from './components/Header'
import Hero from './components/Hero'
import HeroTree from './components/HeroTree'

import RootsLetters from './components/RootsLetters'
import Library from './components/Library'
import ChavrutaPanel from './components/ChavrutaPanel'
import Support from './components/Support'

function IvritCodeSection() {
  return (
    <section id="ivritcode" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">
          IvritCode
        </p>

        <h2 className="content-block__title">
          Where language becomes structure
        </h2>

        <p className="content-block__text">
          IvritCode explores Hebrew as a living symbolic architecture —
          where letters, number, rhythm, sound, and meaning converge
          into a new contemplative computational framework.
        </p>

        <div className="hero-actions" style={{ marginTop: '2rem' }}>
          <a href="#roots-letters" className="button-primary">
            Explore Roots
          </a>

          <a href="#library" className="button-secondary">
            Open the Library
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer
      className="footer"
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        color: 'rgba(244,239,227,0.58)',
        fontSize: '0.95rem',
        letterSpacing: '0.04em'
      }}
    >
      LuminaNexus · A quiet digital sanctuary for study, language,
      beauty, and light.
    </footer>
  )
}

export default function App() {
  return (
    <div className="app-root">
      <Header />

      <main>

        {/* HERO */}
        <Hero />

        {/* TREE */}
        <HeroTree />

        {/* FULL TREE EXPERIENCE */}
        <TreeOfLife />

        {/* ROOTS & LETTERS */}
        <RootsLetters />

        {/* LIBRARY */}
        <Library />

        {/* CHAVRUTA */}
        <ChavrutaPanel />

        {/* IVRITCODE */}
        <IvritCodeSection />

        {/* SUPPORT */}
        <Support />

      </main>

      <Footer />
    </div>
  )
}
