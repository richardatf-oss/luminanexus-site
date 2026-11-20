(() => {
  const region = document.querySelector("#calendar-region");
  const status = document.querySelector("#portion-status");
  const current = document.querySelector("#portion-current");
  const textLink = document.querySelector("#portion-text-link");
  const manualInput = document.querySelector("#manual-portion");
  const manualButton = document.querySelector("#apply-manual-portion");
  const checks = Array.from(document.querySelectorAll("#daily-plan input[type=checkbox]"));
  const progressLabel = document.querySelector("#daily-progress");
  const progressBar = document.querySelector("#daily-progress-bar");
  const resetButton = document.querySelector("#reset-daily-progress");
  let calendarDate = new Date().toISOString().slice(0, 10);
  let currentPortion = "";
  let progressKey = "";

  function slug(value) {
    return value.toLocaleLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function renderProgress() {
    const completed = checks.filter(check => check.checked).length;
    progressLabel.textContent = `${completed} of ${checks.length} study steps complete`;
    progressBar.value = completed;
  }

  function saveProgress() {
    if (!progressKey) return;
    const values = checks.map(check => check.checked);
    try { localStorage.setItem(progressKey, JSON.stringify(values)); } catch (_) {}
    renderProgress();
  }

  function setPortion(name, href, date, label) {
    currentPortion = name.trim();
    calendarDate = date || calendarDate;
    current.textContent = `Current portion: ${currentPortion}`;
    if (href) textLink.href = href;
    progressKey = `luminanexus-noahide-daily:${region.value}:${calendarDate}:${slug(currentPortion)}`;
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(progressKey) || "[]"); } catch (_) {}
    checks.forEach((check, index) => { check.checked = Array.isArray(saved) && saved[index] === true; });
    renderProgress();
    if (label) status.textContent = label;
  }

  async function loadCalendar() {
    status.textContent = "Loading the current Torah reading from Sefaria…";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const params = new URLSearchParams({ diaspora: region.value, timezone });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(`https://www.sefaria.org/api/calendars?${params}`, { signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error(`Calendar request returned ${response.status}`);
      const payload = await response.json();
      const items = Array.isArray(payload) ? payload : payload.calendar_items;
      const parsha = Array.isArray(items) && items.find(item => item?.title?.en?.toLocaleLowerCase() === "parashat hashavua");
      if (!parsha?.displayValue?.en || !parsha?.url) throw new Error("Weekly portion not present in calendar response");
      if (manualInput.dataset.manual === "true") return;
      const href = new URL(parsha.url, "https://www.sefaria.org/").toString();
      setPortion(parsha.displayValue.en, href, payload.date, `Loaded from Sefaria’s ${region.value === "1" ? "Diaspora" : "Israel"} calendar · ${timezone}.`);
    } catch (error) {
      if (manualInput.dataset.manual === "true") return;
      current.textContent = "Current portion: choose it from the calendar below";
      status.textContent = "The calendar could not load here. Open Sefaria’s calendar, then enter the portion name below; your study plan still works.";
    } finally {
      window.clearTimeout(timeout);
    }
  }

  checks.forEach(check => check.addEventListener("change", saveProgress));
  resetButton.addEventListener("click", () => {
    checks.forEach(check => { check.checked = false; });
    saveProgress();
  });
  manualButton.addEventListener("click", () => {
    const name = manualInput.value.trim();
    if (!name) {
      manualInput.focus();
      status.textContent = "Enter a portion name, or choose a weekly reading from the Sefaria calendar.";
      return;
    }
    manualInput.dataset.manual = "true";
    setPortion(name, "https://www.sefaria.org/calendars", calendarDate, `Using your chosen portion: ${name}. The calendar link remains available for the source text.`);
  });
  region.addEventListener("change", () => {
    manualInput.dataset.manual = "false";
    manualInput.value = "";
    loadCalendar();
  });
  loadCalendar();
})();
