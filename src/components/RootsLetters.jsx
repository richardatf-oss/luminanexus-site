import { useEffect, useMemo, useState } from 'react'
import { roots, letters } from '../data/rootsLettersData'

function getLetterInfo(letter) {
  return letters.find((item) => item.letter === letter)
}

function stripNiqqud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '')
}

function highlightRoot(text, root) {
  if (!text || !root) return text

  const cleanRoot = stripNiqqud(root)

  return text
    .split(/(\s+)/)
    .map((part) => {
      const clean = stripNiqqud(part)
      if (clean.includes(cleanRoot)) {
        return `<span class="root-highlight">${part}</span>`
      }
      return part
    })
    .join('')
}

function makeChavrutaPrompt(root) {
  return `Please study the Hebrew root ${root.root} (${root.transliteration}) with me. Explain its letters, meaning, sefirot connection (${root.sefirot.join(
    ', '
  )}), and how it appears in these sources: ${root.refs.join(', ')}.`
}

export default function RootsLetters() {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(roots[0].id)
  const [texts, setTexts] = useState({})
  const [loadingTexts, setLoadingTexts] = useState(false)

  const filteredRoots = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return roots

    return roots.filter((root) => {
      return (
        root.root.includes(query.trim()) ||
        root.transliteration.toLowerCase().includes(q) ||
        root.meaning.toLowerCase().includes(q) ||
        root.sefirot.join(' ').toLowerCase().includes(q) ||
        root.insight.toLowerCase().includes(q)
      )
    })
  }, [query])

  const activeRoot =
    roots.find((root) => root.id === activeId) || filteredRoots[0] || roots[0]

  useEffect(() => {
    let cancelled = false

    async function loadTexts() {
      setLoadingTexts(true)
      const results = {}

      for (const ref of activeRoot.refs) {
        try {
          const response = await fetch(
            '/.netlify/functions/sefaria?ref=' + encodeURIComponent(ref)
          )
          const data = await response.json()

          if (!cancelled) results[ref] = data
        } catch {
          if (!cancelled) {
            results[ref] = { error: 'Could not load this source.' }
          }
        }
      }

      if (!cancelled) {
        setTexts(results)
        setLoadingTexts(false)
      }
    }

    loadTexts()

    return () => {
      cancelled = true
    }
  }, [activeRoot])

  function sendToChavruta() {
    const prompt = makeChavrutaPrompt(activeRoot)
    window.localStorage.setItem('luminanexus_chavruta_prompt', prompt)
    window.dispatchEvent(new Event('luminanexus-chavruta-prompt'))
    window.location.hash = 'chavruta'
  }

  return (
    <section id="roots-letters" className="section-shell">
      <div className="section-card roots-explorer">
        <div className="roots-explorer__intro">
          <p className="roots-explorer__eyebrow">Roots & Letters</p>
          <h2 className="roots-explorer__title">
            Hebrew becomes the path of discovery.
          </h2>
          <p className="roots-explorer__text">
            Explore a root through its letters, meaning, sefirot, and live
            Sefaria source previews.
          </p>
        </div>

        <input
          className="roots-explorer__search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search אהב, חסד, אמת, אור, love, truth, light..."
        />

        <div className="roots-explorer__layout">
          <aside className="roots-explorer__rail">
            {filteredRoots.map((root) => (
              <button
                key={root.id}
                type="button"
                className={
                  root.id === activeRoot.id
                    ? 'root-choice root-choice--active'
                    : 'root-choice'
                }
                onClick={() => setActiveId(root.id)}
              >
                <span className="root-choice__hebrew">{root.root}</span>
                <span className="root-choice__name">{root.transliteration}</span>
                <span className="root-choice__meaning">{root.meaning}</span>
              </button>
            ))}
          </aside>

          <article className="root-scroll">
            <div className="root-scroll__header">
              <div>
                <p className="root-scroll__hebrew">{activeRoot.root}</p>
                <h3 className="root-scroll__title">
                  {activeRoot.transliteration}
                </h3>
              </div>

              <div className="root-scroll__sefirot">
                {activeRoot.sefirot.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>

            <p className="root-scroll__meaning">{activeRoot.meaning}</p>

            <div className="letter-breakdown">
              {activeRoot.letters.map((item) => {
                const info = getLetterInfo(item.letter)

                return (
                  <div key={item.letter} className="letter-card">
                    <p className="letter-card__letter">{item.letter}</p>
                    <p className="letter-card__name">{item.name}</p>
                    <p className="letter-card__sense">{item.sense}</p>
                    {info ? (
                      <p className="letter-card__value">
                        Gematria {info.value} · {info.themes.join(' · ')}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>

            <div className="root-insight">
              <p className="root-insight__label">Insight</p>
              <p>{activeRoot.insight}</p>
            </div>

            <div className="root-sources">
              <p className="root-sources__label">Live Sefaria Sources</p>
              {loadingTexts ? <p>Loading source previews…</p> : null}

              <div className="source-preview-list">
                {activeRoot.refs.map((ref) => {
                  const item = texts[ref]

                  return (
                    <div key={ref} className="source-preview">
                      <div className="source-preview__header">
                        <strong>{ref}</strong>
                        {item?.url ? (
                          <a href={item.url} target="_blank" rel="noreferrer">
                            Open in Sefaria
                          </a>
                        ) : null}
                      </div>

                      {item?.error ? (
                        <p>{item.error}</p>
                      ) : (
                        <>
                          {item?.he ? (
                            <p
                              className="source-preview__he"
                              dangerouslySetInnerHTML={{
                                __html: highlightRoot(item.he, activeRoot.root),
                              }}
                            />
                          ) : null}

                          {item?.en ? (
                            <p className="source-preview__en">{item.en}</p>
                          ) : null}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="root-scroll__actions">
              <button
                className="button button--primary"
                type="button"
                onClick={sendToChavruta}
              >
                Ask Chavruta about {activeRoot.root}
              </button>

              <a className="button button--secondary" href="#library">
                Open Library
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
