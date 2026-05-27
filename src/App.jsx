import Header from './components/Header'
import HeroTree from './components/HeroTree'
import RootsLetters from './components/RootsLetters'
import SefariaStudy from './components/SefariaStudy'
import Library from './components/Library'
import ChavrutaPanel from './components/ChavrutaPanel'
import Support from './components/Support'

function IvritCodeSection() {
  return (
    <section id="ivritcode" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">IvritCode</p>
        <h2 className="content-block__title">Where language becomes structure</h2>
        <p className="content-block__text">
          IvritCode explores Hebrew as a living symbolic system — where letters,
          number, pattern, and meaning converge into a new form of computation
          and interpretation.
        </p>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="app-root">
      <Header />

      <main>
        <HeroTree />
        <RootsLetters />
        <SefariaStudy />
        <Library />
        <ChavrutaPanel />
        <IvritCodeSection />
        <Support />
      </main>
    </div>
  )
}
