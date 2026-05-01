import { useState } from 'react'
import { roots, letters } from '../data/rootsLettersData'

function makeSefariaUrl(ref) {
  return 'https://www.sefaria.org/' + encodeURIComponent(ref).replaceAll('%20', '.')
}

export default function RootsLetters() {
  const [mode, setMode] = useState('roots')
  const [query, setQuery] = useState('')
  const [activeRoot, setActiveRoot] = useState(roots[0])
  const [activeLetter, setActiveLetter] = useState(letters[0])

  const q = query.trim().toLowerCase()

  const filteredRoots = roots.filter((item) => {
    return (
      item.root.includes(query.trim()) ||
      item.transliteration.toLowerCase().includes(q) ||
      item.meaning.toLowerCase().includes(q) ||
      item.sefirot.join(' ').toLowerCase().includes(q)
    )
  })

  const filteredLetters = letters.filter((item) => {
    return (
      item.letter.includes(query.trim()) ||
      item.name.toLowerCase().includes(q) ||
      item.themes.join(' ').toLowerCase().includes(q) ||
      item.roots.join(' ').includes(query.trim())
    )
  })

  return (
    <section id="roots-letters" className="section-shell">
      <div className="section-card roots-module">
        <div className="roots-module__intro">
          <p className="roots-module__eyebrow">Roots & Letters</p>
          <h2 className="roots-module__title">
            Hebrew itself becomes the interface.
          </h2>
          <p className="roots-module__text">
            Explore Torah through roots, letters, sefirot, and linked sources —
            a prototype module designed to show how textual study can move
            through Hebrew structure, not only references.
          </p>
        </div>

        <div className="roots-module__controls">
          <div className="roots-module__tabs">
            <button
              type="button"
              className={mode === 'roots' ? 'roots-tab roots-tab--active' : 'roots-tab'}
              onClick={() => setMode('roots')}
            >
              Roots
            </button>
            <button
              type="button"
              className={mode === 'letters' ? 'roots-tab roots-tab--active' : 'roots-tab'}
              onClick={() => setMode('letters')}
            >
              Letters
            </button>
          </div>

          <input
            className="roots-module__search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search חסד, אמת, Aleph, truth, light..."
          />
        </div>

        {mode === 'roots' ? (
          <div className="roots-module__layout">
            <div className="roots-list">
              {filteredRoots.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={
                    activeRoot.id === item.id
                      ? 'roots-list__item roots-list__item--active'
                      : 'roots-list__item'
                  }
                  onClick={() => setActiveRoot(item)}
                >
                  <span className="roots-list__hebrew">{item.root}</span>
                  <span className="roots-list__meaning">{item.meaning}</span>
                </button>
              ))}
            </div>

            <article className="roots-detail">
              <p className="roots-detail__hebrew">{activeRoot.root}</p>
              <h3 className="roots-detail__title">{activeRoot.transliteration}</h3>
              <p className="roots-detail__meaning">{activeRoot.meaning}</p>

              <div className="roots-detail__letters">
                {activeRoot.letters.map((letter) => (
                  <span key={letter}>{letter}</span>
                ))}
              </div>

              <p className="roots-detail__note">{activeRoot.note}</p>

              <div className="roots-detail__meta">
                <div>
                  <p className="roots-detail__label">Sefirot</p>
                  <p>{activeRoot.sefirot.join(' · ')}</p>
                </div>

                <div>
                  <p className="roots-detail__label">Sefaria Links</p>
                  <ul>
                    {activeRoot.refs.map((ref) => (
                      <li key={ref}>
                        <a href={makeSefariaUrl(ref)} target="_blank" rel="noreferrer">
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className="roots-module__layout">
            <div className="roots-list">
              {filteredLetters.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={
                    activeLetter.id === item.id
                      ? 'roots-list__item roots-list__item--active'
                      : 'roots-list__item'
                  }
                  onClick={() => setActiveLetter(item)}
                >
                  <span className="roots-list__hebrew">{item.letter}</span>
                  <span className="roots-list__meaning">
                    {item.name} · {item.value}
                  </span>
                </button>
              ))}
            </div>

            <article className="roots-detail">
              <p className="roots-detail__hebrew">{activeLetter.letter}</p>
              <h3 className="roots-detail__title">
                {activeLetter.name} · {activeLetter.value}
              </h3>

              <p className="roots-detail__note">{activeLetter.note}</p>

              <div className="roots-detail__meta">
                <div>
                  <p className="roots-detail__label">Themes</p>
                  <p>{activeLetter.themes.join(' · ')}</p>
                </div>

                <div>
                  <p className="roots-detail__label">Roots containing this letter</p>
                  <p>{activeLetter.roots.join(' · ')}</p>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  )
}
