(function () {
  const yearSpanList = document.querySelectorAll("#year");
  const year = new Date().getFullYear();
  yearSpanList.forEach((el) => (el.textContent = year));
  // Later you can add:
  // - Sefaria URL construction
  // - ChavrutaGPT fetch() calls to Netlify functions
  // - Simple UI enhancements
})();
