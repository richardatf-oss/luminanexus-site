import { useState } from 'react'

const SEFIROT = [
  {
    id: 'keter',
    name: 'Keter',
    hebrew: 'כתר',
    meaning: 'Crown',
    x: 50,
    y: 6,
  },
  {
    id: 'chokhmah',
    name: 'Chokhmah',
    hebrew: 'חכמה',
    meaning: 'Wisdom',
    x: 28,
    y: 20,
  },
  {
    id: 'binah',
    name: 'Binah',
    hebrew: 'בינה',
    meaning: 'Understanding',
    x: 72,
    y: 20,
  },
  {
    id: 'chesed',
    name: 'Chesed',
    hebrew: 'חסד',
    meaning: 'Mercy',
    x: 22,
    y: 38,
  },
  {
    id: 'gevurah',
    name: 'Gevurah',
    hebrew: 'גבורה',
    meaning: 'Strength',
    x: 78,
    y: 38,
  },
  {
    id: 'tiferet',
    name: 'Tiferet',
    hebrew: 'תפארת',
    meaning: 'Beauty',
    x: 50,
    y: 45,
  },
  {
    id: 'netzach',
    name: 'Netzach',
    hebrew: 'נצח',
    meaning: 'Endurance',
    x: 28,
    y: 64,
  },
  {
    id: 'hod',
    name: 'Hod',
    hebrew: 'הוד',
    meaning: 'Splendor',
    x: 72,
    y: 64,
  },
  {
    id: 'yesod',
    name: 'Yesod',
    hebrew: 'יסוד',
    meaning: 'Foundation',
    x: 50,
    y: 78,
  },
  {
    id: 'malkhut',
    name: 'Malkhut',
    hebrew: 'מלכות',
    meaning: 'Kingdom',
    x: 50,
    y: 94,
  },
]

const PATHS = [
  ['keter', 'chokhmah'],
  ['keter', 'binah'],
  ['chokhmah', 'tiferet'],
  ['binah', 'tiferet'],
  ['chesed', 'tiferet'],
  ['gevurah', 'tiferet'],
  ['tiferet', 'netzach'],
  ['tiferet', 'hod'],
  ['netzach', 'yesod'],
  ['hod', 'yesod'],
  ['yesod', 'malkhut'],
]

const DETAILS = {
  keter:
    'The hidden beginning above articulation — source, orientation, and the still crown of the Tree.',
  chokhmah:
    'The flash of insight before it is fully formed — bright, sudden, and generative.',
  binah:
    'The chamber of formation — where insight becomes structure, discernment, and depth.',
  chesed:
    'Expansive kindness and generous outpouring — the open hand of the Tree.',
  gevurah:
    'Restraint, boundary, and strength — the sacred contour that gives mercy its form.',
  tiferet:
    'The radiant heart of balance — beauty born from right relation between Chesed and Gevurah.',
  netzach:
    'Endurance, victory, and creative persistence — the force that carries vision forward.',
  hod:
    'Language, form, resonance, and splendor — where expression becomes patterned and luminous.',
  yesod:
    'Foundation and transmission — the bridge of connection, dialogue, and living exchange.',
  malkhut:
    'Manifestation and presence — where the hidden architecture becomes visible in the world.',
}

function getNode(id) {
  return SEFIROT.find(function (node) {
    return node.id === id
  })
}

export default function TreeOfLife() {
  const [activeId, setActiveId] = useState('tiferet')
  const active = getNode(activeId) || getNode('tiferet')

  return (
    <section id="tree" className="section-shell">
      <div className="section-card tree-gateway">
        <div className="tree-gateway__intro">
          <p className="tree-gateway__eyebrow">The Tree</p>
          <h2 className="tree-gateway__title">The Living Tree</h2>
          <p className="tree-gateway__text">
            Explore LuminaNexus through the sefirot — not as a flat menu, but as
            a living architecture of relationship, balance, study, and return.
          </p>
        </div>

        <div className="tree-gateway__layout">
          <div className="tree-map" aria-label="Interactive Tree of Life map">
            <svg
              className="tree-map__paths"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {PATHS.map(function (pair) {
                var first = getNode(pair[0])
                var second = getNode(pair[1])

                if (!first || !second) return null

                return (
                  <line
                    key={pair.join('-')}
                    x1={first.x}
                    y1={first.y}
                    x2={second.x}
                    y2={second.y}
                    className="tree-map__line"
                  />
                )
              })}
            </svg>

            {SEFIROT.map(function (node) {
              var isActive = node.id === activeId

              return (
                <button
                  key={node.id}
                  type="button"
                  className={
                    isActive ? 'tree-node tree-node--active' : 'tree-node'
                  }
                  style={{
                    left: node.x + '%',
                    top: node.y + '%',
                  }}
                  onClick={function () {
                    setActiveId(node.id)
                  }}
                >
                  <span className="tree-node__hebrew">{node.hebrew}</span>
                  <span className="tree-node__name">{node.name}</span>
                </button>
              )
            })}
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
