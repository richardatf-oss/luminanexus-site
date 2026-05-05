export const roots = [
  {
    id: 'ahav',
    root: 'אהב',
    transliteration: 'Ahav',
    meaning: 'love, affection, devotion',
    sefirot: ['Chesed', 'Tiferet'],
    letters: [
      { letter: 'א', name: 'Aleph', sense: 'source, unity, hidden breath' },
      { letter: 'ה', name: 'Hei', sense: 'revelation, breath, opening' },
      { letter: 'ב', name: 'Bet', sense: 'house, relationship, dwelling' },
    ],
    refs: ['Genesis 22:2', 'Leviticus 19:18', 'Deuteronomy 6:5'],
    insight:
      'אהב begins in hidden unity, opens through breath, and comes to dwell in relationship. Love is not merely feeling; it is source becoming covenantal presence.',
  },
  {
    id: 'chesed',
    root: 'חסד',
    transliteration: 'Chesed',
    meaning: 'lovingkindness, covenantal mercy, faithful goodness',
    sefirot: ['Chesed', 'Tiferet'],
    letters: [
      { letter: 'ח', name: 'Chet', sense: 'life, enclosure, threshold' },
      { letter: 'ס', name: 'Samekh', sense: 'support, surrounding, sustaining' },
      { letter: 'ד', name: 'Dalet', sense: 'door, humility, opening' },
    ],
    refs: ['Genesis 24:12', 'Exodus 34:6', 'Micah 6:8'],
    insight:
      'חסד is mercy made durable. It surrounds, sustains, and opens a door where relationship can live.',
  },
  {
    id: 'emet',
    root: 'אמת',
    transliteration: 'Emet',
    meaning: 'truth, firmness, faithfulness',
    sefirot: ['Tiferet'],
    letters: [
      { letter: 'א', name: 'Aleph', sense: 'beginning, unity, source' },
      { letter: 'מ', name: 'Mem', sense: 'water, depth, formation' },
      { letter: 'ת', name: 'Tav', sense: 'seal, completion, covenant mark' },
    ],
    refs: ['Genesis 24:27', 'Exodus 34:6', 'Psalms 119:160'],
    insight:
      'אמת stretches from Aleph toward Tav: truth as wholeness, not fragment. It begins in unity, passes through depth, and becomes sealed in completion.',
  },
  {
    id: 'or',
    root: 'אור',
    transliteration: 'Or',
    meaning: 'light, illumination, revealed radiance',
    sefirot: ['Chokhmah', 'Tiferet'],
    letters: [
      { letter: 'א', name: 'Aleph', sense: 'source, silence, unity' },
      { letter: 'ו', name: 'Vav', sense: 'connection, line, joining' },
      { letter: 'ר', name: 'Resh', sense: 'head, beginning, emergence' },
    ],
    refs: ['Genesis 1:3', 'Psalms 27:1', 'Isaiah 60:1'],
    insight:
      'אור is source connected into emergence. Light is the hidden becoming visible.',
  },
]

export const letters = [
  { letter: 'א', name: 'Aleph', value: 1, themes: ['unity', 'source', 'breath'] },
  { letter: 'ב', name: 'Bet', value: 2, themes: ['house', 'dwelling', 'relationship'] },
  { letter: 'ד', name: 'Dalet', value: 4, themes: ['door', 'poverty', 'opening'] },
  { letter: 'ה', name: 'Hei', value: 5, themes: ['breath', 'revelation', 'window'] },
  { letter: 'ו', name: 'Vav', value: 6, themes: ['hook', 'connection', 'line'] },
  { letter: 'ח', name: 'Chet', value: 8, themes: ['life', 'threshold', 'enclosure'] },
  { letter: 'מ', name: 'Mem', value: 40, themes: ['water', 'depth', 'formation'] },
  { letter: 'ס', name: 'Samekh', value: 60, themes: ['support', 'circle', 'sustaining'] },
  { letter: 'ר', name: 'Resh', value: 200, themes: ['head', 'beginning', 'emergence'] },
  { letter: 'ת', name: 'Tav', value: 400, themes: ['seal', 'completion', 'mark'] },
]
