import { useState } from "react";

const pathways = [
  {
    marker: "א",
    eyebrow: "Hebrew Learning",
    title: "Find Your Hebrew Track",
    text: "Answer three gentle questions and begin with Aleph, Bet, or Gimel according to readiness—not age or shame.",
    href: "#find-your-doorway",
    action: "Find my doorway",
  },
  {
    marker: "ת",
    eyebrow: "Torah-Aware Study",
    title: "Noahide Parcha Study Guide",
    text: "Approach the weekly portion as a student from the nations, with gratitude, clear boundaries, and source links.",
    href: "/noahide-parcha.html",
    action: "Open study guide",
  },
  {
    marker: "ס",
    eyebrow: "Jewish Sources",
    title: "Explore the Source Library",
    text: "Open carefully selected Torah passages and rabbinic commentary references through Sefaria.",
    href: "/sources.html",
    action: "Browse sources",
  },
  {
    marker: "מ",
    eyebrow: "For Educators",
    title: "Prepare a Lesson",
    text: "Use the Teacher Guide, placement language, classroom rhythm, and printable track materials.",
    href: "/teacher-guide.html",
    action: "Open teacher tools",
  },
  {
    marker: "ח",
    eyebrow: "Guided Help",
    title: "Ask Chavruta / Havari",
    text: "Choose a question type and receive a warm, structured next step for Hebrew, sources, or Parcha study.",
    href: "/?chavrutaMode=hebrew-classroom#chavruta",
    action: "Begin a conversation",
  },
];

const guides = [
  { audience: ["Learners", "Educators"], time: "15 minutes", steps: ["Take the three-question doorway finder below.", "Open the workbook for your recommended track.", "Practice one letter or sound before moving to a new one."], practice: "Find the same Hebrew letter three times on a page. Trace it, then name or sound it with help.", reflection: "Which shape can I recognize without a hint?", resource: "/aleph-track.html", label: "Start Aleph Track" },
  { audience: ["Learners", "Study partners"], time: "20 minutes", steps: ["Find the weekly portion using the calendar linked in the guide, then choose a short passage.", "Separate the words of the passage from commentary and your own interpretation.", "Choose one practical act of justice, kindness, or responsibility."], practice: "Write one observation and one question. Discuss what the source supports and what remains uncertain.", reflection: "What can I put into practice this week?", resource: "/sources.html", label: "Follow the sources" },
  { audience: ["Learners", "Study partners", "Educators"], time: "20 minutes", steps: ["Choose a passage from the source library.", "Read its surrounding verses and identify the speaker and situation.", "Compare a linked commentary with your first understanding."], practice: "Keep a source notebook: reference, short paraphrase, commentary, and an open question.", reflection: "What changed when I read the surrounding passage?", resource: "/?chavrutaMode=hebrew-classroom#chavruta", label: "Bring a question" },
  { audience: ["Educators"], time: "30 minutes", steps: ["Use the placement quick-check to observe readiness.", "Choose one goal and the matching printable workbook.", "Model the task, practice together, and finish with a gentle review."], practice: "Plan a short session: five minutes of review, ten minutes of guided practice, and five minutes of sharing. Introduce each vowel before independent use.", reflection: "What can each learner do more confidently now?", resource: "/placement-quick-check.html", label: "Open placement quick-check" },
  { audience: ["Learners", "Study partners", "Educators"], time: "10 minutes", steps: ["Choose the Chavruta mode that matches your task.", "Ask one focused question and include the source or letter you are studying.", "Check the response against your workbook or linked source."], practice: "Try: Help me review one Hebrew letter I know, then give me one small practice task.", reflection: "Can I explain the answer in my own words?", resource: "/teacher-guide.html", label: "Read the teacher guidance" },
];

export default function StudyDoorways() {
  const [audience, setAudience] = useState("Everyone");
  return (
    <section id="study-doorways" className="section study-doorways">
      <div className="section-heading doorway-heading">
        <div>
          <p className="eyebrow">Choose Your Doorway</p>
          <h2>Begin with the path that brought you here.</h2>
        </div>
        <p className="section-intro">
          LuminaNexus holds several distinct learning paths. Choose one clear
          beginning; you can always return and enter through another doorway.
        </p>
      </div>

      <img className="section-banner" src="/images/study-courtyard.webp" alt="Sunlit arches surrounding an open study book" loading="lazy" />
      <div className="gate-filters" role="group" aria-label="Choose study audience">
        {["Everyone", "Learners", "Study partners", "Educators"].map((option) => (
          <button className="button secondary" type="button" key={option} aria-pressed={audience === option} onClick={() => setAudience(option)}>{option}</button>
        ))}
      </div>
      <p className="gate-count" role="status">{pathways.filter((_, i) => audience === "Everyone" || guides[i].audience.includes(audience)).length} gates for {audience.toLowerCase()}</p>
      <div className="study-path-grid">
        {pathways.map((path, i) => {
          const guide = guides[i];
          if (audience !== "Everyone" && !guide.audience.includes(audience)) return null;
          return (
            <article className="study-path-card expanded-gate" key={path.title}>
              <span className="study-path-marker" aria-hidden="true" dir="rtl">{path.marker}</span>
              <span className="eyebrow">{path.eyebrow} · {guide.time}</span>
              <h3>{path.title}</h3>
              <p>{path.text}</p>
              <a className="study-path-action" href={path.href}>{path.action} <span aria-hidden="true">→</span></a>
              <details>
                <summary>Open this gate’s study guide</summary>
                <h4>Your first steps</h4>
                <ol>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                <h4>Try it</h4><p>{guide.practice}</p>
                <h4>Pause and reflect</h4><p>{guide.reflection}</p>
                <a href={guide.resource}>{guide.label} →</a>
              </details>
            </article>
          );
        })}
      </div>
      <div className="gate-study-invitation">
        <img src="/images/shared-study.webp" alt="Open notebooks ready for shared study in a sunlit library" loading="lazy" />
        <div><p className="eyebrow">Learn together</p><h3>One source. Two perspectives. A better question.</h3><p>Take turns reading a short passage. Each partner shares an observation before either offers an interpretation. Return to the text together, and keep one question for your next session.</p><a className="button secondary" href="#chavruta">Continue with Chavruta / Havari</a></div>
      </div>

      <p className="boundary-line">
        <strong>Our posture:</strong> Torah belongs to Israel. LuminaNexus
        approaches Jewish sources with gratitude, humility, and respect for
        rabbinic authority.
      </p>
    </section>
  );
}
