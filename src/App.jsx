import Header from './components/Header'
import Hero from './components/Hero'
import HeroTree from './components/HeroTree'
import TreeOfLife from './components/TreeOfLife'
import Library from './components/Library'
import ChavrutaPanel from './components/ChavrutaPanel'
import Support from './components/Support'

export default function App() {
  return (
    <div className="app-root">
      <Header />

      <main>
        {/* HERO */}
        <Hero />

        {/* TREE FRONT AND CENTER */}
        <HeroTree />

        {/* FULL TREE EXPERIENCE */}
        <TreeOfLife />

        {/* LIBRARY */}
        <Library />

        {/* CHAVRUTA */}
        <ChavrutaPanel />

        {/* SUPPORT */}
        <Support />
      </main>
    </div>
  )
}
