(() => {
  const forms = Array.from(document.querySelectorAll(".practice-check"));
  const cardData = [
    { question: "Which way do Hebrew words begin?", answer: "Begin at the right and move toward the left." },
    { question: "What does Aleph look like?", answer: "א — Aleph is the first Hebrew letter. In this beginning lesson, it is one of the quiet letters." },
    { question: "What does Ayin look like?", answer: "ע — Ayin is another quiet letter introduced in this lesson." },
    { question: "What do the two Stick Vowels teach here?", answer: "Both are taught as “ahhh.” The lesson helps you notice the difference between אַ and אָ." },
    { question: "How can you spot Bet?", answer: "בּ has a dot inside. The letter ב without the dot is Vet in this lesson." },
    { question: "What is the Pea Vowel?", answer: "A single dot beneath the letter. אִ shows the Pea Vowel and says “eee” in this lesson." }
  ];
  const storageKey = "ivrit-haor-aleph-practice-v1";
  let saved = { checks: [], cards: [] };
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
    saved.checks = Array.isArray(parsed.checks) ? parsed.checks : [];
    saved.cards = Array.isArray(parsed.cards) ? parsed.cards : [];
  } catch (_) {}

  const panel = document.createElement("section");
  panel.id = "aleph-practice";
  panel.className = "aleph-interactive card";
  panel.setAttribute("aria-labelledby", "aleph-practice-title");
  panel.innerHTML = '<p class="eyebrow">Try it as you learn</p><h2 id="aleph-practice-title">Aleph Track Practice</h2><p>Answer the lesson checks and use the recall cards. Your progress is saved in this browser, so you can return later. It is only a learning aid; you can revisit any part whenever you like.</p><div class="aleph-progress"><div class="aleph-progress-heading"><strong id="aleph-progress-label">0 practice steps complete</strong><button class="aleph-reset" type="button">Reset my progress</button></div><progress id="aleph-progress-bar" max="1" value="0" aria-label="Aleph Track practice progress"></progress></div><div class="aleph-flashcards"><h3>Recall cards</h3><p>Try to remember the answer, then reveal it. Mark a card “I know it” when you feel ready.</p><div class="aleph-card-grid"></div></div>';
  const firstCard = document.querySelector("main > section.card");
  if (firstCard) firstCard.insertAdjacentElement("afterend", panel);

  const route = document.querySelector(".lesson-route");
  if (route && !route.querySelector('a[href="#aleph-practice"]')) {
    const link = document.createElement("a");
    link.href = "#aleph-practice";
    link.textContent = "Quick Practice";
    route.prepend(link);
  }

  forms.forEach((form, index) => {
    form.dataset.practiceIndex = String(index);
    const feedback = form.querySelector(".practice-feedback");
    form.addEventListener("submit", event => {
      event.preventDefault();
      const selected = form.querySelector("input:checked");
      if (!selected) {
        feedback.textContent = "Choose an answer first. Take your time.";
        return;
      }
      const correct = selected.value === form.dataset.answer;
      feedback.textContent = correct ? form.dataset.correct : form.dataset.retry;
      form.classList.toggle("is-correct", correct);
      if (correct) {
        saved.checks[index] = true;
        save();
        renderProgress();
      }
    });
    form.addEventListener("change", () => {
      if (feedback.textContent && feedback.textContent !== "Choose an answer first. Take your time.") feedback.textContent = "";
      form.classList.remove("is-correct");
    });
  });

  const grid = panel.querySelector(".aleph-card-grid");
  cardData.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "aleph-recall-card";
    const title = document.createElement("h4");
    title.textContent = "Card " + (index + 1);
    const question = document.createElement("p");
    question.className = "aleph-card-question";
    question.textContent = item.question;
    const answer = document.createElement("p");
    answer.className = "aleph-card-answer";
    answer.textContent = item.answer;
    answer.hidden = true;
    const reveal = document.createElement("button");
    reveal.type = "button";
    reveal.className = "aleph-reveal";
    reveal.textContent = "Show answer";
    reveal.setAttribute("aria-expanded", "false");
    const mastered = document.createElement("button");
    mastered.type = "button";
    mastered.className = "aleph-mastered";
    mastered.hidden = true;
    function syncCard() {
      const knows = saved.cards[index] === true;
      card.classList.toggle("is-mastered", knows);
      mastered.textContent = knows ? "Review again" : "I know it";
      mastered.setAttribute("aria-pressed", String(knows));
    }
    reveal.addEventListener("click", () => {
      answer.hidden = !answer.hidden;
      reveal.textContent = answer.hidden ? "Show answer" : "Hide answer";
      reveal.setAttribute("aria-expanded", String(!answer.hidden));
      mastered.hidden = answer.hidden;
      if (!answer.hidden) mastered.focus();
    });
    mastered.addEventListener("click", () => {
      saved.cards[index] = saved.cards[index] !== true;
      save();
      syncCard();
      renderProgress();
    });
    card.append(title, question, answer, reveal, mastered);
    grid.append(card);
    syncCard();
  });

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch (_) {}
  }
  function renderProgress() {
    const total = forms.length + cardData.length;
    const completed = forms.reduce((sum, _, i) => sum + (saved.checks[i] === true ? 1 : 0), 0)
      + cardData.reduce((sum, _, i) => sum + (saved.cards[i] === true ? 1 : 0), 0);
    const bar = panel.querySelector("#aleph-progress-bar");
    bar.max = total || 1;
    bar.value = completed;
    panel.querySelector("#aleph-progress-label").textContent = completed + " of " + total + " practice steps complete";
  }
  panel.querySelector(".aleph-reset").addEventListener("click", () => {
    saved = { checks: [], cards: [] };
    forms.forEach(form => {
      form.classList.remove("is-correct");
      const feedback = form.querySelector(".practice-feedback");
      if (feedback) feedback.textContent = "";
      form.querySelectorAll("input").forEach(input => { input.checked = false; });
    });
    panel.querySelectorAll(".aleph-recall-card").forEach((card, index) => {
      const answer = card.querySelector(".aleph-card-answer");
      const reveal = card.querySelector(".aleph-reveal");
      const mastered = card.querySelector(".aleph-mastered");
      answer.hidden = true;
      reveal.textContent = "Show answer";
      reveal.setAttribute("aria-expanded", "false");
      mastered.hidden = true;
      card.classList.remove("is-mastered");
      mastered.textContent = "I know it";
      mastered.setAttribute("aria-pressed", "false");
    });
    save();
    renderProgress();
    panel.querySelector("#aleph-progress-label").focus?.();
  });
  renderProgress();
})();