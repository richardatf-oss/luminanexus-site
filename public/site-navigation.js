// Shared by the React homepage and the standalone learning pages.
const navigation = [
  ["Learn Hebrew", [
    ["Find your starting point", "/#find-your-doorway"],
    ["Aleph · First letters", "/aleph-track.html"],
    ["Bet · Build words", "/bet-track.html"],
    ["Gimel · Read with meaning", "/gimel-track.html"],
    ["About Ivrit HaOr", "/#ivrit-haor"],
  ]],
  ["Study", [
    ["Explore study paths", "/study.html"],
    ["Guided Jewish study", "/jewish-study.html"],
    ["Source Library", "/sources.html"],
    ["The 231 Gates", "/231-gates.html"],
    ["Noahide Daily Parcha", "/noahide-parcha.html"],
  ]],
  ["For Teachers", [
    ["Teacher Guide", "/teacher-guide.html"],
    ["Placement Quick-Check", "/placement-quick-check.html"],
    ["Week 1 Teaching Packet", "/week-1-teaching-packet.html"],
    ["Workbooks & lesson planning", "/teacher-resources.html"],
    ["For schools", "/about.html#schools"],
  ]],
  ["About", [
    ["The Foundation", "/about.html"],
    ["Our mission", "/about.html#mission"],
    ["Pilot program", "/about.html#pilot"],
    ["Support the work", "/about.html#support"],
  ]],
];

class LuminaNexusNavigation extends HTMLElement {
  connectedCallback() {
    if (this.controller) return;
    this.classList.add("ln-navigation");
    this.innerHTML = `
      <a class="ln-skip" href="#main-content">Skip to content</a>
      <nav class="ln-nav" aria-label="Main navigation">
        <a class="ln-brand" href="/" aria-label="LuminaNexus home"><span class="ln-mark" aria-hidden="true">א</span><span>LuminaNexus</span></a>
        <div class="ln-actions"><a class="ln-chavruta" href="/#chavruta">Chavruta</a><button class="ln-toggle" type="button" aria-expanded="false" aria-controls="ln-links">Menu <span aria-hidden="true">☰</span></button></div>
        <div class="ln-links" id="ln-links">${navigation.map(([label, links]) => `
          <details class="ln-group"><summary>${label}<span class="ln-chevron" aria-hidden="true"></span></summary>
            <div class="ln-dropdown">${links.map(([text, href]) => `<a href="${href}">${text}</a>`).join("")}</div>
          </details>`).join("")}</div>
      </nav>`;
    this.controller = new AbortController();
    const { signal } = this.controller;
    const toggle = this.querySelector(".ln-toggle");
    const groups = [...this.querySelectorAll("details")];
    const closeGroups = () => groups.forEach(group => { group.open = false; });
    const closeMenu = () => {
      this.classList.remove("ln-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.firstChild.textContent = "Menu ";
      closeGroups();
    };
    toggle.addEventListener("click", () => {
      const open = this.classList.toggle("ln-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.firstChild.textContent = open ? "Close " : "Menu ";
      if (!open) closeGroups();
    }, { signal });
    groups.forEach(group => group.querySelector("summary").addEventListener("click", () => {
      groups.forEach(other => { if (other !== group) other.open = false; });
    }, { signal }));
    this.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      const group = event.target.closest("details[open]");
      if (group) {
        group.open = false;
        group.querySelector("summary").focus();
      } else if (this.classList.contains("ln-open")) {
        closeMenu();
        toggle.focus();
      } else return;
      event.preventDefault();
    }, { signal });
    document.addEventListener("click", event => {
      if (!this.contains(event.target)) closeMenu();
    }, { signal });
    this.addEventListener("focusout", event => {
      if (!this.contains(event.relatedTarget)) closeMenu();
    }, { signal });
    this.addEventListener("click", event => {
      const link = event.target.closest("a");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href);
      closeMenu();
      if (url.pathname === location.pathname && url.hash && url.hash !== "#chavruta") {
        requestAnimationFrame(() => {
          const target = document.getElementById(url.hash.slice(1));
          if (!target) return;
          if (target.tagName === "DETAILS") target.open = true;
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        });
      }
    }, { signal });
    const markCurrent = () => {
      this.querySelectorAll(".ln-dropdown a").forEach(link => {
        const url = new URL(link.href);
        const current = url.pathname === location.pathname && (url.hash ? url.hash === location.hash : true);
        if (current) link.setAttribute("aria-current", url.hash ? "location" : "page");
        else link.removeAttribute("aria-current");
      });
      groups.forEach(group => group.classList.toggle("ln-current", Boolean(group.querySelector("[aria-current]"))));
    };
    window.addEventListener("hashchange", markCurrent, { signal });
    matchMedia("(min-width: 981px)").addEventListener("change", closeMenu, { signal });
    markCurrent();
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.controller = null;
  }
}

customElements.define("luminanexus-navigation", LuminaNexusNavigation);
