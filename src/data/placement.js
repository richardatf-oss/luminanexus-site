// Foundational skills cannot be replaced by stronger answers elsewhere.
export function chooseTrackKey(scores) {
  if (!Array.isArray(scores) || scores.length !== 5 || scores.some(s => !Number.isInteger(s) || s < 0 || s > 2)) return "Aleph";
  const [direction, letters, words, letterCheck, readingCheck] = scores;
  if (direction < 1 || letters < 1 || letterCheck !== 2) return "Aleph";
  if (direction === 2 && letters === 2 && words === 2 && readingCheck === 2) return "Gimel";
  return "Bet";
}
