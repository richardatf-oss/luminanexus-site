export function openChavruta(detail = {}) {
  window.dispatchEvent(new CustomEvent("luminanexus:open-chavruta", { detail }));
  requestAnimationFrame(() => {
    const section = document.getElementById("chavruta");
    if (!section) return;
    const heading = section.querySelector("h2");
    heading?.focus({ preventScroll: true });
    const header = document.querySelector(".ln-navigation, .site-header");
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - (header?.getBoundingClientRect().height || 0), behavior: "instant" });
  });
}

export function readLessonContext(search) {
  const params = new URLSearchParams(search);
  const match = /^\/(aleph|bet|gimel)-track\.html#lesson-([1-9]\d?)$/.exec(params.get("chavrutaLesson") || "");
  if (!match) return {};
  const lesson = Number(match[2]);
  if (lesson > (match[1] === "aleph" ? 36 : 32)) return {};
  const track = match[1][0].toUpperCase() + match[1].slice(1);
  const title = (params.get("chavrutaSkill") || `${track} lesson ${lesson}`).slice(0, 160);
  return { track, currentSkill: title, lesson, lessonHref: match[0] };
}
