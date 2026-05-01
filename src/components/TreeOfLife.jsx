import { useState } from 'react'

const NODES = [
  { id: 'keter', name: 'Keter', hebrew: 'כתר', meaning: 'Crown', x: 50, y: 5 },
  { id: 'chokhmah', name: 'Chokhmah', hebrew: 'חכמה', meaning: 'Wisdom', x: 27, y: 21 },
  { id: 'binah', name: 'Binah', hebrew: 'בינה', meaning: 'Understanding', x: 73, y: 21 },
  { id: 'chesed', name: 'Chesed', hebrew: 'חסד', meaning: 'Mercy', x: 22, y: 40 },
  { id: 'gevurah', name: 'Gevurah', hebrew: 'גבורה', meaning: 'Strength', x: 78, y: 40 },
  { id: 'tiferet', name: 'Tiferet', hebrew: 'תפארת', meaning: 'Beauty', x: 50, y: 49 },
  { id: 'netzach', name: 'Netzach', hebrew: 'נצח', meaning: 'Endurance', x: 28, y: 67 },
  { id: 'hod', name: 'Hod', hebrew: 'הוד', meaning: 'Splendor', x: 72, y: 67 },
  { id: 'yesod', name: 'Yesod', hebrew: 'יסוד', meaning: 'Foundation', x: 50, y: 81 },
  { id: 'malkhut', name: 'Malkhut', hebrew: 'מלכות', meaning: 'Kingdom', x: 50, y: 95 },
]

const PATHS = [
  ['keter', 'chokhmah'], ['keter', 'binah'], ['chokhmah', 'binah'],
  ['chokhmah', 'chesed'], ['binah', 'gevurah'],
  ['chokhmah', 'tiferet'], ['binah', 'tiferet'],
  ['chesed', 'gevurah'], ['chesed', 'tiferet'], ['gevurah', 'tiferet'],
  ['chesed', 'netzach'], ['gevurah', 'hod'],
  ['tiferet', 'netzach'], ['tiferet', 'hod'], ['tiferet', 'yesod'],
  ['netzach', 'hod'], ['netzach', 'yesod'], ['hod', 'yesod'],
  ['yesod', 'malkhut'],
]

const DETAILS = {
  keter: 'The hidden crown: source, will, and the silence before form.',
  chokhmah: 'The flash of wisdom: the first spark before structure.',
  binah: 'The palace of understanding: where wisdom becomes formed and held.',
  chesed: 'The open hand of mercy: love, expansion, and generous flow.',
  gevurah: 'The sacred boundary: strength, discipline, and holy restraint.',
  tiferet: 'The radiant heart: beauty born from the harmony of mercy and strength.',
  netzach: 'Endurance and victory: the persistence that carries vision forward.',
  hod: 'Splendor and language: pattern, resonance, humility, and form.',
  yesod: 'Foundation and connection: the bridge where insight becomes transmission.',
  malkhut: 'Kingdom and presence: manifestation, embodiment, and the world made luminous.',
}

function getNode(id) {
  return NODES.find((node) => node.id === id)
}

export default function TreeOfLife() {
  const [activeId, setActiveId] = useState('tiferet')
  const active = getNode(activeId) || getNode('tiferet')

  return (
    <section id="tree" className="section-shell">
      <div className="section-card tree-gateway">
        <div className="tree-gateway__intro">
          <p className="tree-gateway__eyebrow">The Tree</p>
          <h2 className="tree-gateway__title">The Living Etz Chaim</h2>
          <p className="tree-gateway__text">
            Explore LuminaNexus through the sefirot — a living architecture of
            relationship, balance, descent, and return.
          </p>
        </div>

        <div className="tree-gateway__layout">
          <div className="tree-map">
            <svg className="tree-map__paths" viewBox="0 0 100 100" preserveAspectRatio="none">
              {PATHS.map((pair) => {
                const a = getNode(pair[0])
                const b = getNode(pair[1])
                if (!a || !b) return null

                return (
                  <line
                    key={pair.join('-')}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className="tree-map__line"
                  />
                )
              })}
            </svg>

            {NODES.map((node) => (
              <button
                key={node.id}
                type="button"
                className={node.id === activeId ? 'tree-node tree-node--active' : 'tree-node'}
                style={{ left: node.x + '%', top: node.y + '%' }}
                onClick={() => setActiveId(node.id)}
              >
                <span className="tree-node__hebrew">{node.hebrew}</span>
                <span className="tree-node__name">{node.name}</span>
              </button>
            ))}
          </div>

          <div className="tree-detail">
            <p className="tree-detail__eyebrow">{active.hebrew}</p>
            <h3 className="tree-detail__title">
              {active.name} — {active.meaning}
            </h3>
            <p className="tree-detail__text">{DETAILS[active.id]}</p>

            <div className="tree-detail__actions">
              <a className="button button--primary" href={'#library-' + active.id}>
                Open in Library
              </a>
              <a className="button button--secondary" href="#chavruta">
                Ask Chavruta
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
