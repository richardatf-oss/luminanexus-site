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

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    const trimmed = question.trim()

    if (!trimmed) {
      setError('Please enter a question.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/.netlify/functions/chavruta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: trimmed,
          mode,
        }),
      })

      const contentType = response.headers.get('content-type') || ''
      const rawText = await response.text()

      if (!contentType.includes('application/json')) {
        throw new Error(
          `Expected JSON but received: ${rawText.slice(0, 200)}`
        )
      }

      const data = JSON.parse(rawText)

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setResult(data)
    } catch (err) {
      setError(err.message || 'Unable to reach ChavrutaGPT right now.')
    } finally {
      setLoading(false)
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
            help you reflect, explore, and follow living pathways through the
            sanctuary.
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
            onChange={(event) => setMode(event.target.value)}
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
            placeholder="For example: What does Tiferet mean in relation to beauty and balance?"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />

          <div className="chavruta-form__actions">
            <button className="button button--primary" type="submit" disabled={loading}>
              {loading ? 'Studying...' : 'Ask ChavrutaGPT'}
            </button>
          </div>
        </form>

        {error ? (
          <div className="chavruta-response chavruta-response--error">
            <p>{error}</p>
          </div>
        ) : null}

        {result ? (
          <div className="chavruta-response">
            <div className="chavruta-response__block">
              <p className="chavruta-response__label">Response</p>
              <p className="chavruta-response__text">{result.response}</p>
            </div>

            {result.relatedPaths?.length ? (
              <div className="chavruta-response__block">
                <p className="chavruta-response__label">Related Paths</p>
                <ul className="chavruta-response__list">
                  {result.relatedPaths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {result.nextStep ? (
              <div className="chavruta-response__block">
                <p className="chavruta-response__label">Suggested Next Step</p>
                <p className="chavruta-response__text">{result.nextStep}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
