import Header from './components/Header'
import Hero from './components/Hero'
import Library from './components/Library'
import ChavrutaPanel from './components/ChavrutaPanel'
import Support from './components/Support'

function TreeSection() {
  return (
    <section id="tree" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">The Tree</p>
        <h2 className="content-block__title">
          The Tree of Life as architecture
        </h2>
        <p className="content-block__text">
          LuminaNexus is shaped by the sefirot as a living structure of
          relationship — descent, balance, and return. This chamber will
          continue to unfold into a fully interactive Tree, revealing pathways,
          pillars, and connections across the sanctuary.
        </p>
      </div>
    </section>
  )
}

function IvritCodeSection() {
  return (
    <section id="ivritcode" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">IvritCode</p>
        <h2 className="content-block__title">
          Where language becomes structure
        </h2>
        <p className="content-block__text">
          This chamber holds Hebrew-rooted symbolic computation, interpretive
          architecture, and experimental structures where language, number, and
          meaning converge.
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
        {/* Entrance */}
        <Hero />

        {/* Structure */}
        <TreeSection />

        {/* Knowledge */}
        <Library />

        {/* Practice */}
        <ChavrutaPanel />

        {/* Expression */}
        <IvritCodeSection />

        {/* Offering */}
        <Support />
      </main>

      <Footer />
    </div>
  )
}
