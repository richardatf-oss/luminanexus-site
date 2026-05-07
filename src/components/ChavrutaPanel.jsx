import { useEffect, useState } from 'react'

const MODES = [
  { value: 'study', label: 'Study' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'hebrew', label: 'Hebrew Word' },
  { value: 'library', label: 'Library Path' },
  { value: 'ivritcode', label: 'IvritCode' },
]

const SUGGESTIONS = [
  'What does Tiferet mean in relation to beauty and balance?',
  'Explain the root אהב through its letters and Torah sources.',
  'How does Chesed relate to Tiferet?',
  'What is the spiritual meaning of Aleph?',
]

export default function ChavrutaPanel() {
  const [question, setQuestion] = useState('')
  const [mode, setMode] = useState('study')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    function receivePrompt() {
      const stored = window.localStorage.getItem('luminanexus_chavruta_prompt')

      if (stored) {
        setQuestion(stored)
        setMode('study')
        setResult(null)
        setError('')
        window.localStorage.removeItem('luminanexus_chavruta_prompt')
      }
    }

    receivePrompt()
    window.addEventListener('luminanexus-chavruta-prompt', receivePrompt)

    return () => {
      window.removeEventListener('luminanexus-chavruta-prompt', receivePrompt)
    }
  }, [])

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
      setHistory((previous) => [
        ...previous,
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

  function useSuggestion(text) {
    setQuestion(text)
    setError('')
    setResult(null)
  }

  function clearQuestion() {
    setQuestion('')
    setError('')
  }

  function clearStudyPath() {
    setHistory([])
    setResult(null)
    setError('')
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
            Press Enter to send. Press Shift + Enter for a new line.
          </p>
        </div>

        <div className="chavruta-suggestions">
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              className="chavruta-chip"
              onClick={() => useSuggestion(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <form className="chavruta-form" onSubmit={handleSubmit}>
          <div className="chavruta-field">
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
          </div>

          <div className="chavruta-field">
            <label className="chavruta-form__label" htmlFor="question">
              Your question
            </label>

            <textarea
              id="question"
              className="chavruta-form__textarea"
              rows="7"
              placeholder="Ask your question, then press Enter..."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
            />

            <div className="chavruta-form__meta">
              <span>{question.length} characters</span>
              {question ? (
                <button type="button" onClick={clearQuestion}>
                  Clear question
                </button>
              ) : null}
            </div>
          </div>

          <div className="chavruta-form__actions">
            <button
              className="button button--primary"
              type="submit"
              disabled={loading || !question.trim()}
            >
              {loading ? 'Studying…' : 'Ask ChavrutaGPT'}
            </button>

            {history.length > 0 ? (
              <button
                className="button button--secondary"
                type="button"
                onClick={clearStudyPath}
              >
                Clear Study Path
              </button>
            ) : null}
          </div>
        </form>

        {error ? (
          <div className="chavruta-response chavruta-response--error">
            <p>{error}</p>
          </div>
        ) : null}

        {result ? (
          <div className="chavruta-response">
            <p className="chavruta-response__label">Response</p>
            <p className="chavruta-response__text">{result.response}</p>
          </div>
        ) : null}

        {history.length > 0 ? (
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
        ) : null}
      </div>
    </section>
  )
}
