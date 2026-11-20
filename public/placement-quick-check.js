(() => {
  const form = document.querySelector("#placement-form");
  const result = document.querySelector("#placement-result");
  if (!form || !result) return;

  const tracks = {
    Aleph: {
      page: "/aleph-track.html",
      pdf: "/downloads/Aleph_Track_Printable.pdf",
      cue: "Begin with direction, letter shapes, and the vowel cues. Move ahead as soon as the learner feels ready.",
    },
    Bet: {
      page: "/bet-track.html",
      pdf: "/downloads/Bet_Track_Printable.pdf",
      cue: "Practice blending familiar letters and vowel marks into syllables and words. Review any new sound before reading it independently.",
    },
    Gimel: {
      page: "/gimel-track.html",
      pdf: "/downloads/Gimel_Track_Printable.pdf",
      cue: "Read short words from right to left, explain their meaning, and build toward phrases with a teacher or study partner.",
    },
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = new FormData(form);
    const direction = answers.get("direction");
    const letters = answers.get("letters");
    const reading = answers.get("reading");
    const recommended = direction !== "right" || letters === "few"
      ? "Aleph"
      : reading === "words" ? "Gimel" : "Bet";
    const track = tracks[recommended];

    result.replaceChildren();
    const heading = document.createElement("h3");
    heading.textContent = `A gentle place to begin: ${recommended} Track`;
    const note = document.createElement("p");
    note.textContent = track.cue;
    const page = document.createElement("a");
    page.href = track.page;
    page.textContent = `Open ${recommended} lessons`;
    const pdf = document.createElement("a");
    pdf.href = track.pdf;
    pdf.textContent = `Get the ${recommended} printable`;
    result.append(heading, note, page, pdf);
    result.hidden = false;
    result.focus();
  });

  form.addEventListener("reset", () => {
    result.replaceChildren();
    result.hidden = true;
  });
})();
