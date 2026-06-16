import { useState } from "react";

function ChavrutaClassroom() {
const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
const [nextStep, setNextStep] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function askChavruta(event) {
event.preventDefault();

```
if (!question.trim()) {
  setError("Ask Chavruta a question first.");
  return;
}

setLoading(true);
setError("");
setAnswer("");
setNextStep("");

try {
  const response = await fetch("/.netlify/functions/chavruta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      mode: "hebrew-classroom",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Chavruta could not answer.");
  }

  setAnswer(data.response || "");
  setNextStep(data.nextStep || "");
} catch (err) {
  setError(err.message || "Chavruta could not answer.");
} finally {
  setLoading(false);
}
```

}

return ( <section id="chavruta" className="section chavruta-section"> <div className="two-column"> <div> <p className="eyebrow">Chavruta Classroom</p>

```
      <h2>A Hebrew guide for every beginning.</h2>

      <p>
        Ask Chavruta for Hebrew letter help, Aleph / Bet / Gimel Track
        guidance, one-hour lesson ideas, catch-up practice, or classroom
        activities.
      </p>

      <p>
        No student is late to Hebrew. Every letter is a beginning.
      </p>
    </div>

    <div className="feature-card chavruta-panel">
      <h3>Ask Chavruta</h3>

      <form onSubmit={askChavruta}>
        <label className="field-label" htmlFor="chavruta-question">
          Question
        </label>

        <textarea
          id="chavruta-question"
          className="field-textarea"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Example: Help me teach Aleph to a mixed-age beginner group."
        />

        <button className="button primary" type="submit" disabled={loading}>
          {loading ? "Asking..." : "Ask Chavruta"}
        </button>
      </form>

      {answer && (
        <div className="chavruta-answer">
          <h4>Chavruta says:</h4>
          <p>{answer}</p>

          {nextStep && (
            <>
              <h4>Next step:</h4>
              <p>{nextStep}</p>
            </>
          )}
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  </div>
</section>
```

);
}

export default ChavrutaClassroom;
