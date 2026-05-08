import { useState } from 'react'

const NODES = [
  { id: 'keter', hebrew: 'כתר', name: 'Keter', x: 50, y: 7 },
  { id: 'chokhmah', hebrew: 'חכמה', name: 'Chokhmah', x: 28, y: 23 },
  { id: 'binah', hebrew: 'בינה', name: 'Binah', x: 72, y: 23 },
  { id: 'chesed', hebrew: 'חסד', name: 'Chesed', x: 22, y: 42 },
  { id: 'gevurah', hebrew: 'גבורה', name: 'Gevurah', x: 78, y: 42 },
  { id: 'tiferet', hebrew: 'תפארת', name: 'Tiferet', x: 50, y: 51 },
  { id: 'netzach', hebrew: 'נצח', name: 'Netzach', x: 28, y: 69 },
  { id: 'hod', hebrew: 'הוד', name: 'Hod', x: 72, y: 69 },
  { id: 'yesod', hebrew: 'יסוד', name: 'Yesod', x: 50, y: 83 },
  { id: 'malkhut', hebrew: 'מלכות', name: 'Malkhut', x: 50, y: 96 },
]

const PATHS = [
  ['keter', 'chokhmah'],
  ['keter', 'binah'],
  ['chokhmah', 'binah'],
  ['chokhmah', 'chesed'],
  ['binah', 'gevurah'],
  ['chokhmah', 'tiferet'],
  ['binah', 'tiferet'],
  ['chesed', 'gevurah'],
  ['chesed', 'tiferet'],
  ['gevurah', 'tiferet'],
  ['chesed', 'netzach'],
  ['gevurah', 'hod'],
  ['tiferet', 'netzach'],
  ['tiferet', 'hod'],
  ['tiferet', 'yesod'],
  ['netzach', 'hod'],
  ['netzach', 'yesod'],
  ['hod', 'yesod'],
  ['yesod', 'malkhut'],
]

function getNode(id) {
  return NODES.find((node) => node.id === id)
}

export default function HeroTree() {
  const [active, setActive] = useState('tiferet')

  return (
    <section id="top" className="hero-tree">
      <div className="hero-tree__inner">
        <div className="hero-tree__copy">
          <p className="landing__seal">
            Dedicated to sacred study, language, beauty, and light
          </p>

          <h1 className="landing__title">
            Enter a living architecture of study.
          </h1>

          <p className="landing__text">
            LuminaNexus is a quiet digital sanctuary shaped by the Tree of Life —
            a place where Hebrew letters, contemplative learning, sacred art,
            and symbolic design gather into one luminous order.
          </p>

          <div className="landing__actions">
            <a href="#tree" className="button-primary">Begin the Path</a>
            <a href="#chavruta" className="button-secondary">Ask ChavrutaGPT</a>
          </div>
        </div>

        <div className="hero-tree__panel">
          <div className="hero-tree-map">
            <svg className="hero-tree-map__paths" viewBox="0 0 100 100" preserveAspectRatio="none">
              {PATHS.map(([from, to]) => {
                const a = getNode(from)
                const b = getNode(to)

                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className={
                      from === active || to === active
                        ? 'hero-tree-map__line hero-tree-map__line--active'
                        : 'hero-tree-map__line'
                    }
                  />
                )
              })}
            </svg>

            {NODES.map((node) => (
              <button
                key={node.id}
                type="button"
                className={
                  node.id === active
                    ? 'hero-tree-node hero-tree-node--active'
                    : 'hero-tree-node'
                }
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => setActive(node.id)}
              >
                <span className="hero-tree-node__hebrew">{node.hebrew}</span>
                <span className="hero-tree-node__name">{node.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
