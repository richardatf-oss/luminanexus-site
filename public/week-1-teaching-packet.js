(() => {
  const select = document.querySelector("#track-choice");
  const cards = [...document.querySelectorAll(".track-activity")];
  const status = document.querySelector("#track-status");
  const checks = [...document.querySelectorAll("[data-prep]")];
  const progressLabel = document.querySelector("#prep-progress");
  const progressBar = document.querySelector("#prep-bar");
  const notes = document.querySelector("#teacher-notes");
  const notesStatus = document.querySelector("#notes-status");
  const saveStatus = document.querySelector("#save-status");
  const key = "luminanexus-week1-preparation";
  const notesKey = "luminanexus-week1-teacher-notes";

  function renderTrack() {
    const choice = select.value;
    cards.forEach((card) => {
      card.hidden = choice !== "all" && card.dataset.track !== choice;
    });
    const label = choice === "all" ? "all three learning doorways" : `${choice[0].toUpperCase()}${choice.slice(1)} activities`;
    status.textContent = `Showing ${label}.`;
  }

  function renderPrep() {
    const count = checks.filter((check) => check.checked).length;
    progressLabel.textContent = `${count} of ${checks.length} ready`;
    progressBar.value = count;
    try {
      localStorage.setItem(key, JSON.stringify(checks.map((check) => check.checked)));
      saveStatus.textContent = "Checklist saved on this device.";
    } catch (_) {
      saveStatus.textContent = "Progress is available while this page is open; this browser could not save it.";
    }
  }

  try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    checks.forEach((check, index) => { check.checked = saved[index] === true; });
  } catch (_) {}
  checks.forEach((check) => check.addEventListener("change", renderPrep));
  document.querySelector("#reset-prep").addEventListener("click", () => {
    checks.forEach((check) => { check.checked = false; });
    renderPrep();
  });
  select.addEventListener("change", renderTrack);
  document.querySelector("#show-all").addEventListener("click", () => {
    select.value = "all";
    renderTrack();
  });
  try { notes.value = localStorage.getItem(notesKey) || ""; } catch (_) {}
  let noteTimer;
  notes.addEventListener("input", () => {
    window.clearTimeout(noteTimer);
    notesStatus.textContent = "Saving notes on this device…";
    noteTimer = window.setTimeout(() => {
      try {
        localStorage.setItem(notesKey, notes.value);
        notesStatus.textContent = "Notes saved on this device.";
      } catch (_) {
        notesStatus.textContent = "Notes remain here while this page is open; this browser could not save them.";
      }
    }, 250);
  });
  document.querySelector("#clear-notes").addEventListener("click", () => {
    notes.value = "";
    try { localStorage.removeItem(notesKey); } catch (_) {}
    notesStatus.textContent = "Notes cleared from this device.";
    notes.focus();
  });
  renderTrack();
  renderPrep();
})();
