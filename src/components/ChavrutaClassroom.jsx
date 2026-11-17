import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "chavrutaStudentProfile";
const MODES = new Set([
  "hebrew-classroom",
  "track-placement",
  "teacher-planning",
  "source-library",
  "noahide-parcha",
]);

const defaultProfile = {
  displayName: "",
  gradeBand: "K-2",
  track: "Aleph",
  currentSkill: "Finding Hebrew starting point",
};

function ChavrutaClassroom() {
  const [profile, setProfile] = useState(defaultProfile);
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState("hebrew-classroom");
  const [answer, setAnswer] = useState("");
  const inFlight = useRef(false);
  const [profileStatus, setProfileStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = window.localStorage.getItem(STORAGE_KEY);

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);

        setProfile({
          ...defaultProfile,
          displayName: typeof parsedProfile?.displayName === "string" ? parsedProfile.displayName.slice(0, 60) : "",
          gradeBand: ["K-2", "3-5", "6-8", "9-12", "Adult / Teacher"].includes(parsedProfile?.gradeBand) ? parsedProfile.gradeBand : defaultProfile.gradeBand,
          track: ["Aleph", "Bet", "Gimel"].includes(parsedProfile?.track) ? parsedProfile.track : "Aleph",
          currentSkill: typeof parsedProfile?.currentSkill === "string" ? parsedProfile.currentSkill.slice(0, 200) : defaultProfile.currentSkill,
        });
      }
    } catch {
      setProfile(defaultProfile);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedMode = params.get("chavrutaMode");
    const requestedQuestion = params.get("chavrutaQuestion");

    if (MODES.has(requestedMode)) {
      setMode(requestedMode);
    }

    if (requestedQuestion) {
      setQuestion(requestedQuestion.slice(0, 1200));
    }

    function openWithContext(event) {
      const detail = event.detail || {};
      if (["Aleph", "Bet", "Gimel"].includes(detail.track)) {
        setProfile(current => ({ ...current, track: detail.track }));
        setProfileStatus(`${detail.track} Track selected for this session. Save your profile to remember it on this device.`);
      }

      if (MODES.has(detail.mode)) {
        setMode(detail.mode);
      }

      if (typeof detail.question === "string") {
        setQuestion(detail.question.slice(0, 1200));
      }
    }

    window.addEventListener("luminanexus:open-chavruta", openWithContext);
    return () =>
      window.removeEventListener("luminanexus:open-chavruta", openWithContext);
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

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedProfile));
      setProfileStatus("Profile saved on this device.");
    } catch {
      setProfileStatus("Your profile is available for this session, but this browser could not save it on this device.");
    }

    setError("");
  }

  function clearProfile() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setProfileStatus("Profile cleared from this device.");
    } catch {
      setProfileStatus("Profile reset for this session. This browser could not remove the saved copy.");
    }
    setProfile(defaultProfile);
    setAnswer("");
    setError("");
  }

  async function askChavruta(event) {
    event.preventDefault();
    if (inFlight.current) return;

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Please enter a study question first.");
      return;
    }

    inFlight.current = true;
    setLoading(true);
    setError("");
    setAnswer("");

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
          mode,
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
    } catch (err) {
      setError(err.message || "Chavruta could not answer.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  function handleQuestionKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      askChavruta(event);
    }
  }

  return (
    <section id="chavruta" className="section">
      <div className="section-heading">
        <p className="eyebrow">Ask Chavruta</p>

        <h2 tabIndex={-1}>A gentle Hebrew helper for every student’s beginning.</h2>

        <p className="section-intro">
          Create a simple student profile, choose a starting track, and ask
          Chavruta for Hebrew help, letter practice, catch-up guidance, or
          one-hour lesson support. Noahide learners may also choose Noahide
          Parcha for a humble, source-aware weekly reflection.
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
              maxLength={60}
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
              maxLength={200}
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

            <p role="status">{profileStatus}</p>
            <p className="note">
              Use a first name or nickname only. Your profile is saved on this
              device when you save it. When you ask a question, your question,
              nickname, grade band, track, and current skill are sent to our
              answer service and OpenAI to generate a response. You can leave the
              nickname blank. Please avoid private personal information.
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

          <form className="form-stack" onSubmit={askChavruta} aria-busy={loading}>
            <label htmlFor="chavruta-mode">Question type</label>
            <select
              id="chavruta-mode"
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              <option value="hebrew-classroom">Hebrew learning</option>
              <option value="track-placement">Track placement</option>
              <option value="teacher-planning">Teacher planning</option>
              <option value="source-library">Source Library</option>
              <option value="noahide-parcha">Noahide Parcha</option>
            </select>

            {mode === "noahide-parcha" && (
              <p className="context-note">
                Parcha mode offers a structured Noahide reflection with source
                boundaries. Name the portion rather than asking Chavruta to
                guess this week’s reading.
              </p>
            )}

            {mode === "source-library" && (
              <p className="context-note">
                Source Library mode can explain a reference or Hebrew word.
                Check linked texts in Sefaria for the source itself.
              </p>
            )}

            <label htmlFor="chavruta-question">Question</label>

            <textarea
              id="chavruta-question"
              maxLength={1200}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleQuestionKeyDown}
              placeholder={
                mode === "noahide-parcha"
                  ? "Name a parsha and ask for a Noahide reflection..."
                  : "Ask a Hebrew learning question..."
              }
              rows={6}
            />

            <p className="note">
              Press Enter to ask. Press Shift + Enter for a new line.
            </p>

            <button className="button primary" type="submit" disabled={loading}>
              {loading ? "Asking..." : "Ask Chavruta"}
            </button>
          </form>

          <p role="status">{loading ? "Chavruta is preparing your answer…" : ""}</p>
          {error && <p className="error" role="alert">{error}</p>}

          {answer && (
            <div className="answer-box" role="region" aria-label="Chavruta answer" aria-live="polite">
              <h4>Chavruta says:</h4>
              <p>{answer}</p>
            </div>
          )}


        </article>
      </div>
    </section>
  );
}

export default ChavrutaClassroom;
