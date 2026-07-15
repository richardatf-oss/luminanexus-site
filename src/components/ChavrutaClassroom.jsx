import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "chavrutaStudentProfile";

const defaultProfile = {
  displayName: "",
  gradeBand: "K-2",
  track: "Aleph",
  currentSkill: "Finding Hebrew starting point",
};

function ChavrutaClassroom() {
  const [profile, setProfile] = useState(defaultProfile);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = window.localStorage.getItem(STORAGE_KEY);

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);

        setProfile({
          ...defaultProfile,
          ...parsedProfile,
        });
      }
    } catch {
      setProfile(defaultProfile);
    }
  }, []);

  const activeProfile = useMemo(
    () => ({
      displayName: profile.displayName.trim() || "Student",
      gradeBand: profile.gradeBand,
      track: profile.track,
      currentSkill: profile.currentSkill.trim() || "Beginning Hebrew",
    }),
    [profile]
  );

  function updateProfile(field, value) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
  }

  function saveProfile() {
    const cleanedProfile = {
      displayName: profile.displayName.trim(),
      gradeBand: profile.gradeBand,
      track: profile.track,
      currentSkill: profile.currentSkill.trim(),
    };

    setProfile({
      ...defaultProfile,
      ...cleanedProfile,
    });

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...defaultProfile,
        ...cleanedProfile,
      })
    );

    setError("");
  }

  function clearProfile() {
    window.localStorage.removeItem(STORAGE_KEY);
    setProfile(defaultProfile);
    setAnswer("");
    setNextStep("");
    setError("");
  }

  async function askChavruta(event) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Please ask a Hebrew question first.");
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
          question: trimmedQuestion,
          profile: {
            name: activeProfile.displayName,
            gradeBand: activeProfile.gradeBand,
            track: activeProfile.track,
            currentSkill: activeProfile.currentSkill,
          },
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
        throw new Error(
          data.error || `Request failed with status ${response.status}.`
        );
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
  }

  function handleQuestionKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askChavruta(event);
    }
  }

  return (
    <section id="chavruta" className="section">
      <div className="section-heading">
        <p className="eyebrow">Ask Chavruta</p>

        <h2>A gentle Hebrew helper for every student’s beginning.</h2>

        <p className="section-intro">
          Create a simple student profile, choose a starting track, and ask
          Chavruta for Hebrew help, letter practice, catch-up guidance, or
          one-hour lesson support.
        </p>
        <p className="note">
          Chavruta Classroom is a gentle learning helper for Hebrew letters,
          track placement, review, and next steps. The
          tracks are doorways, not labels.
        </p>
      </div>

      <div className="two-column">
        <article className="feature-card">
          <h3>Student Profile</h3>

          <div className="form-stack">
            <label htmlFor="student-name">Name or nickname</label>
            <input
              id="student-name"
              type="text"
              value={profile.displayName}
              onChange={(event) =>
                updateProfile("displayName", event.target.value)
              }
              placeholder="First name or nickname"
            />

            <label htmlFor="grade-band">Grade band</label>
            <select
              id="grade-band"
              value={profile.gradeBand}
              onChange={(event) => updateProfile("gradeBand", event.target.value)}
            >
              <option value="K-2">K-2</option>
              <option value="3-5">3-5</option>
              <option value="6-8">6-8</option>
              <option value="9-12">9-12</option>
              <option value="Adult / Teacher">Adult / Teacher</option>
            </select>

            <label htmlFor="track">Starting track</label>
            <select
              id="track"
              value={profile.track}
              onChange={(event) => updateProfile("track", event.target.value)}
            >
              <option value="Aleph">Aleph</option>
              <option value="Bet">Bet</option>
              <option value="Gimel">Gimel</option>
            </select>

            <label htmlFor="current-skill">Current skill</label>
            <input
              id="current-skill"
              type="text"
              value={profile.currentSkill}
              onChange={(event) =>
                updateProfile("currentSkill", event.target.value)
              }
              placeholder="Example: Learning Aleph and Ayin"
            />

            <div className="hero-actions">
              <button className="button primary" type="button" onClick={saveProfile}>
                Save My Profile
              </button>

              <button
                className="button secondary"
                type="button"
                onClick={clearProfile}
              >
                Clear Profile
              </button>
            </div>

            <p className="note">
              Use a first name or nickname only. Your profile is saved on this
              device and is used to personalize Chavruta’s answer when you ask a
              question.
            </p>
            <p className="note">
              Chavruta is not a rabbi or religious authority.
            </p>
            <a className="button secondary" href="/placement-quick-check.html">
              Placement Quick-Check
            </a>

            <div className="pilot-box">
              <p>
                <strong>Current profile:</strong> {activeProfile.displayName}
              </p>
              <p>
                <strong>Track:</strong> {activeProfile.track}
              </p>
              <p>
                <strong>Skill:</strong> {activeProfile.currentSkill}
              </p>
            </div>
          </div>
        </article>

        <article className="feature-card">
          <h3>Ask Chavruta</h3>

          <form className="form-stack" onSubmit={askChavruta}>
            <label htmlFor="chavruta-question">Question</label>

            <textarea
              id="chavruta-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleQuestionKeyDown}
              placeholder="Ask a Hebrew learning question..."
              rows={6}
            />

            <p className="note">
              Press Enter to ask. Press Shift + Enter for a new line.
            </p>

            <button className="button primary" type="submit" disabled={loading}>
              {loading ? "Asking..." : "Ask Chavruta"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          {answer && (
            <div className="answer-box">
              <h4>Chavruta says:</h4>
              <p>{answer}</p>
            </div>
          )}

          {nextStep && (
            <div className="pilot-box">
              <h4>Next step</h4>
              <p>{nextStep}</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

export default ChavrutaClassroom;
