import Header from './components/Header'
import Hero from './components/Hero'
import TreeOfLife from './components/TreeOfLife'
import Pillars from './components/Pillars'
import ChavrutaPanel from './components/ChavrutaPanel'
import FeatureSections from './components/FeatureSections'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="site-shell">
      <Header />

      <main>
        <Hero />
        <TreeOfLife />
        <Pillars />
        <ChavrutaPanel />
        <FeatureSections />
      </main>

      <Footer />
    </div>
  )
}
