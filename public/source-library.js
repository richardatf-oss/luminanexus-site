(() => {
  const form = document.querySelector("#library-filter");
  const search = document.querySelector("#library-search");
  const category = document.querySelector("#library-category");
  const level = document.querySelector("#library-level");
  const progressFilter = document.querySelector("#library-progress-filter");
  const status = document.querySelector("#library-filter-status");
  const empty = document.querySelector("#library-empty");
  const cards = Array.from(document.querySelectorAll(".source-card[data-study-id]"));
  const buttons = Array.from(document.querySelectorAll("[data-completion]"));
  const progressLabel = document.querySelector("#library-progress-label");
  const progressBar = document.querySelector("#library-progress-bar");
  const nextButton = document.querySelector("#library-show-unexplored");
  const clearButton = document.querySelector("#library-clear-progress");
  const storageKey = "luminanexus-source-library-progress-v1";

  if (!form || !search || !category || !level || !progressFilter || !status || cards.length === 0) return;

  let explored = {};
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) explored = saved;
  } catch (_) {}

  function fold(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  }

  function saveProgress() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(explored));
      progressLabel.dataset.storage = "saved";
    } catch (_) {
      progressLabel.dataset.storage = "unavailable";
    }
  }

  function updateButtons() {
    buttons.forEach((button) => {
      const isExplored = explored[button.dataset.completion] === true;
      button.setAttribute("aria-pressed", String(isExplored));
      button.textContent = isExplored ? "Explored · click to undo" : "Mark explored";
      button.closest(".source-card")?.classList.toggle("is-explored", isExplored);
    });
  }

  function updateProgress() {
    const count = cards.filter((card) => explored[card.dataset.studyId] === true).length;
    progressLabel.textContent = `${count} of ${cards.length} cards explored`;
    progressBar.max = cards.length;
    progressBar.value = count;
    nextButton.textContent = count === cards.length ? "All cards explored" : "Next unexplored";
  }

  function filterCards() {
    const query = fold(search.value.trim());
    const topic = category.value;
    const readiness = level.value;
    const progress = progressFilter.value;
    let visible = 0;
    cards.forEach((card) => {
      const matchesText = !query || fold(card.textContent).includes(query);
      const categories = (card.dataset.categories || "").split(/\s+/);
      const levels = (card.dataset.level || "").split(/\s+/);
      const isExplored = explored[card.dataset.studyId] === true;
      const matchesTopic = topic === "all" || categories.includes(topic);
      const matchesLevel = readiness === "all" || levels.includes(readiness);
      const matchesProgress = progress === "all" || (progress === "explored" ? isExplored : !isExplored);
      card.hidden = !(matchesText && matchesTopic && matchesLevel && matchesProgress);
      if (!card.hidden) visible += 1;
    });
    const totalExplored = cards.filter((card) => explored[card.dataset.studyId] === true).length;
    const storageNote = progressLabel.dataset.storage === "unavailable" ? " Progress cannot be saved in this browser." : "";
    status.textContent = `Showing ${visible} of ${cards.length} cards · ${totalExplored} explored.${storageNote}`;
    empty.hidden = visible > 0;
  }

  function resetFilters() {
    search.value = "";
    category.value = "all";
    level.value = "all";
    progressFilter.value = "all";
    filterCards();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.completion;
      explored[id] = explored[id] !== true;
      if (!explored[id]) delete explored[id];
      saveProgress();
      updateButtons();
      updateProgress();
      filterCards();
      if (button.closest(".source-card").hidden) {
        const nextVisible = cards.find((card) => !card.hidden);
        (nextVisible?.querySelector("[data-completion]") || progressFilter).focus();
      }
    });
  });

  form.addEventListener("input", filterCards);
  form.addEventListener("change", filterCards);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterCards();
  });
  form.addEventListener("reset", () => window.setTimeout(filterCards, 0));

  nextButton.addEventListener("click", () => {
    resetFilters();
    const card = cards.find((item) => explored[item.dataset.studyId] !== true);
    if (!card) {
      status.textContent = "You have explored all the study cards. You can reset progress to begin again.";
      clearButton.focus();
      return;
    }
    const details = card.querySelector("details");
    if (details) details.open = true;
    const summary = card.querySelector("summary");
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    card.scrollIntoView({ behavior, block: "center" });
    window.setTimeout(() => summary?.focus(), behavior === "smooth" ? 250 : 0);
  });

  clearButton.addEventListener("click", () => {
    explored = {};
    progressFilter.value = "all";
    try { localStorage.removeItem(storageKey); } catch (_) {}
    updateButtons();
    updateProgress();
    filterCards();
    status.textContent = "Study progress cleared on this device.";
  });

  updateButtons();
  updateProgress();
  filterCards();
  if (progressLabel.dataset.storage === "unavailable") {
    status.textContent = "Progress is available while this page is open, but this browser could not save it.";
  }
})();
