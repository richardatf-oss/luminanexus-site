import { useEffect, useMemo, useState } from "react";

const blankProfile = {
  displayName: "",
  gradeBand: "Unknown",
  track: "Aleph",
  currentSkill: "Finding Hebrew starting point",
};

function ChavrutaClassroom() {
  const [profile, setProfile] = useState(blankProfile);
  const [savedProfile, setSavedProfile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const hasProfile = useMemo(() => {
    return savedProfile && savedProfile.displayName;
  }, [savedProfile]);

  useEffect(() => {
    const stored = window.localStorage.getItem("chavrutaStudentProfile");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile({ ...blankProfile, ...parsed });
        setSavedProfile({ ...blankProfile, ...parsed });
      } catch {
        window.localStorage.removeItem("chavrutaStudentProfile");
      }
    }
  }, []);

  function saveProfile(event) {
    event.preventDefault();

    const cleanProfile = {
      displayName: profile.displayName.trim() || "Student",
      gradeBand: profile.gradeBand,
      track: profile.track,
      currentSkill:
        profile.currentSkill.trim() || "Finding Hebrew starting point",
    };

    window.localStorage.setItem(
      "chavrutaStudentProfile",
      JSON.stringify(cleanProfile)
    );

    setProfile(cleanProfile);
    setSavedProfile(cleanProfile);
    setStatus("Profile saved on this device.");
    setError("");
  }

  function clearProfile() {
    window.localStorage.removeItem("chavrutaStudentProfile");
    setProfile(blankProfile);
    setSavedProfile(null);
    setStatus("Profile cleared from this device.");
    setAnswer("");
    setNextStep("");
    setError("");
  }

  function handleQuestionKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!loading) {
        askChavruta(event);
      }
    }
  }

  async function askChavruta(event) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Ask Chavruta a question first.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");
    setAnswer("");
    setNextStep("");

    const activeProfile = savedProfile || profile;

    const profileContext = [
      "Student profile for this Chavruta session:",
      "Name or nickname: " + (activeProfile.displayName || "Student"),
      "Grade band: " + activeProfile.gradeBand,
      "Current track: " + activeProfile.track,
      "Current skill: " + activeProfile.currentSkill,
      "",
      "Student question:",
      question,
      "",
      "Answer as Chavruta Classroom for LuminaNexus Foundation.",
      "Keep the answer age-aware, encouraging, and focused on Hebrew learning.",
      "Use Aleph, Bet, and Gimel Tracks when helpful.",
      "Do not make the student feel behind.",
    ].join("\n");

   try {
  const response = await fetch("/.netlify/functions/chavruta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: profileContext,
      mode: "hebrew-classroom",
    }),
  });

  const text = await response.text();

  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = {
      error: text || "The server returned an unreadable response.",
    };
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}.`);
  }

  const answerText = data.answer || data.response;

  if (!answerText) {
    throw new Error("Chavruta answered, but no answer text came back.");
  }

  setAnswer(answerText);
  setNextStep(data.nextStep || "");
} catch (err) {
  setError(err.message || "Chavruta could not answer.");
} finally {
  setLoading(false);
}
      const data = await response.json();

      if (!response.ok) {
       {error && <p className="error">{error}</p>}
      }

      setAnswer(data.response || "");
      setNextStep(data.nextStep || "");
    } catch (err) {
      setError(err.message || "Chavruta could not answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="chavruta" className="section chavruta-section">
      <div className="section-heading">
        <p className="eyebrow">Chavruta Classroom</p>

        <h2>A Hebrew guide for every student’s beginning.</h2>

        <p className="section-intro">
          Create a simple student profile, choose a starting track, and ask
          Chavruta for Hebrew help, letter practice, catch-up guidance, or
          one-hour lesson support.
        </p>
      </div>

      <div className="two-column">
        <form className="feature-card" onSubmit={saveProfile}>
          <h3>Student Profile</h3>

          <label className="field-label" htmlFor="student-name">
            Name or nickname
          </label>

          <input
            id="student-name"
            className="field-input"
            type="text"
            value={profile.displayName}
            onChange={(event) =>
              setProfile({
                ...profile,
                displayName: event.target.value,
              })
            }
            placeholder="Example: Elijah"
          />

          <label className="field-label" htmlFor="grade-band">
            Grade band
          </label>

          <select
            id="grade-band"
            className="field-input"
            value={profile.gradeBand}
            onChange={(event) =>
              setProfile({
                ...profile,
                gradeBand: event.target.value,
              })
            }
          >
            <option>K-2</option>
            <option>3-5</option>
            <option>6-8</option>
            <option>9-12</option>
            <option>Mixed</option>
            <option>Unknown</option>
          </select>

          <label className="field-label" htmlFor="track">
            Starting track
          </label>

          <select
            id="track"
            className="field-input"
            value={profile.track}
            onChange={(event) =>
              setProfile({
                ...profile,
                track: event.target.value,
              })
            }
          >
            <option>Aleph</option>
            <option>Bet</option>
            <option>Gimel</option>
            <option>Review</option>
            <option>Unknown</option>
          </select>

          <label className="field-label" htmlFor="current-skill">
            Current skill
          </label>

          <input
            id="current-skill"
            className="field-input"
            type="text"
            value={profile.currentSkill}
            onChange={(event) =>
              setProfile({
                ...profile,
                currentSkill: event.target.value,
              })
            }
            placeholder="Example: Recognizes Aleph"
          />

          <div className="hero-actions">
            <button className="button primary" type="submit">
              Save My Profile
            </button>

            {hasProfile && (
              <button
                className="button secondary"
                type="button"
                onClick={clearProfile}
              >
                Clear Profile
              </button>
            )}
          </div>

          <p className="small-note">
           Use a first name or nickname only. Your profile is saved on this device and is used to personalize Chavruta’s answer when you ask a question.
          </p>

          {hasProfile && (
            <div className="student-summary">
              <p>
                <strong>Current profile:</strong> {savedProfile.displayName}
              </p>
              <p>
                <strong>Track:</strong> {savedProfile.track}
              </p>
              <p>
                <strong>Skill:</strong> {savedProfile.currentSkill}
              </p>
            </div>
          )}
        </form>

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
              onKeyDown={handleQuestionKeyDown}
              placeholder="Example: Help me practice the fifth Hebrew letter."
            />

            <p className="small-note">
              Press Enter to ask. Press Shift + Enter for a new line.
            </p>

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

          {status && <p className="status-message">{status}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </section>
  );
}

export default ChavrutaClassroom;
