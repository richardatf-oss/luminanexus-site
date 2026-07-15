import { useState } from "react";

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
  const total = scores.reduce((sum, score) => sum + score, 0);
  if (total <= 2) return tracks.Aleph;
  if (total <= 4) return tracks.Bet;
  return tracks.Gimel;
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
    <section id="find-your-doorway" className="section doorway-finder">
      <div className="doorway-intro">
        <div>
          <p className="eyebrow">Find Your Hebrew Doorway</p>
          <h2>Not a test. A place to begin.</h2>
        </div>
        <p>
          Three gentle questions can suggest a starting track. The result is a
          doorway, not a label—and students may move as confidence grows.
        </p>
      </div>

      <div className="doorway-shell" aria-live="polite">
        {!complete ? (
          <div className="doorway-question">
            <div className="doorway-progress" aria-label={`Question ${step + 1} of ${questions.length}`}>
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
                  <span>{option.label}</span><span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
            <div className="doorway-meta">
              {step > 0 ? <button className="text-button" type="button" onClick={goBack}>← Previous question</button> : <span />}
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
                <button className="text-button" type="button" onClick={reset}>Start again</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
