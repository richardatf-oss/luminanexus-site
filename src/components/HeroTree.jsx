import {import { useState } from 'react'

const NODES = [
  { id: 'keter', hebrew: 'כתר', name: 'Keter', meaning: 'Crown', x: 50, y: 7 },
  { id: 'chokhmah', hebrew: 'חכמה', name: 'Chokhmah', meaning: 'Wisdom', x: 28, y: 24 },
  { id: 'binah', hebrew: 'בינה', name: 'Binah', meaning: 'Understanding', x: 72, y: 24 },
  { id: 'chesed', hebrew: 'חסד', name: 'Chesed', meaning: 'Mercy', x: 22, y: 42 },
  { id: 'gevurah', hebrew: 'גבורה', name: 'Gevurah', meaning: 'Strength', x: 78, y: 42 },
  { id: 'tiferet', hebrew: 'תפארת', name: 'Tiferet', meaning: 'Beauty', x: 50, y: 50 },
  { id: 'netzach', hebrew: 'נצח', name: 'Netzach', meaning: 'Endurance', x: 28, y: 68 },
  { id: 'hod', hebrew: 'הוד', name: 'Hod', meaning: 'Splendor', x: 72, y: 68 },
  { id: 'yesod', hebrew: 'יסוד', name: 'Yesod', meaning: 'Foundation', x: 50, y: 82 },
  { id: 'malkhut', hebrew: 'מלכות', name: 'Malkhut', meaning: 'Kingdom', x: 50, y: 96 },
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

const TEACHINGS = {
  keter: 'The hidden crown: will, silence, and the first breath before form.',
  chokhmah: 'The flash of wisdom: the spark before it becomes language.',
  binah: 'Understanding: the womb of pattern where insight receives shape.',
  chesed: 'Mercy: the open flow of kindness, expansion, and generosity.',
  gevurah: 'Strength: sacred boundary, discipline, and clarifying fire.',
  tiferet: 'Beauty: the radiant heart where mercy and strength become harmony.',
  netzach: 'Endurance: the living persistence that carries vision forward.',
  hod: 'Splendor: humility, resonance, language, and luminous form.',
  yesod: 'Foundation: the bridge where insight becomes transmission.',
  malkhut: 'Kingdom: presence, embodiment, and the world made luminous.',
}

function getNode(id) {
  return NODES.find((node) => node.id === id)
}

export default function HeroTree() {
  const [activeId, setActiveId] = useState('tiferet')
  const active = getNode(activeId)

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
            <a className="button-primary" href="#tree">
              Begin the Path
            </a>

            <a className="button-secondary" href="#chavruta">
              Ask ChavrutaGPT
            </a>
          </div>
        </div>

        <div className="hero-tree__panel">
          <div className="hero-tree__panel-header">
            <p className="hero-tree__label">The Living Tree</p>
            <p className="hero-tree__active">
              {active.name} · {active.hebrew}
            </p>
          </div>

          <div className="hero-tree-map" aria-label="Interactive Tree of Life">
            <svg
              className="hero-tree-map__paths"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
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
                      from === activeId || to === activeId
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
                  node.id === activeId
                    ? 'hero-tree-node hero-tree-node--active'
                    : 'hero-tree-node'
                }
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => setActiveId(node.id)}
                aria-label={`${node.name}: ${node.meaning}`}
              >
                <span className="hero-tree-node__hebrew">{node.hebrew}</span>
                <span className="hero-tree-node__name">{node.name}</span>
              </button>
            ))}
          </div>

          <div className="hero-tree-teaching">
            <p className="hero-tree-teaching__name">{active.name}</p>
            <p className="hero-tree-teaching__text">
              {TEACHINGS[active.id]}
            </p>
          </div>

          <div className="hero-tree__actions">
            <a className="hero-tree__small-link" href="#library">
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
} useState } from 'react'

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
