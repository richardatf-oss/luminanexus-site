import { useState } from 'react'

const NODES = [
  { id: 'keter', hebrew: 'כתר', name: 'Keter', x: 50, y: 8 },
  { id: 'chokhmah', hebrew: 'חכמה', name: 'Chokhmah', x: 28, y: 24 },
  { id: 'binah', hebrew: 'בינה', name: 'Binah', x: 72, y: 24 },
  { id: 'chesed', hebrew: 'חסד', name: 'Chesed', x: 22, y: 44 },
  { id: 'gevurah', hebrew: 'גבורה', name: 'Gevurah', x: 78, y: 44 },
  { id: 'tiferet', hebrew: 'תפארת', name: 'Tiferet', x: 50, y: 52 },
  { id: 'netzach', hebrew: 'נצח', name: 'Netzach', x: 28, y: 70 },
  { id: 'hod', hebrew: 'הוד', name: 'Hod', x: 72, y: 70 },
  { id: 'yesod', hebrew: 'יסוד', name: 'Yesod', x: 50, y: 84 },
  { id: 'malkhut', hebrew: 'מלכות', name: 'Malkhut', x: 50, y: 98 },
]

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
            a place where Hebrew letters, contemplative learning,
            sacred art, and symbolic design gather into one luminous order.
          </p>

          <div className="landing__actions">
            <a href="#tree" className="button-primary">
              Begin the Path
            </a>

            <a href="#chavruta" className="button-secondary">
              Ask ChavrutaGPT
            </a>
          </div>
        </div>

        <div className="hero-tree__panel">
          <div className="hero-tree-map">

            <svg
              className="hero-tree-map__paths"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {NODES.map((node, index) => {
                if (index === 0) return null

                const parent = NODES[index - 1]

                return (
                  <line
                    key={node.id}
                    x1={parent.x}
                    y1={parent.y}
                    x2={node.x}
                    y2={node.y}
                    className="hero-tree-map__line"
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
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                onClick={() => setActive(node.id)}
              >
                <span className="hero-tree-node__hebrew">
                  {node.hebrew}
                </span>

                <span className="hero-tree-node__name">
                  {node.name}
                </span>
              </button>
            ))}

          </div>
        </div>

      </div>
    </section>
  )
}
