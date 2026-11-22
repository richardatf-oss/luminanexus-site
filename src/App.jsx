import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import ChavrutaClassroom from "./components/ChavrutaClassroom.jsx";
import DoorwayFinder from "./components/DoorwayFinder.jsx";
import { openChavruta, readLessonContext } from "./data/chavruta-navigation.js";
import "./styles/home.css";

const tracks = [
  { name: "Aleph", letter: "א", subtitle: "First letters", lessons: 36, image: "aleph-doorway.webp", description: "Learn the shapes, sounds, and vowels. Begin reading with small, encouraging steps." },
  { name: "Bet", letter: "ב", subtitle: "Build words", lessons: 32, image: "bet-building-words.webp", description: "Blend familiar sounds into words, greetings, and short conversations." },
  { name: "Gimel", letter: "ג", subtitle: "Read with meaning", lessons: 32, image: "gimel-reading-meaning.webp", description: "Read words and phrases, connect them to meaning, and explain what you notice." },
];
const legacyPages = new Set(["mission", "pilot", "schools", "support"]);

function readLearningPlace() {
  try {
    const place = JSON.parse(localStorage.getItem("luminanexus-learning-place-v1"));
    const track = tracks.find(item => item.name === place?.track);
    if (track && Number.isInteger(place.lesson) && place.lesson >= 1 && place.lesson <= track.lessons && typeof place.title === "string") {
      return { ...place, title: place.title.slice(0, 160), href: `/${track.name.toLowerCase()}-track.html#lesson-${place.lesson}` };
    }
  } catch {}
  return null;
}

