import { useEffect, useMemo, useRef, useState } from "react";
import { readLessonContext } from "../data/chavruta-navigation.js";

const STORAGE_KEY = "chavrutaStudentProfile";
const MODES = new Set([
  "judaism-study",
  "name-study",
  "hebrew-classroom",
  "track-placement",
  "teacher-planning",
  "source-library",
  "noahide-parcha",
]);

const JUDAISM_PROMPTS = [
  { label: "Torah & Talmud", question: "What is the difference between Torah, Mishnah, Talmud, and Midrash?" },
  { label: "Jewish history", question: "What are some major eras in Jewish history, and what changed between them?" },
  { label: "Holidays", question: "Give me a beginner-friendly overview of the Jewish holiday of Shavuot." },
  { label: "Prayer & liturgy", question: "Explain the Amidah and how it fits into Jewish prayer." },
  { label: "Shabbat & practice", question: "How do Jewish communities differ in their Shabbat customs?" },
  { label: "Ethics", question: "How do Jewish views of teshuvah appear in traditional sources?" },
  { label: "Mysticism", question: "What is Kabbalah, and how is it related to other streams of Jewish thought?" },
  { label: "Communities & movements", question: "Compare how different Jewish communities and movements approach a question I name." },
];

const defaultProfile = {
  displayName: "",
  gradeBand: "K-2",
  track: "Aleph",
  currentSkill: "Finding Hebrew starting point",
};

