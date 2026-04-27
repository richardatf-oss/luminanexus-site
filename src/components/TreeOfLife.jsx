import { useState } from 'react'

const SEFIROT = [
  {
    id: 'keter',
    name: 'Keter',
    hebrew: 'כתר',
    meaning: 'Crown',
    path: '#library-keter',
    x: 50,
    y: 6,
    text: 'The hidden beginning above articulation — source, orientation, and the still crown of the Tree.',
  },
  {
    id: 'chokhmah',
    name: 'Chokhmah',
    hebrew: 'חכמה',
    meaning: 'Wisdom',
    path: '#library',
    x: 28,
    y: 20,
    text: 'The flash of insight before it is fully formed — bright, sudden, and generative.',
  },
  {
    id: 'binah',
    name: 'Binah',
    hebrew: 'בינה',
    meaning: 'Understanding',
    path: '#library',
    x: 72,
    y: 20,
    text: 'The chamber of formation — where insight becomes structure, discernment, and depth.',
  },
  {
    id: 'chesed',
    name: 'Chesed',
    hebrew: 'חסד',
    meaning: 'Mercy',
    path: '#library-chesed',
    x: 22,
    y: 38,
    text: 'Expansive kindness and generous outpouring — the open hand of the Tree.',
  },
  {
    id: 'gevurah',
    name: 'Gevurah',
    hebrew: 'גבורה',
    meaning: 'Strength',
    path: '#library-gevurah',
    x: 78,
    y: 38,
    text: 'Restraint, boundary, and strength — the sacred contour that gives mercy its form.',
  },
  {
    id: 'tiferet',
    name: 'Tiferet',
    hebrew: 'תפארת',
    meaning: 'Beauty',
    path: '#library-tiferet',
    x: 50,
    y: 45,
    text: 'The radiant heart of balance — beauty born from right relation between Chesed and Gevurah.',
  },
  {
    id: 'netzach',
    name: 'Netzach',
    hebrew: 'נצח',
    meaning: 'Endurance',
    path: '#library',
    x: 28,
    y: 64,
    text: 'Endurance, victory, and creative persistence — the force that carries vision forward.',
  },
  {
    id: 'hod',
    name: 'Hod',
    hebrew: 'הוד',
    meaning: 'Splendor',
    path: '#library-hebrew-letters',
    x: 72,
    y: 64,
    text: 'Language, form, resonance, and splendor — where expression becomes patterned and luminous.',
  },
  {
    id: 'yesod',
    name: 'Yesod',
    hebrew: 'יסוד',
    meaning: 'Foundation',
    path: '#library-yesod',
    x: 50,
    y: 78,
    text: 'Foundation and transmission — the bridge of connection, dialogue, and living exchange.',
  },
  {
    id: 'malkhut',
    name: 'Malkhut',
    hebrew: 'מלכות',
    meaning: 'Kingdom',
    path: '#library-malkhut',
    x: 50,
    y: 94,
    text: 'Manifestation and presence — where the hidden architecture becomes visible in the world.',
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

function getNode(id) {
  return SEFIROT.find(function (node) {
    return node.id === id
  })
}

export default function TreeOfLife() {
  const [activeId, setActiveId] = useState('tiferet')

  const active = getNode(activeId) || SEFIROT[5]

  return (
    <section id="tree" className="section-shell">
      <div className="section-card tree-gateway">
        <div className="tree-gateway__intro">
          <p className="tree-gateway__eyebrow">The Tree</p>
          <h2 className="tree-gateway__title">The Living Tree Gateway</h2>
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
                const first = getNode(pair[0])
                const second = getNode(pair[1])

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
              const isActive = node.id === activeId

              return (
                <button
                  key={node.id}
                  type="button"
                  className={
                    isActive
                      ? 'tree-node tree-node--active'
                      : 'tree-node'
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
            <p className="tree-detail__text">{active.text}</p>

            <div className="tree-detail__actions">
              <a className="button button--primary" href={active.path}>
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
