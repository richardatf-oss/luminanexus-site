import Header from './components/Header'
import HeroTree from './components/HeroTree'
import TreeOfLife from './components/TreeOfLife'
import Library from './components/Library'
import ChavrutaPanel from './components/ChavrutaPanel'
import Support from './components/Support'

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

        {/* Core Identity — this is now the centerpiece */}
        <TreeOfLife />

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