function ChavrutaClassroom() {
  const [profile, setProfile] = useState(defaultProfile);
  const [lessonContext, setLessonContext] = useState(null);
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

    if (MODES.has(requestedMode)) setMode(requestedMode);
    if (requestedQuestion) setQuestion(requestedQuestion.slice(0, 1200));
    const context = readLessonContext(window.location.search);
    if (context.track) {
      setProfile(current => ({ ...current, track: context.track, currentSkill: context.currentSkill }));
      setLessonContext(context);
    }

    function openWithContext(event) {
      const detail = event.detail || {};
      if (["Aleph", "Bet", "Gimel"].includes(detail.track)) {
        setProfile(current => ({ ...current, track: detail.track }));
        setProfileStatus(`${detail.track} Track selected for this session. Save your profile to remember it on this device.`);
      }
      if (typeof detail.currentSkill === "string") setProfile(current => ({ ...current, currentSkill: detail.currentSkill.slice(0, 200) }));
      if (detail.lessonHref) setLessonContext(detail);
      if (MODES.has(detail.mode)) setMode(detail.mode);
      if (typeof detail.question === "string") setQuestion(detail.question.slice(0, 1200));
    }

    window.addEventListener("luminanexus:open-chavruta", openWithContext);
    return () => window.removeEventListener("luminanexus:open-chavruta", openWithContext);
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
    setProfile(currentProfile => ({ ...currentProfile, [field]: value }));
  }

  function saveProfile() {
    const cleanedProfile = {
      displayName: profile.displayName.trim(),
      gradeBand: profile.gradeBand,
      track: profile.track,
      currentSkill: profile.currentSkill.trim(),
    };
    setProfile({ ...defaultProfile, ...cleanedProfile });

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
        headers: { "Content-Type": "application/json" },
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
        data = { error: text || "The server returned an unreadable response." };
      }

      if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}.`);
      const answerText = data.answer || data.response;
      if (!answerText) throw new Error("Chavruta answered, but no answer text came back.");
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

  function usePrompt(prompt) {
    setQuestion(prompt);
    setError("");
    setAnswer("");
  }

  const isJudaismMode = mode === "judaism-study";

  return (
    <section id="chavruta" className="section chavruta-section">
      <div className="section-heading">
        <p className="eyebrow">Ask Chavruta</p>
        <h2 tabIndex={-1}>A good question is a beginning, too.</h2>
        <p className="section-intro">
          Meet Chavruta / Havari, your study companion for Hebrew and Jewish
          learning. Bring a question, explore a source, or ask for a little help
          with the lesson in front of you.
        </p>
        <p className="note">
          Chavruta is an educational companion, not a rabbi. It distinguishes
          sources, interpretations, and community practices; for personal
          religious decisions, consult a trusted qualified Jewish teacher.
        </p>
      </div>

      {lessonContext && mode === "hebrew-classroom" && <aside className="chavruta-lesson" aria-label="Current lesson">
        <strong>{lessonContext.track} Track · Lesson {lessonContext.lesson}</strong>
        <p>{lessonContext.currentSkill}</p>
        <a href={lessonContext.lessonHref}>Return to this lesson</a>
      </aside>}
      <div className="two-column">


        <article className="feature-card">
          <h3>Ask Chavruta</h3>
          <form className="form-stack" onSubmit={askChavruta} aria-busy={loading}>
            <label htmlFor="chavruta-mode">Study area</label>
            <select id="chavruta-mode" value={mode} onChange={event => setMode(event.target.value)}>
              <option value="hebrew-classroom">Hebrew learning</option>
              <option value="judaism-study">Judaism & Jewish life</option>
              <option value="name-study">Explore a Hebrew name</option>
              <option value="track-placement">Hebrew track placement</option>
              <option value="teacher-planning">Hebrew teacher planning</option>
              <option value="source-library">Jewish Source Library</option>
              <option value="noahide-parcha">Noahide Parcha</option>
            </select>

            {mode === "name-study" && (
              <p className="context-note">
                Chavruta can suggest Hebrew-letter spellings and sounds, then
                offer a playful riff. Creative associations are not the same
                as a name’s historical origin or established Jewish teaching.
              </p>
            )}

            {isJudaismMode && (
              <div className="context-note">
                <p>Choose a starting topic, or write your own question. Name a tradition or community if you want that perspective.</p><p><a href="/jewish-study.html">Read the guided topic introductions and try a study task</a></p>
                <details>
                  <summary>Browse sample questions by topic</summary>
                  <div className="hero-actions">
                    {JUDAISM_PROMPTS.map(({ label, question: prompt }) => (
                      <button key={label} className="button secondary" type="button" onClick={() => usePrompt(prompt)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            )}

            {mode === "noahide-parcha" && (
              <p className="context-note">
                Parcha mode offers a structured Noahide reflection with source
                boundaries. Name the portion rather than asking Chavruta to
                guess this week’s reading.
              </p>
            )}

            {mode === "source-library" && (
              <p className="context-note">
                Explore Jewish texts and commentaries. Chavruta will distinguish
                a known source from a suggested place to look it up; use Sefaria
                to verify the text itself.
              </p>
            )}

            <label htmlFor="chavruta-question">Question</label>
            <textarea
              id="chavruta-question"
              maxLength={1200}
              value={question}
              onChange={event => setQuestion(event.target.value)}
              onKeyDown={handleQuestionKeyDown}
              placeholder={isJudaismMode
                ? "Ask about any area of Judaism or Jewish life..."
                : mode === "name-study"
                  ? "Enter a first name or nickname and tell Chavruta how you pronounce it..."
                  : mode === "noahide-parcha"
                    ? "Name a parsha and ask for a Noahide reflection..."
                    : "Ask a Hebrew learning question..."}
              rows={6}
            />

            <p className="note">Press Enter to ask. Press Shift + Enter for a new line.</p>
            <p className="note">Your question and any learning preferences are sent to our answer service and OpenAI when you ask. Please leave out private personal information.</p>
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
        <details className="feature-card chavruta-profile">
          <summary>Learning preferences (optional)</summary>
          <p className="note">You can ask a question without filling in a profile.</p>
          <div className="form-stack">
            <label htmlFor="student-name">Name or nickname</label>
            <input
              id="student-name"
              maxLength={60}
              type="text"
              value={profile.displayName}
              onChange={event => updateProfile("displayName", event.target.value)}
              placeholder="First name or nickname"
            />

            <label htmlFor="grade-band">Grade band</label>
            <select
              id="grade-band"
              value={profile.gradeBand}
              onChange={event => updateProfile("gradeBand", event.target.value)}
            >
              <option value="K-2">K-2</option>
              <option value="3-5">3-5</option>
              <option value="6-8">6-8</option>
              <option value="9-12">9-12</option>
              <option value="Adult / Teacher">Adult / Teacher</option>
            </select>

            <label htmlFor="track">Starting Hebrew track</label>
            <select id="track" value={profile.track} onChange={event => updateProfile("track", event.target.value)}>
              <option value="Aleph">Aleph</option>
              <option value="Bet">Bet</option>
              <option value="Gimel">Gimel</option>
            </select>

            <label htmlFor="current-skill">Current Hebrew skill</label>
            <input
              id="current-skill"
              maxLength={200}
              type="text"
              value={profile.currentSkill}
              onChange={event => updateProfile("currentSkill", event.target.value)}
              placeholder="Example: Learning Aleph and Ayin"
            />

            <div className="hero-actions">
              <button className="button primary" type="button" onClick={saveProfile}>Save My Profile</button>
              <button className="button secondary" type="button" onClick={clearProfile}>Clear Profile</button>
            </div>

            <p role="status">{profileStatus}</p>
            <p className="note">
              Use a first name or nickname only. Your profile is saved on this
              device when you save it. When you ask a question, your question,
              nickname, grade band, Hebrew track, and current Hebrew skill are
              sent to our answer service and OpenAI. You can leave the nickname
              blank. Please avoid private personal information.
            </p>
            <a className="button secondary" href="/placement-quick-check.html">Hebrew Placement Quick-Check</a>

            <div className="pilot-box">
              <p><strong>Current profile:</strong> {activeProfile.displayName}</p>
              <p><strong>Hebrew track:</strong> {activeProfile.track}</p>
              <p><strong>Current skill:</strong> {activeProfile.currentSkill}</p>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}

export default ChavrutaClassroom;
