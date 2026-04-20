import Header from './components/Header'
import Hero from './components/Hero'
import ChavrutaPanel from './components/ChavrutaPanel'
import Library from './components/Library'

function TreePlaceholder() {
  return (
    <section id="tree" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">The Tree</p>
        <h2 className="content-block__title">The Tree of Life as architecture</h2>
        <p className="content-block__text">
          LuminaNexus is shaped by the sefirot as a living sanctuary of study.
          This chamber will continue to unfold into a fuller Tree interface with
          pathways, pillars, and relational movement.
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
          This chamber holds Hebrew-rooted symbolic computation, interpretive
          architecture, and experimental structures of meaning.
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
          sanctuary can continue to deepen in beauty, clarity, and usefulness.
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
        <Library />
        <ChavrutaPanel />
        <IvritCodePlaceholder />
        <SupportPlaceholder />
      </main>

      <Footer />
    </div>
  )
}
