(() => {
  const form = document.querySelector("#library-filter");
  const search = document.querySelector("#library-search");
  const category = document.querySelector("#library-category");
  const status = document.querySelector("#library-filter-status");
  const cards = Array.from(document.querySelectorAll(".source-card"));
  if (!form || !search || !category || !status) return;

  function filterCards() {
    const query = search.value.trim().toLocaleLowerCase();
    const topic = category.value;
    let visible = 0;
    cards.forEach((card) => {
      const matchesText = !query || card.textContent.toLocaleLowerCase().includes(query);
      const categories = (card.dataset.categories || "").split(/\s+/);
      const matchesCategory = topic === "all" || categories.includes(topic);
      card.hidden = !(matchesText && matchesCategory);
      if (!card.hidden) visible += 1;
    });
    status.textContent = `Showing ${visible} of ${cards.length} pathways and sources.`;
  }

  search.addEventListener("input", filterCards);
  category.addEventListener("change", filterCards);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterCards();
  });
  form.addEventListener("reset", () => window.setTimeout(filterCards, 0));
  filterCards();
})();
