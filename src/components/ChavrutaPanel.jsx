import { useState } from 'react'

export default function ChavrutaPanel() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const askChavruta = async () => {
    if (!question.trim()) return

    setLoading(true)
    setResponse('')

    try {
      const res = await fetch('/.netlify/functions/chavruta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
      })

      const data = await res.json()

      const newEntry = {
        question,
        answer: data.answer || 'No response',
      }

      setHistory((prev) => [...prev, newEntry])
      setResponse(data.answer)
      setQuestion('')
    } catch (err) {
      setResponse('Error connecting to Chavruta.')
    }

    setLoading(false)
  }

  // ⌨️ ENTER KEY HANDLER
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      askChavruta()
    }
  }

  return (
    <section id="chavruta" className="section-shell">
      <div className="section-card chavruta">

        <h2>Chavruta</h2>

        <textarea
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chavruta-input"
        />

        <button onClick={askChavruta} className="button button--primary">
          Ask Chavruta
        </button>

        {loading && <p className="chavruta-loading">Thinking...</p>}

        {response && (
          <div className="chavruta-response">
            <h3>Response</h3>
            <p>{response}</p>
          </div>
        )}

        {/* 🧠 MEMORY */}
        {history.length > 0 && (
          <div className="chavruta-history">
            <h3>Study Path</h3>
            {history.map((item, i) => (
              <div key={i} className="chavruta-history-item">
                <p className="q">Q: {item.question}</p>
                <p className="a">A: {item.answer}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
