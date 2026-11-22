import { openChavruta } from "../data/chavruta-navigation.js";
import { useState } from "react";
import { chooseTrackKey } from "../data/placement.js";

const questions = [
  {
    eyebrow: "Direction",
    prompt: "When you look at Hebrew, where do your eyes know to begin?",
    visual: <div className="doorway-hebrew" dir="rtl">אור</div>,
    answers: [
      { label: "I’m still learning where to begin", value: 0 },
      { label: "On the right, with a little reminder", value: 1 },
      { label: "On the right—I know the direction", value: 2 },
    ],
  },
  {
    eyebrow: "Letters",
    prompt: "How familiar do these Hebrew letters feel?",
    visual: <div className="doorway-hebrew letter-row" dir="rtl">א · ב · ע · מ · ש</div>,
    answers: [
      { label: "New or mostly unfamiliar", value: 0 },
      { label: "I recognize two or three", value: 1 },
      { label: "I recognize most of them", value: 2 },
    ],
  },
  {
    eyebrow: "Words & meaning",
    prompt: "What happens when you meet a short Hebrew word?",
    visual: <div className="doorway-hebrew word-pair" dir="rtl"><span>אור</span><span>שלום</span></div>,
    answers: [
      { label: "I begin by finding individual letters", value: 0 },
      { label: "I can try building the sounds", value: 1 },
      { label: "I can read some words and seek meaning", value: 2 },
    ],
  },
  {
    eyebrow: "Letter check",
    prompt: "Which letter is Mem?",
    visual: <p>Choose the letter itself, or choose “I’m still learning.”</p>,
    answers: [
      { label: "ש", value: 0 },
      { label: "מ", value: 2 },
      { label: "א", value: 0 },
      { label: "I’m still learning these letters", value: 0 },
    ],
  },
  {
    eyebrow: "Reading check",
    prompt: "Which sound matches this pointed word?",
    visual: <div className="doorway-hebrew" dir="rtl" lang="he">מִי</div>,
    answers: [
      { label: "mah", value: 0 },
      { label: "mee", value: 2 },
      { label: "moh", value: 0 },
      { label: "I’m still learning to read pointed words", value: 0 },
    ],
  },
];

const tracks = {
  Aleph: {
    letter: "א",
    title: "Aleph Track",
    subtitle: "First Beginning",
    text: "Begin with direction, letter shapes, names, tracing, and confidence. This is not behind—it is the first doorway.",
    page: "/aleph-track.html",
    pdf: "/downloads/Aleph_Track_Printable.pdf",
    image: "/images/aleph-doorway.webp",
  },
  Bet: {
    letter: "ב",
    title: "Bet Track",
    subtitle: "Building the Word",
    text: "Build from familiar letters into pairs, sounds, syllables, vowels, and early words—always beginning on the right.",
    page: "/bet-track.html",
    pdf: "/downloads/Bet_Track_Printable.pdf",
    image: "/images/bet-building-words.webp",
  },
  Gimel: {
    letter: "ג",
    title: "Gimel Track",
    subtitle: "Reading with Meaning",
    text: "Read short words, connect sound to meaning, notice roots, and strengthen fluency through thoughtful practice.",
    page: "/gimel-track.html",
    pdf: "/downloads/Gimel_Track_Printable.pdf",
    image: "/images/gimel-reading-meaning.webp",
  },
};

function chooseTrack(scores) {
  return tracks[chooseTrackKey(scores)];
}

export default function DoorwayFinder() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState([]);
  const complete = step === questions.length;
  const result = complete ? chooseTrack(scores) : null;

  function answer(value) {
    setScores((current) => [...current.slice(0, step), value]);
    setStep((current) => current + 1);
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  function reset() {
    setScores([]);
    setStep(0);
  }

  return (
    <section id="doorway-questions" className="section doorway-finder">
      <div className="doorway-intro">
        <div>
          <p className="eyebrow">Find Your Hebrew Doorway</p>
          <h2>Not a test. A place to begin.</h2>
        </div>
        <p>
          Five gentle questions can suggest a starting track. The result is a
          doorway, not a label—and students may move as confidence grows.
        </p>
      </div>

      <div className="doorway-shell" aria-live="polite">
        {!complete ? (
          <div className="doorway-question">
            <div className="doorway-progress" style={{ gridTemplateColumns: `repeat(${questions.length}, 1fr)` }} aria-label={`Question ${step + 1} of ${questions.length}`}>
              {questions.map((_, index) => (
                <span key={index} className={index <= step ? "active" : ""} />
              ))}
            </div>
            <p className="eyebrow">{questions[step].eyebrow} · {step + 1} of {questions.length}</p>
            <h3>{questions[step].prompt}</h3>
            {questions[step].visual}
            <div className="doorway-answers" role="group" aria-label={questions[step].prompt}>
              {questions[step].answers.map((option) => (
                <button key={option.label} type="button" onClick={() => answer(option.value)}>
                  <span lang={/[\u0590-\u05ff]/.test(option.label) ? "he" : undefined}>{option.label}</span>
                </button>
              ))}
            </div>
            <div className="doorway-meta">
              {step > 0 ? <button className="text-button" type="button" onClick={goBack}>Previous question</button> : <span />}
              <small>No name or student information is collected.</small>
            </div>
          </div>
        ) : (
          <div className="doorway-result">
            <img src={result.image} alt="" />
            <div className="doorway-result-copy">
              <p className="eyebrow">A welcoming place to begin</p>
              <div className="result-title"><span dir="rtl">{result.letter}</span><div><h3>{result.title}</h3><p>{result.subtitle}</p></div></div>
              <p>{result.text}</p>
              <p className="doorway-principle">The student is not a score. The beginning is not a weakness.</p>
              <div className="hero-actions">
                <a className="button primary" href={result.page}>Open {result.title}</a>
                <a className="button secondary" href={result.pdf}>Printable Workbook</a>
                <button className="button secondary" type="button" onClick={() => {
                  window.history.pushState(null, "", "#chavruta");
                  openChavruta({ track: result.title.split(" ")[0], mode: "hebrew-classroom" });
                }}>Use {result.title} in Chavruta</button>
                <button className="text-button" type="button" onClick={reset}>Start again</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
