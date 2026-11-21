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
  const journal = document.querySelector("#reflection-journal");
  const journalPortion = document.querySelector("#journal-portion");
  const journalReference = document.querySelector("#journal-reference");
  const journalSourceLink = document.querySelector("#journal-source-link");
  const journalSourceHint = document.querySelector("#journal-source-hint");
  const journalStatus = document.querySelector("#journal-status");
  const journalFields = journal ? Array.from(journal.querySelectorAll("input, textarea")) : [];
  const printJournalButton = document.querySelector("#print-journal");
  const clearJournalButton = document.querySelector("#clear-journal");
  let calendarDate = new Date().toISOString().slice(0, 10);
  let currentPortion = "";
  let progressKey = "";
  let journalKey = "";
  let journalTimer = 0;

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

  function renderJournalSource() {
    const reference = journalReference.value.trim();
    if (!reference) {
      journalSourceLink.href = "https://www.sefaria.org/texts/Tanakh/Torah";
      journalSourceLink.textContent = "Open Torah texts on Sefaria";
      journalSourceHint.textContent = " Enter a passage reference to create a direct link.";
      return;
    }
    const normalized = reference.replace(/[–—]/g, "-");
    const parts = normalized.match(/^(.+?)\s+(\d+[ab]?)(?:\s*[:.,]\s*(.+))?$/i);
    let sefariaRef;
    if (parts) {
      const title = parts[1].trim().replace(/\s+/g, "_");
      const section = parts[3]
        ? `${parts[2]}.${parts[3].replace(/\s*[:.,]\s*/g, ".").replace(/\s+/g, ".")}`
        : parts[2];
      sefariaRef = `${title}.${section}`;
    } else {
      sefariaRef = normalized.replace(/\s+/g, "_").replace(/:/g, ".");
    }
    journalSourceLink.href = `https://www.sefaria.org/${encodeURIComponent(sefariaRef).replace(/%2E/gi, ".")}`;
    journalSourceLink.textContent = `Open ${reference} on Sefaria`;
    journalSourceHint.textContent = " Check the passage and citation on Sefaria before using it.";
  }

  function loadJournal() {
    journalPortion.textContent = currentPortion
      ? `Journal for ${currentPortion} · ${calendarDate}`
      : "Choose or enter this week’s portion above to begin.";
    journalKey = progressKey ? `${progressKey}:journal` : "";
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(journalKey) || "{}"); } catch (_) {}
    journalFields.forEach((field) => {
      field.value = typeof saved[field.id] === "string" ? saved[field.id] : "";
    });
    renderJournalSource();
    journalStatus.textContent = journalKey
      ? "Entries save locally on this device."
      : "Choose a portion first; entries will then save by portion and week.";
  }

  function saveJournal() {
    if (!journalKey) {
      journalStatus.textContent = "Choose or enter a portion above before saving a journal.";
      return;
    }
    const values = Object.fromEntries(journalFields.map((field) => [field.id, field.value]));
    try {
      localStorage.setItem(journalKey, JSON.stringify(values));
      journalStatus.textContent = "Journal saved on this device.";
    } catch (_) {
      journalStatus.textContent = "The journal remains open on this page, but this browser could not save it.";
    }
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
    loadJournal();
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
  journalFields.forEach((field) => field.addEventListener("input", () => {
    if (field === journalReference) renderJournalSource();
    window.clearTimeout(journalTimer);
    journalStatus.textContent = "Saving journal…";
    journalTimer = window.setTimeout(saveJournal, 300);
  }));
  printJournalButton.addEventListener("click", () => window.print());
  clearJournalButton.addEventListener("click", () => {
    window.clearTimeout(journalTimer);
    journalFields.forEach((field) => { field.value = ""; });
    if (journalKey) {
      try { localStorage.removeItem(journalKey); } catch (_) {}
    }
    renderJournalSource();
    journalStatus.textContent = "This portion’s journal has been cleared from this device.";
    journalReference.focus();
  });
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
