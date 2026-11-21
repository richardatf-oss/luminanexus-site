(() => {
  const letters = [
    ["א", "Aleph", "throat"], ["ב", "Bet", "lips"], ["ג", "Gimel", "palate"], ["ד", "Dalet", "tongue"],
    ["ה", "Hey", "throat"], ["ו", "Vav", "lips"], ["ז", "Zayin", "teeth"], ["ח", "Chet", "throat"],
    ["ט", "Tet", "tongue"], ["י", "Yod", "palate"], ["כ", "Kaf", "palate"], ["ל", "Lamed", "tongue"],
    ["מ", "Mem", "lips"], ["נ", "Nun", "tongue"], ["ס", "Samekh", "teeth"], ["ע", "Ayin", "throat"],
    ["פ", "Peh", "lips"], ["צ", "Tsadi", "teeth"], ["ק", "Qof", "palate"], ["ר", "Resh", "teeth"],
    ["ש", "Shin", "teeth"], ["ת", "Tav", "tongue"],
  ];
  const gates = [];
  for (let left = 0; left < letters.length; left += 1) {
    for (let right = left + 1; right < letters.length; right += 1) {
      gates.push({ id: gates.length + 1, left, right });
    }
  }

  const grid = document.querySelector("#gate-grid");
  const count = document.querySelector("#gate-count");
  const search = document.querySelector("#gate-search");
  const display = document.querySelector("#pair-display");
  const pairName = document.querySelector("#pair-name");
  const pairNumber = document.querySelector("#pair-number");
  const gateMeaning = document.querySelector("#gate-meaning");
  const gateReflection = document.querySelector("#gate-reflection");
  const saveButton = document.querySelector("#save-gate");
  const savedList = document.querySelector("#saved-list");
  const savedEmpty = document.querySelector("#saved-empty");
  const savedKey = "luminanexus-231-gates-v1";
  let saved = new Set();
  let selected = 1;
  let savedOnly = false;
  try {
    const parsed = JSON.parse(localStorage.getItem(savedKey) || "[]");
    if (Array.isArray(parsed)) saved = new Set(parsed.filter(id => Number.isInteger(id) && id >= 1 && id <= gates.length));
  } catch (_) {}

  function label(gate) {
    return `${letters[gate.left][0]} · ${letters[gate.right][0]}`;
  }

  function names(gate) {
    return `${letters[gate.left][1]} · ${letters[gate.right][1]}`;
  }

  function renderSelected() {
    const gate = gates[selected - 1];
    const first = letters[gate.left];
    const second = letters[gate.right];
    const samePlace = first[2] === second[2];
    const direction = samePlace
      ? `a within-${first[2]} pairing`
      : `a ${first[2]}-to-${second[2]} path`;

    display.textContent = label(gate);
    pairName.textContent = names(gate);
    pairNumber.textContent = `Gate ${gate.id} of ${gates.length}`;
    gateMeaning.textContent =
      `In Sefer Yetzirah’s five-place articulation map (2:3), ${first[1]} is grouped at the ${first[2]} and ${second[1]} at the ${second[2]}. Read in this order, ${first[1]} → ${second[1]}, this gate offers ${direction} through speech. The reverse order, ${second[1]} → ${first[1]}, is the same gate read in the wheel’s other direction.`;
    gateReflection.textContent = samePlace
      ? `Both letters belong to the source’s ${first[2]} group. Say or identify them in a real word, then compare what changes when ${second[1]} comes first. Can you verify a word containing this adjacent pair?`
      : `Notice the shift from the ${first[2]} group to the ${second[2]} group. Try ${first[1]} → ${second[1]} and then ${second[1]} → ${first[1]}. What changes in the mouth and in the word? Verify any example in a Hebrew source.`;
    saveButton.setAttribute("aria-pressed", String(saved.has(gate.id)));
    saveButton.textContent = saved.has(gate.id) ? "Remove saved gate" : "Save this gate";
    grid.querySelectorAll(".gate-item").forEach(button => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.id) === gate.id));
    });
  }

  function renderSaved() {
    savedList.replaceChildren();
    const ids = Array.from(saved).sort((a, b) => a - b);
    savedEmpty.hidden = ids.length > 0;
    ids.forEach(id => {
      const gate = gates[id - 1];
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "saved-item";
      button.textContent = `${label(gate)} · ${names(gate)}`;
      button.setAttribute("aria-label", `Open gate ${id}: ${names(gate)}`);
      button.addEventListener("click", () => selectGate(id));
      item.append(button);
      savedList.append(item);
    });
  }

  function visibleGates() {
    const term = search.value.trim().toLocaleLowerCase();
    return gates.filter(gate => {
      if (savedOnly && !saved.has(gate.id)) return false;
      if (!term) return true;
      const lettersForPair = [letters[gate.left], letters[gate.right]];
      return lettersForPair.some(([character, name]) => character.includes(term) || name.toLocaleLowerCase().includes(term));
    });
  }

  function renderGrid() {
    const items = visibleGates();
    grid.replaceChildren();
    items.forEach(gate => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gate-item";
      button.dataset.id = String(gate.id);
      button.setAttribute("aria-pressed", String(gate.id === selected));
      button.setAttribute("aria-label", `Gate ${gate.id}: ${names(gate)}`);
      const lettersText = document.createElement("b");
      lettersText.lang = "he";
      lettersText.dir = "rtl";
      lettersText.textContent = label(gate);
      const number = document.createElement("small");
      number.textContent = `Gate ${gate.id}`;
      button.append(lettersText, number);
      button.addEventListener("click", () => selectGate(gate.id));
      grid.append(button);
    });
    count.textContent = `${items.length} ${items.length === 1 ? "gate" : "gates"}${savedOnly ? " saved" : ""}${search.value.trim() ? " match this search" : ""}`;
  }

  function persist() {
    try { localStorage.setItem(savedKey, JSON.stringify(Array.from(saved))); } catch (_) {}
    renderSaved();
    renderGrid();
    renderSelected();
  }

  function selectGate(id) {
    selected = id;
    renderSelected();
  }

  if (gates.length !== 231) throw new Error(`Expected 231 unique letter pairs, generated ${gates.length}`);

  search.addEventListener("input", renderGrid);
  document.querySelector("#random-gate").addEventListener("click", () => {
    const candidates = visibleGates();
    if (!candidates.length) {
      count.textContent = "No gates match. Clear the search or choose another view.";
      return;
    }
    selectGate(candidates[Math.floor(Math.random() * candidates.length)].id);
  });
  document.querySelector("#show-saved").addEventListener("click", event => {
    savedOnly = !savedOnly;
    event.currentTarget.setAttribute("aria-pressed", String(savedOnly));
    event.currentTarget.textContent = savedOnly ? "Show all 231 gates" : "Show saved gates";
    renderGrid();
  });
  saveButton.addEventListener("click", () => {
    if (saved.has(selected)) saved.delete(selected);
    else saved.add(selected);
    persist();
  });

  renderGrid();
  renderSaved();
  renderSelected();
})();
