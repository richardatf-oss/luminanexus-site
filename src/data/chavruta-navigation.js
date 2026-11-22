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
