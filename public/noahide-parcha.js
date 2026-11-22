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
  const journalFields = journal ? Array.from(journal.querySelectorAll("input, textarea, select")) : [];
  const printJournalButton = document.querySelector("#print-journal");
  const clearJournalButton = document.querySelector("#clear-journal");
  let calendarDate = new Date().toISOString().slice(0, 10);
  let currentPortion = "";
  let progressKey = "";
  let journalKey = "";
  let journalTimer = 0;
  let calendarSequence = 0;
  let calendarController = null;
  let passageSequence = 0;
  let passageController = null;
  let weekly = null;
  let selectedReference = '';
  let loadedLocalDate = '';
  const weeklyPanel = document.querySelector('#weekly-study');
  const readingDay = document.querySelector('#weekly-reading-day');
  const passageStatus = document.querySelector('#weekly-passage-status');
  const passageBody = document.querySelector('#weekly-passage');
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  try { if (localStorage.getItem('luminanexus-reading-region') === '0') region.value = '0'; } catch (_) {}

  function localDate() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: timezone, year:'numeric', month:'2-digit', day:'2-digit' }).formatToParts(new Date()).map(p => [p.type,p.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function weekEnd() {
    const day = new Date(`${localDate()}T12:00:00Z`);
    day.setUTCDate(day.getUTCDate() + 6 - day.getUTCDay());
    return day.toISOString().slice(0,10);
  }

  function sourceUrl(ref) {
    return 'https://www.sefaria.org/' + encodeURIComponent(ref.replaceAll(' ','_').replaceAll(':','.'));
  }

  function plainText(value) {
    const decoder = document.createElement('textarea');
    return (Array.isArray(value) ? value.flat(Infinity) : [value]).filter(item => typeof item === 'string').map(item => {
      decoder.innerHTML = item.replace(/<[^>]*>/g, '');
      return decoder.value.replace(/\[([^\]]+)\]\(https?:[^)]+\)/g, '$1');
    }).join('\n\n').trim();
  }

  function chavrutaLink(reference = '') {
    const question = currentPortion ? `Help me study ${currentPortion}${reference ? `, ${reference}` : ''} from a Noahide perspective. Explain the passage, distinguish commentary from reflection, and give me one practical question.` : "Help me study this week's parsha from a Noahide perspective.";
    return '/?' + new URLSearchParams({chavrutaMode:'noahide-parcha', chavrutaQuestion:question}) + '#chavruta';
  }

  function updateStudyLinks() {
    document.querySelectorAll('a[href*="chavrutaMode=noahide-parcha"]').forEach(link => { link.href = chavrutaLink(selectedReference); });
  }

  async function readWeeklyPassage() {
    const request = ++passageSequence;
    passageController?.abort();
    const controller = new AbortController(); passageController = controller;
    selectedReference = readingDay.value;
    const reference = selectedReference;
    passageBody.hidden = true;
    passageStatus.textContent = `Opening ${reference}…`;
    document.querySelector('#weekly-passage-link').href = sourceUrl(reference);
    document.querySelector('#weekly-passage-link').textContent = `Read ${reference} with commentary on Sefaria`;
    document.querySelector('#weekly-study-prompt').textContent = `Today’s starting point: read a few verses from ${reference}, then write one observation and one question.`;
    updateStudyLinks();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('/.netlify/functions/sefaria?' + new URLSearchParams({ref:reference}), {signal:controller.signal});
      if (!response.ok) throw Error('Passage unavailable');
      const data = await response.json(); if (request !== passageSequence) return;
      const he = plainText(data.he), en = plainText(data.en);
      if (!he && !en) throw Error('No text returned');
      const hebrew = document.querySelector('#weekly-hebrew');
      hebrew.textContent = he || 'No Hebrew text is available for this edition.';
      hebrew.lang = he ? 'he' : 'en'; hebrew.dir = he ? 'rtl' : 'ltr';
      document.querySelector('#weekly-english').textContent = en || 'No English translation is available in this edition. Open Sefaria to choose another.';
      passageBody.hidden = false;
      passageStatus.textContent = `${reference} is ready to study.`;
    } catch (_) {
      if (request === passageSequence) passageStatus.textContent = 'The passage could not load here. Open the source link below and use the study prompts; the verified weekly reading is still shown above.';
    } finally { clearTimeout(timeout); }
  }

  function showWeeklyStudy(data) {
    weekly = data;
    document.querySelector('#weekly-study-heading').textContent = `Study ${data.name} This Week`;
    document.querySelector('#weekly-reading-range').textContent = `${data.ref} · Shabbat ${data.shabbat}`;
    document.querySelector('#weekly-overview').textContent = plainText(data.description) || 'Read the source passage in its surrounding context.';
    readingDay.replaceChildren();
    data.readings.forEach((ref,index) => { const option = document.createElement('option'); option.value = ref; option.textContent = `${data.readings.length === 7 ? `Section ${index+1}` : 'Weekly reading'} · ${ref}`; readingDay.append(option); });
    readingDay.selectedIndex = Math.min(data.studyDay-1, data.readings.length-1);
    weeklyPanel.hidden = false;
    readWeeklyPassage();
  }

  function slug(value) {
    return value.toLocaleLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function storedWeekValue(suffix, fallback) {
    try {
      const saved = localStorage.getItem(progressKey + suffix);
      if (saved !== null) return JSON.parse(saved);
      // Older versions saved by day. Reopen the most recent entry from this week.
      const start = new Date(`${calendarDate}T12:00:00Z`); start.setUTCDate(start.getUTCDate()-6);
      const firstDate = start.toISOString().slice(0,10);
      const prefix = `luminanexus-noahide-daily:${region.value}:`;
      const ending = `:${slug(currentPortion)}${suffix}`;
      const candidates = Object.keys(localStorage).filter(key => key.startsWith(prefix) && key.endsWith(ending)).filter(key => {
        const date = key.slice(prefix.length, prefix.length+10); return date >= firstDate && date <= calendarDate;
      }).sort().reverse();
      if (candidates.length) return JSON.parse(localStorage.getItem(candidates[0]));
    } catch (_) {}
    return fallback;
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
    if (progressKey) saved = storedWeekValue(':journal', {});
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
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
    window.clearTimeout(journalTimer);
    if (journalKey) saveJournal();
    currentPortion = name.trim();
    calendarDate = date || weekEnd();
    current.textContent = `Current portion: ${currentPortion}`;
    if (href) textLink.href = href;
    progressKey = `luminanexus-noahide-daily:${region.value}:${calendarDate}:${slug(currentPortion)}`;
    let saved = [];
    saved = storedWeekValue('', []);
    checks.forEach((check, index) => { check.checked = Array.isArray(saved) && saved[index] === true; });
    renderProgress();
    loadJournal();
    updateStudyLinks();
    if (label) status.textContent = label;
  }

  async function loadCalendar() {
    const request = ++calendarSequence;
    calendarController?.abort();
    const controller = new AbortController(); calendarController = controller;
    passageSequence++; passageController?.abort();
    weeklyPanel.hidden = true; weekly = null; selectedReference = '';
    current.textContent = 'Current portion: checking this week’s calendar';
    status.textContent = "Loading the current Torah reading from Sefaria…";
    const params = new URLSearchParams({ diaspora: region.value, timezone });
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(`/.netlify/functions/weekly-portion?${params}`, { signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error(`Calendar request returned ${response.status}`);
      const payload = await response.json();
      if (request !== calendarSequence || manualInput.dataset.manual === 'true') return;
      if (!payload.name || !payload.ref || !Array.isArray(payload.readings) || !payload.readings.length) throw Error('No weekly reading returned');
      loadedLocalDate = payload.date;
      setPortion(payload.name, sourceUrl(payload.ref), payload.shabbat, `Verified for Shabbat ${payload.shabbat} · Sefaria ${region.value === "1" ? "Diaspora" : "Israel"} calendar · ${timezone}.`);
      textLink.textContent = `Open all of ${payload.name} on Sefaria`;
      showWeeklyStudy(payload);
    } catch (error) {
      if (request !== calendarSequence || manualInput.dataset.manual === 'true') return;
      current.textContent = "Current portion: choose it from the calendar below";
      textLink.href = 'https://www.sefaria.org/calendars'; textLink.textContent = 'Open the Sefaria weekly calendar';
      status.textContent = "The current reading could not be verified. Refresh to retry, or open Sefaria’s calendar and enter its portion below; your journal is still available.";
    } finally {
      window.clearTimeout(timeout);
    }
  }

  checks.forEach(check => check.addEventListener("change", saveProgress));
  function scheduleJournalSave(field) {
    if (field === journalReference) renderJournalSource();
    window.clearTimeout(journalTimer);
    journalStatus.textContent = "Saving journal…";
    journalTimer = window.setTimeout(saveJournal, 300);
  }
  journalFields.forEach((field) => {
    field.addEventListener("input", () => scheduleJournalSave(field));
    field.addEventListener("change", () => scheduleJournalSave(field));
  });
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
    calendarSequence++; calendarController?.abort(); passageSequence++; passageController?.abort();
    weeklyPanel.hidden = true; weekly = null; selectedReference = '';
    textLink.textContent = 'Open the Sefaria weekly calendar';
    setPortion(name, "https://www.sefaria.org/calendars", weekEnd(), `Using your chosen portion: ${name}. The calendar link remains available for the source text.`);
  });
  region.addEventListener("change", () => {
    try { localStorage.setItem('luminanexus-reading-region', region.value); } catch (_) {}
    manualInput.dataset.manual = "false";
    manualInput.value = "";
    loadCalendar();
  });
  readingDay.addEventListener('change', readWeeklyPassage);
  document.querySelector('#refresh-weekly-portion').addEventListener('click', () => {
    manualInput.dataset.manual = 'false'; manualInput.value = ''; loadCalendar();
  });
  document.querySelector('#weekly-use-passage').addEventListener('click', () => {
    if (!selectedReference) return;
    journalReference.value = selectedReference; renderJournalSource(); saveJournal();
    document.querySelector('#reflection-journal-section').scrollIntoView({block:'start'}); journalReference.focus({preventScroll:true});
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && manualInput.dataset.manual !== 'true' && loadedLocalDate !== localDate()) loadCalendar();
  });
  document.querySelectorAll("[data-journal-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const field = document.getElementById(button.dataset.journalTarget);
      if (!field) return;
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      document.querySelector("#reflection-journal-section").scrollIntoView({ behavior, block: "start" });
      window.setTimeout(() => field.focus(), 250);
      journalStatus.textContent = `Day ${button.closest(".day-card").querySelector("input[data-day]").dataset.day}: add your note below.`;
    });
  });
  loadJournal();
  loadCalendar();
})();
