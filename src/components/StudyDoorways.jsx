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
    title: "Weekly Noahide Parcha",
    text: "Approach the weekly portion as a student from the nations, with gratitude, clear boundaries, and source links.",
    href: "/noahide-parcha.html",
    action: "Open weekly Parcha",
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

export default function StudyDoorways() {
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

      <div className="study-path-grid">
        {pathways.map((path) => (
          <a className="study-path-card" href={path.href} key={path.title}>
            <span className="study-path-marker" aria-hidden="true" dir="rtl">
              {path.marker}
            </span>
            <span className="eyebrow">{path.eyebrow}</span>
            <h3>{path.title}</h3>
            <p>{path.text}</p>
            <span className="study-path-action">
              {path.action} <span aria-hidden="true">→</span>
            </span>
          </a>
        ))}
      </div>

      <p className="boundary-line">
        <strong>Our posture:</strong> Torah belongs to Israel. LuminaNexus
        approaches Jewish sources with gratitude, humility, and respect for
        rabbinic authority.
      </p>
    </section>
  );
}
