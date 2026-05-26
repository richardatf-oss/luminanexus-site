import { useState } from 'react'

function normalizeText(value) {
  if (Array.isArray(value)) return value.join(' ')
  return value || ''
}

export default function SefariaStudy() {
  const [ref, setRef] = useState('Genesis 22:2')
  const [source, setSource] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadSource() {
    if (!ref.trim()) return

    setLoading(true)
    setError('')
    setSource(null)

    try {
      const response = await fetch(
        `/.netlify/functions/sefaria?ref=${encodeURIComponent(ref.trim())}`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load Sefaria source.')
      }

      setSource(data)
    } catch (err) {
      setError(err.message || 'Unexpected Sefaria error.')
    } finally {
      setLoading(false)
    }
  }

  function askChavruta() {
    const prompt = `Please help me study ${source.ref}. Hebrew: ${normalizeText(
      source.he
    )} English: ${normalizeText(source.en)}`

    const event = new CustomEvent('luminanexus:ask-chavruta', {
      detail: { prompt },
    })

    window.dispatchEvent(event)
    window.location.hash = 'chavruta'
  }

  return (
    <section id="sefaria-study" className="section-shell">
      <div className="section-card content-block">
        <p className="content-block__eyebrow">Sefaria Study</p>

        <h2 className="content-block__title">
          Open a living source
        </h2>

        <p className="content-block__text">
          Bring Torah text into LuminaNexus, then carry it directly into
          Chavruta for guided study.
        </p>

        <div className="sefaria-search">
          <input
            className="sefaria-search__input"
            value={ref}
            onChange={(event) => setRef(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') loadSource()
            }}
            placeholder="Genesis 1:1, Exodus 3:14, Deuteronomy 6:5..."
          />

          <button
            className="button-primary"
            type="button"
            onClick={loadSource}
            disabled={loading}
          >
            {loading ? 'Opening...' : 'Open Source'}
          </button>
        </div>

        {error && (
          <div className="sefaria-error">
            {error}
          </div>
        )}

        {source && (
          <div className="sefaria-source">
            <div className="sefaria-source__header">
              <h3>{source.ref}</h3>

              <a href={source.url} target="_blank" rel="noreferrer">
                Open in Sefaria
              </a>
            </div>

            {source.he && (
              <div className="sefaria-source__he">
                {normalizeText(source.he)}
              </div>
            )}

            {source.en && (
              <p className="sefaria-source__en">
                {normalizeText(source.en)}
              </p>
            )}

            <div className="sefaria-source__actions">
              <button
                className="button-primary"
                type="button"
                onClick={askChavruta}
              >
                Ask Chavruta About This Source
              </button>

              <a className="button-secondary" href="#roots-letters">
                Explore Roots & Letters
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
