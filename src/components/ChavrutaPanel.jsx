import { useState } from 'react'

const MODES = [
  { value: 'study', label: 'Study' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'hebrew', label: 'Hebrew Word' },
  { value: 'library', label: 'Library Path' },
  { value: 'ivritcode', label: 'IvritCode' },
]

export default function ChavrutaPanel() {
  const [question, setQuestion] = useState('')
  const [mode, setMode] = useState('study')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  async function handleSubmit(event) {
    if (event) event.preventDefault()

    const trimmed = question.trim()
    if (!trimmed || loading) return

    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch('/.netlify/functions/chavruta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, mode, history }),
      })

      const text = await response.text()
      const contentType = response.headers.get('content-type') || ''

      if (!contentType.includes('application/json')) {
        throw new Error('Expected JSON but received: ' + text.slice(0, 200))
      }

      const data = JSON.parse(text)

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setResult(data)
      setHistory((prev) => [
        ...prev,
        { question: trimmed, response: data.response || '' },
      ])
      setQuestion('')
    } catch (err) {
      setError(err.message || 'Unable to reach ChavrutaGPT right now.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section id="chavruta" className="section-shell">
      <div className="section-card chavruta-panel">
        <div className="chavruta-panel__intro">
          <p className="chavruta-panel__eyebrow">Chavruta</p>
          <h2 className="chavruta-panel__title">
            Bring your question beneath the Tree.
          </h2>
          <p className="chavruta-panel__text">
            ChavrutaGPT is a guided study companion for LuminaNexus — built to
            help you reflect, explore, and follow living pathways through the sanctuary.
          </p>
        </div>

        <form className="chavruta-form" onSubmit={handleSubmit}>
          <label className="chavruta-form__label" htmlFor="mode">
            Study mode
          </label>

          <select
            id="mode"
            className="chavruta-form__select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {MODES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label className="chavruta-form__label" htmlFor="question">
            Your question
          </label>

          <textarea
            id="question"
            className="chavruta-form__textarea"
            rows="6"
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button className="button button--primary" type="submit" disabled={loading}>
            {loading ? 'Studying...' : 'Ask ChavrutaGPT'}
          </button>
        </form>

        {error && (
          <div className="chavruta-response chavruta-response--error">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="chavruta-response">
            <p className="chavruta-response__label">Response</p>
            <p className="chavruta-response__text">{result.response}</p>

            {result.relatedPaths?.length ? (
              <>
                <p className="chavruta-response__label">Related Paths</p>
                <ul className="chavruta-response__list">
                  {result.relatedPaths.map((item, index) => (
                    <li key={index}>
                      <a className="chavruta-response__link" href={item.href}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {result.sources?.length ? (
              <>
                <p className="chavruta-response__label">Sources from the Library</p>
                <ul className="chavruta-response__list">
                  {result.sources.map((item, index) => (
                    <li key={index}>
                      <a className="chavruta-response__link" href={item.href}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {result.nextStep && (
              <>
                <p className="chavruta-response__label">Suggested Next Step</p>
                <p className="chavruta-response__text">{result.nextStep}</p>
              </>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="chavruta-response">
            <p className="chavruta-response__label">Study Path</p>
            <ul className="chavruta-response__list">
              {history.map((item, index) => (
                <li key={index}>
                  <strong>Q:</strong> {item.question}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
