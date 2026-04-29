import { useState } from 'react'

const HERO_NODES = [
  {
    id: 'keter',
    name: 'Keter',
    hebrew: 'כתר',
    x: 50,
    y: 8,
    teaching: 'Crown: the hidden beginning, the silence before form.',
  },
  {
    id: 'chokhmah',
    name: 'Chokhmah',
    hebrew: 'חכמה',
    x: 28,
    y: 24,
    teaching: 'Wisdom: the first flash of insight, bright before it is shaped.',
  },
  {
    id: 'binah',
    name: 'Binah',
    hebrew: 'בינה',
    x: 72,
    y: 24,
    teaching: 'Understanding: the chamber where insight becomes structure.',
  },
  {
    id: 'chesed',
    name: 'Chesed',
    hebrew: 'חסד',
    x: 22,
    y: 42,
    teaching: 'Mercy: the open hand, love flowing outward.',
  },
  {
    id: 'gevurah',
    name: 'Gevurah',
    hebrew: 'גבורה',
    x: 78,
    y: 42,
    teaching: 'Strength: holy boundary, restraint, and sacred form.',
  },
  {
    id: 'tiferet',
    name: 'Tiferet',
    hebrew: 'תפארת',
    x: 50,
    y: 49,
    teaching: 'Beauty: the radiant heart where mercy and strength become harmony.',
  },
  {
    id: 'netzach',
    name: 'Netzach',
    hebrew: 'נצח',
    x: 28,
    y: 68,
    teaching: 'Endurance: the power to continue carrying the vision forward.',
  },
  {
    id: 'hod',
    name: 'Hod',
    hebrew: 'הוד',
    x: 72,
    y: 68,
    teaching: 'Splendor: language, pattern, resonance, and luminous form.',
  },
  {
    id: 'yesod',
    name: 'Yesod',
    hebrew: 'יסוד',
    x: 50,
    y: 82,
    teaching: 'Foundation: the bridge where insight becomes connection.',
  },
  {
    id: 'malkhut',
    name: 'Malkhut',
    hebrew: 'מלכות',
    x: 50,
    y: 96,
    teaching: 'Kingdom: manifestation, presence, and the world made luminous.',
  },
]

const HERO_PATHS = [
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
  return HERO_NODES.find((node) => node.id === id)
}

export default function HeroTree() {
  const [activeId, setActiveId] = useState('tiferet')
  const active = getNode(activeId) || getNode('tiferet')

  return (
    <section id="top" className="hero hero-tree">
      <div className="hero-tree__inner">
        <div className="hero-tree__content">
          <p className="hero__eyebrow">
            Dedicated to sacred study, language, beauty, and light
          </p>

          <h1 className="hero__title">
            Enter a living architecture of study.
          </h1>

          <p className="hero__text">
            LuminaNexus is a quiet digital sanctuary shaped by the Tree of Life —
            a place where Hebrew letters, contemplative learning, sacred art,
            and symbolic design gather into one luminous order.
          </p>

          <div className="hero__actions">
            <a className="button button--primary" href="#tree">
              Begin the Path
            </a>
            <a className="button button--secondary" href="#chavruta">
              Ask ChavrutaGPT
            </a>
          </div>
        </div>

        <div className="hero-tree__panel" aria-label="Living Tree preview">
          <div className="hero-tree__panel-header">
            <p className="hero-tree__label">The Living Tree</p>
            <p className="hero-tree__active">
              {active.name} · {active.hebrew}
            </p>
          </div>

          <div className="hero-tree-map">
            <svg
              className="hero-tree-map__paths"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {HERO_PATHS.map((pair, index) => {
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
                    className="hero-tree-map__line"
                    style={{ animationDelay: `${index * 0.12}s` }}
                  />
                )
              })}
            </svg>

            {HERO_NODES.map((node) => {
              const isActive = node.id === activeId

              return (
                <button
                  key={node.id}
                  type="button"
                  className={
                    isActive
                      ? 'hero-tree-node hero-tree-node--active'
                      : 'hero-tree-node'
                  }
                  style={{
                    left: node.x + '%',
                    top: node.y + '%',
                  }}
                  onClick={() => setActiveId(node.id)}
                  aria-label={node.name}
                >
                  <span className="hero-tree-node__hebrew">{node.hebrew}</span>
                </button>
              )
            })}
          </div>

          <div className="hero-tree-teaching">
            <p className="hero-tree-teaching__name">{active.name}</p>
            <p className="hero-tree-teaching__text">{active.teaching}</p>
          </div>

          <div className="hero-tree__actions">
            <a className="hero-tree__small-link" href={'#library-' + active.id}>
              Open {active.name} in Library
            </a>
            <a className="hero-tree__small-link" href="#tree">
              Explore the full Tree
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
