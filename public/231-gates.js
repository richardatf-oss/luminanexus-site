(() => {
  // Letter classes and correspondences follow one Gra Version of Sefer Yetzirah.
  // These are source associations for contemplation, not fixed definitions of individual gates.
  const letters = [
    ["א", "Aleph", "throat", "Mother", "breath · air", "temperate · chest"],
    ["ב", "Bet", "lips", "Double", "wisdom ↔ folly", "Moon · Sunday · right eye"],
    ["ג", "Gimel", "palate", "Double", "wealth ↔ poverty", "Mars · Monday · right ear"],
    ["ד", "Dalet", "tongue", "Double", "seed ↔ barrenness", "Sun · Tuesday · right nostril"],
    ["ה", "Hey", "throat", "Simple", "speech", "Aries · Nisan · right foot"],
    ["ו", "Vav", "lips", "Simple", "thought", "Taurus · Iyar · right kidney"],
    ["ז", "Zayin", "teeth", "Simple", "motion", "Gemini · Sivan · left foot"],
    ["ח", "Chet", "throat", "Simple", "sight", "Cancer · Tammuz · right hand"],
    ["ט", "Tet", "tongue", "Simple", "hearing", "Leo · Av · left kidney"],
    ["י", "Yod", "palate", "Simple", "action", "Virgo · Elul · left hand"],
    ["כ", "Kaf", "palate", "Double", "life ↔ death", "Venus · Wednesday · left eye"],
    ["ל", "Lamed", "tongue", "Simple", "intimacy", "Libra · Tishrei · gall"],
    ["מ", "Mem", "lips", "Mother", "water", "cold · belly"],
    ["נ", "Nun", "tongue", "Simple", "smell", "Scorpio · Cheshvan · small intestine"],
    ["ס", "Samekh", "teeth", "Simple", "sleep", "Sagittarius · Kislev · stomach"],
    ["ע", "Ayin", "throat", "Simple", "agitation", "Capricorn · Tevet · liver"],
    ["פ", "Peh", "lips", "Double", "dominion ↔ servitude", "Mercury · Thursday · left ear"],
    ["צ", "Tsadi", "teeth", "Simple", "taste / ingestion", "Aquarius · Shevat · gizzard"],
    ["ק", "Qof", "palate", "Simple", "laughter", "Pisces · Adar · spleen"],
    ["ר", "Resh", "teeth", "Double", "peace ↔ war", "Saturn · Friday · left nostril"],
    ["ש", "Shin", "teeth", "Mother", "fire", "hot · head"],
    ["ת", "Tav", "tongue", "Double", "grace ↔ ugliness", "Jupiter · Shabbat · mouth"],
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
  const gateCorrespondences = document.querySelector("#gate-correspondences");
  const gateMysticism = document.querySelector("#gate-mysticism");
  const mysticQuestion = document.querySelector("#mystic-question");
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

  function mysticalReading(first, second) {
    const firstClass = first[3];
    const secondClass = second[3];
    const firstTheme = first[4].split(" ↔ ")[0];
    const secondTheme = second[4].split(" ↔ ")[0];
    const firstShadow = first[4].split(" ↔ ")[1];
    const secondShadow = second[4].split(" ↔ ")[1];
    let scene;
    let question;

    if (firstClass === "Mother" && secondClass === "Mother") {
      scene = `Let ${firstTheme} and ${secondTheme} meet in the first deep of creation. The Gra Version places these Mother-currents in a world of elemental balance.`;
      question = "What new balance might arise when these forces meet, and what must remain distinct?";
    } else if ((firstClass === "Mother" && secondClass === "Double") || (firstClass === "Double" && secondClass === "Mother")) {
      const element = firstClass === "Mother" ? first : second;
      const power = firstClass === "Double" ? first : second;
      const theme = power[4].split(" ↔ ")[0];
      const shadow = power[4].split(" ↔ ")[1];
      scene = `Let ${element[4]} breathe through ${theme}. The paired shadow, ${shadow}, belongs to this current too; the gate asks how a power can create without becoming its opposite.`;
      question = `Where do you sense ${theme} and ${shadow} as two sides of one human possibility?`;
    } else if ((firstClass === "Mother" && secondClass === "Simple") || (firstClass === "Simple" && secondClass === "Mother")) {
      const element = firstClass === "Mother" ? first : second;
      const faculty = firstClass === "Simple" ? first : second;
      scene = `Let ${element[4]} enter the vessel of ${faculty[4]}. Here a cosmic current becomes a human act, perception, or inward movement.`;
      question = `How might ${element[4]} illuminate ${faculty[4]} in an ordinary moment of life?`;
    } else if (firstClass === "Double" && secondClass === "Double") {
      scene = `Set ${firstTheme} beside ${secondTheme} in the turning wheel. Their shadows—${firstShadow} and ${secondShadow}—form two mirrors around the meeting.`;
      question = `What balance could hold ${firstTheme} with ${secondTheme} while acknowledging ${firstShadow} and ${secondShadow}?`;
    } else if ((firstClass === "Double" && secondClass === "Simple") || (firstClass === "Simple" && secondClass === "Double")) {
      const power = firstClass === "Double" ? first : second;
      const faculty = firstClass === "Simple" ? first : second;
      const theme = power[4].split(" ↔ ")[0];
      const shadow = power[4].split(" ↔ ")[1];
      scene = `Let ${theme} descend through ${faculty[4]}. Its shadow, ${shadow}, asks the faculty to become discerning rather than automatic.`;
      question = `How might ${theme} be expressed through ${faculty[4]} while staying awake to ${shadow}?`;
    } else {
      scene = `Let ${first[4]} become a doorway into ${second[4]}; two faculties of the soul touch across one threshold.`;
      question = `What message might pass from ${first[4]} into ${second[4]}—and what is revealed when the order turns?`;
    }

    return {
      scene: `LuminaNexus contemplation—not a fixed definition assigned to this gate: ${first[1]} (${first[4]}) meets ${second[1]} (${second[4]}). ${scene}`,
      question,
    };
  }

  function renderSelected() {
    const gate = gates[selected - 1];
    const first = letters[gate.left];
    const second = letters[gate.right];
    const samePlace = first[2] === second[2];
    const direction = samePlace
      ? `a within-${first[2]} pairing`
      : `a ${first[2]}-to-${second[2]} path`;
    const reflection = mysticalReading(first, second);

    display.textContent = label(gate);
    pairName.textContent = names(gate);
    pairNumber.textContent = `Gate ${gate.id} of ${gates.length}`;
    gateMeaning.textContent =
      `In Sefer Yetzirah’s five-place articulation map (2:3), ${first[1]} is grouped at the ${first[2]} and ${second[1]} at the ${second[2]}. Read in this order, ${first[1]} → ${second[1]}, this gate offers ${direction} through speech. The reverse order, ${second[1]} → ${first[1]}, is the same gate read in the wheel’s other direction.`;
    gateReflection.textContent = samePlace
      ? `Both letters belong to the source’s ${first[2]} group. Say or identify them in a real word, then compare what changes when ${second[1]} comes first. Can you verify a word containing this adjacent pair?`
      : `Notice the shift from the ${first[2]} group to the ${second[2]} group. Try ${first[1]} → ${second[1]} and then ${second[1]} → ${first[1]}. What changes in the mouth and in the word? Verify any example in a Hebrew source.`;
    gateCorrespondences.textContent =
      `${first[1]} — ${first[3]}: ${first[4]}; ${first[5]}. ${second[1]} — ${second[3]}: ${second[4]}; ${second[5]}. These correspondences follow the Gra Version of Sefer Yetzirah; other recensions and translations differ.`;
    gateMysticism.textContent = reflection.scene;
    mysticQuestion.textContent = reflection.question;
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
