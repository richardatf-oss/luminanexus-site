import Header from './components/Header'
import Hero from './components/Hero'
import ChavrutaPanel from './components/ChavrutaPanel'

function TreePlaceholder() {
  return (
    <section id="tree" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">The Tree</p>
        <h2 className="content-block__title">The Tree of Life as architecture</h2>
        <p className="content-block__text">
          LuminaNexus is designed as a living sanctuary shaped by the sefirot.
          This space will become the interactive Tree gateway into the Library,
          Chavruta, Hebrew, IvritCode, and the hidden Aleph Olam.
        </p>
      </div>
    </section>
  )
}

function LibraryPlaceholder() {
  return (
    <section id="library" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">Library</p>
        <h2 className="content-block__title">A sanctuary for study</h2>
        <p className="content-block__text">
          The Library will hold teachings, reflections, Hebrew pathways, symbolic
          architecture, and sacred study materials arranged for return rather than
          hurry.
        </p>
      </div>
    </section>
  )
}

function IvritCodePlaceholder() {
  return (
    <section id="ivritcode" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">IvritCode</p>
        <h2 className="content-block__title">Where language becomes structure</h2>
        <p className="content-block__text">
          This chamber will hold Hebrew-rooted symbolic computation, interpretive
          architecture, and experiments in form, number, and meaning.
        </p>
      </div>
    </section>
  )
}

function SupportPlaceholder() {
  return (
    <section id="support" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">Support</p>
        <h2 className="content-block__title">Help keep the sanctuary open</h2>
        <p className="content-block__text">
          Support LuminaNexus through giving, partnership, and shared work so the
          sanctuary can continue to grow in beauty, depth, and usefulness.
        </p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      LuminaNexus · A quiet digital sanctuary for study, language, beauty, and light.
    </footer>
  )
}

export default function App() {
  return (
    <div className="site-shell">
      <Header />

      <main>
        <Hero />
        <TreePlaceholder />
        <LibraryPlaceholder />
        <ChavrutaPanel />
        <IvritCodePlaceholder />
        <SupportPlaceholder />
      </main>

      <Footer />
    </div>
  )
}