export default function App() {
  const [learningPlace, setLearningPlace] = useState(readLearningPlace);
  const [finderOpen, setFinderOpen] = useState(location.hash === "#find-your-doorway");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    function alignDestination() {
      const hash = location.hash.slice(1);
      if (legacyPages.has(hash)) { location.replace(`/about.html#${hash}`); return; }
      if (hash === "noahide-parcha") { location.replace("/noahide-parcha.html"); return; }
      if (hash === "teacher-dashboard") { location.replace("/#resources"); return; }
      if (hash === "find-your-doorway") setFinderOpen(true);
      if (hash === "chavruta") openChavruta();
    }
    function activateChavruta(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash !== "#chavruta") return;
      event.preventDefault();
      history.pushState(null, "", url);
      openChavruta({ mode: url.searchParams.get("chavrutaMode"), question: url.searchParams.get("chavrutaQuestion") ?? undefined, ...readLessonContext(url.search) });
    }
    const refreshPlace = () => setLearningPlace(readLearningPlace());
    document.addEventListener("click", activateChavruta);
    window.addEventListener("hashchange", alignDestination);
    window.addEventListener("load", alignDestination, { once: true });
    window.addEventListener("storage", refreshPlace);
    window.addEventListener("pageshow", refreshPlace);
    alignDestination();
    return () => {
      document.removeEventListener("click", activateChavruta);
      window.removeEventListener("hashchange", alignDestination);
      window.removeEventListener("load", alignDestination);
      window.removeEventListener("storage", refreshPlace);
      window.removeEventListener("pageshow", refreshPlace);
    };
  }, []);

  function exploreName(event) {
    event.preventDefault();
    if (!name.trim()) { setNameError("Enter a first name or nickname to begin."); return; }
    setNameError("");
    openChavruta({ mode: "name-study", question: `Help me explore the name "${name.trim()}". Ask about pronunciation if needed. Suggest a plausible Hebrew-letter spelling and readable transliteration. Identify the letters and sounds, then offer a playful, clearly labeled creative riff. Separate this from the name's actual etymology and established Jewish interpretation; do not invent a traditional meaning or source.` });
  }

  return (
    <div className="site home-page">
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section id="home" className="hero home-hero">
          <div className="home-hero-copy">
            <p className="eyebrow">LuminaNexus Foundation · Ivrit HaOr</p>
            <h1>Every letter is <span>a beginning.</span></h1>
            <p className="hero-text">Learn Hebrew. Explore Jewish wisdom. Find a place to begin, and a study partner for the journey.</p>
            <div className="hero-actions">
              <a className="button primary" href="#tracks">Start learning Hebrew</a>
              <a className="button secondary" href="#chavruta">Meet Chavruta</a>
            </div>
            <p className="home-welcome">No student is late to Hebrew. Start by readiness, at any age.</p>
          </div>
          <figure className="home-hero-art">
            <img src="/images/ivrit-haor-hero.webp" alt="An open book becoming a luminous tree, with a welcoming doorway among its roots" fetchPriority="high" width="1024" height="1024" />
            <figcaption><span lang="he" dir="rtl">אוֹר</span><span>or · light</span></figcaption>
          </figure>
        </section>

        {learningPlace && <aside className="home-resume" aria-label="Continue learning">
          <div><span className="eyebrow">Welcome back</span><p><strong>{learningPlace.track} · Lesson {learningPlace.lesson}</strong> — {learningPlace.title}</p><small>Your last opened lesson on this device.</small></div>
          <div className="home-resume-actions"><a className="button primary" href={learningPlace.href}>Continue learning</a><button className="text-button" type="button" onClick={() => { try { localStorage.removeItem("luminanexus-learning-place-v1"); } catch {} setLearningPlace(null); }}>Clear saved place</button></div>
        </aside>}

        <section id="study-doorways" className="section home-paths" aria-labelledby="paths-heading">
          <div className="section-heading"><p className="eyebrow">Your next step</p><h2 id="paths-heading">What brings you here?</h2></div>
          <div className="home-path-grid">
            <article className="home-path"><span className="home-path-mark" lang="he" aria-hidden="true">א</span><h3>Learn Hebrew</h3><p>Letters, sounds, words, and meaning. Three gentle tracks meet you where you are.</p><a href="#tracks">Choose a Hebrew track</a></article>
            <article className="home-path"><span className="home-path-mark" lang="he" aria-hidden="true">ס</span><h3>Explore Jewish study</h3><p>Read a source, explore the 231 Gates, or follow the Noahide daily study path.</p><a href="/study.html">Find a study path</a></article>
            <article className="home-path"><span className="home-path-mark" lang="he" aria-hidden="true">מ</span><h3>Teach a class</h3><p>A teacher guide, a first lesson, and practical tools to help every learner begin.</p><a href="/teacher-resources.html">Open teacher resources</a></article>
          </div>
        </section>

        <section id="ivrit-haor" className="section home-learning">
          <div id="tracks" className="section-heading"><p className="eyebrow">Ivrit HaOr · Hebrew of Light</p><h2>From the first letter<br />to the meaning of a word.</h2><p className="section-intro">Choose by what feels familiar, rather than age or grade. Each track pairs online lessons with a printable workbook. Repeat a lesson whenever it helps.</p></div>
          <div className="track-grid">
            {tracks.map(track => <article className="track-card home-track" key={track.name}>
              <img className="track-image" src={`/images/${track.image}`} alt="" loading="lazy" width="1024" height="1024" />
              <div className="home-track-copy"><p className="eyebrow">{track.lessons} lessons · {track.name} Track</p><h3><span lang="he" aria-hidden="true">{track.letter}</span> {track.subtitle}</h3><p>{track.description}</p>
              <a className="button primary" href={`/${track.name.toLowerCase()}-track.html#lesson-1`}>Begin {track.name}</a>
              <a className="home-download" href={`/downloads/${track.name}_Track_Printable.pdf`}>Printable workbook <span className="file-type">PDF</span></a></div>
            </article>)}
          </div>
          <details id="find-your-doorway" className="home-placement" open={finderOpen} onToggle={event => setFinderOpen(event.currentTarget.open)}><summary>Not sure where to start? Find your Hebrew track.</summary><DoorwayFinder /></details>
        </section>

        <section id="resources" className="section home-teachers">
          <div className="home-teacher-intro"><div className="section-heading"><p className="eyebrow">For teachers & families</p><h2>A little preparation.<br />A welcoming first lesson.</h2><p className="section-intro">Plan a weekly session, find each learner’s starting point, and use the matching workbook. The tools are ready when you are.</p><a className="home-text-link" href="/teacher-resources.html">Browse workbooks and plan a lesson</a></div><img src="/images/teacher-dashboard.webp" alt="A teacher’s workspace with Hebrew letter blocks, lesson materials, and a notebook" loading="lazy" width="1536" height="1024" /></div>
          <div className="home-tool-grid">
            <article><p className="eyebrow">Plan</p><h3>Teacher Guide</h3><p>Lesson rhythm, track maps, classroom practice, and teaching notes.</p><a href="/teacher-guide.html">Read the guide</a></article>
            <article><p className="eyebrow">Place</p><h3>Placement Quick-Check</h3><p>Observe what a learner can do and choose a comfortable starting track.</p><a href="/placement-quick-check.html">Find a starting point</a></article>
            <article><p className="eyebrow">Teach</p><h3>Week 1 Packet</h3><p>A ready-to-teach session with activities, practice, and an answer key.</p><a href="/week-1-teaching-packet.html">Prepare the first lesson</a></article>
          </div>
        </section>

        <ChavrutaClassroom />

        <section className="section home-name" aria-labelledby="name-heading"><div><p className="eyebrow">A personal beginning</p><h2 id="name-heading">What might your name<br />look like in Hebrew?</h2><p>Explore possible spellings and sounds with Chavruta, then enjoy a clearly labeled creative reflection on the letters.</p></div><form className="form-stack" onSubmit={exploreName}><label htmlFor="name-explorer">First name or nickname</label><div className="home-name-input"><input id="name-explorer" maxLength={60} value={name} onChange={event => { setName(event.target.value); setNameError(""); }} placeholder="For example, Elijah" aria-describedby="name-note" /><button className="button primary" type="submit">Explore my name</button></div><p id="name-note" className="note">Use a first name or nickname. Spelling depends on pronunciation; creative reflections are separate from a name’s history.</p>{nameError && <p role="alert" className="error">{nameError}</p>}</form></section>
      </main>
      <footer className="site-footer home-footer"><div><a href="/" className="home-footer-brand">LuminaNexus</a><p>Hebrew learning. Thoughtful study. Many beginnings.</p></div><nav aria-label="Footer navigation"><a href="/about.html">About the Foundation</a><a href="/study.html">Jewish study</a><a href="/teacher-resources.html">Teacher resources</a><a href="/about.html#support">Support the work</a></nav><p className="home-footer-note">Torah belongs to Israel. We approach Jewish sources with gratitude and respect for Jewish tradition and rabbinic authority.</p><small>© {new Date().getFullYear()} LuminaNexus Foundation</small></footer>
    </div>
  );
}
