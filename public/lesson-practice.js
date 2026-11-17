document.querySelectorAll(".practice-check").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const selected = form.querySelector("input:checked");
    const feedback = form.querySelector(".practice-feedback");
    if (!selected) { feedback.textContent = "Choose an answer first. Take your time."; return; }
    feedback.textContent = selected.value === form.dataset.answer ? form.dataset.correct : form.dataset.retry;
  });
});
