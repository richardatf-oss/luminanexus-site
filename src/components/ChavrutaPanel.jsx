import { useState } from 'react'

export default function ChavrutaPanel() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!question.trim()) {
      setError('Please enter a question.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/.netlify/functions/chavruta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      const text = await res.text()

      if (!res.headers.get('content-type').includes('application/json')) {
        throw new Error('Expected JSON but received: ' + text.slice(0, 200))
      }

      const data = JSON.parse(text)

      if (!res.ok) {
        throw new Error(data.error || 'Error')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="chavruta" className="section-shell">
      <div className="section-card chavruta-panel">

        <form onSubmit={handleSubmit}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question..."
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Studying...' : 'Ask ChavrutaGPT'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="response">

            <h3>Response</h3>
            <p>{result.response}</p>

            {result.relatedPaths?.length > 0 && (
              <>
                <h4>Related Paths</h4>
                <ul>
                  {result.relatedPaths.map((p, i) => (
                    <li key={i}>
                      <a href={p.href}>{p.label}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.sources?.length > 0 && (
              <>
                <h4>Sources from the Library</h4>
                <ul>
                  {result.sources.map((s, i) => (
                    <li key={i}>
                      <a href={s.href}>{s.label}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.nextStep && (
              <>
                <h4>Next Step</h4>
                <p>{result.nextStep}</p>
              </>
            )}

          </div>
        )}

      </div>
    </section>
  )
}
