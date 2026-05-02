export const roots = [
  {
    id: 'chesed-root',
    root: 'חסד',
    transliteration: 'Ch-S-D',
    meaning: ' lovingkindness, covenantal mercy, generous devotion',
    letters: ['ח', 'ס', 'ד'],
    sefirot: ['Chesed', 'Tiferet'],
    refs: ['Genesis 24:12', 'Psalms 89:3', 'Micah 6:8'],
    note:
      'חסד is not merely kindness as sentiment; it is faithful goodness expressed through action, relationship, and covenant.',
  },
  {
    id: 'emet-root',
    root: 'אמת',
    transliteration: 'A-M-T',
    meaning: ' truth, firmness, faithfulness',
    letters: ['א', 'מ', 'ת'],
    sefirot: ['Tiferet'],
    refs: ['Genesis 24:27', 'Exodus 34:6', 'Psalms 119:160'],
    note:
      'אמת stretches from Aleph to Tav, suggesting truth as wholeness from beginning to end.',
  },
  {
    id: 'or-root',
    root: 'אור',
    transliteration: 'A-W-R',
    meaning: ' light, illumination, revealing radiance',
    letters: ['א', 'ו', 'ר'],
    sefirot: ['Chokhmah', 'Tiferet'],
    refs: ['Genesis 1:3', 'Isaiah 60:1', 'Psalms 27:1'],
    note:
      'אור is the first revealed radiance of creation, a movement from hidden source into visible order.',
  },
]

export const letters = [
  {
    id: 'alef',
    letter: 'א',
    name: 'Aleph',
    value: 1,
    themes: ['unity', 'source', 'breath', 'hidden beginning'],
    roots: ['אמת', 'אור', 'אדם'],
    note:
      'Aleph suggests silent source, unity, and the breath before speech.',
  },
  {
    id: 'mem',
    letter: 'מ',
    name: 'Mem',
    value: 40,
    themes: ['water', 'womb', 'formation', 'depth'],
    roots: ['אמת', 'מלך', 'מים'],
    note:
      'Mem carries the imagery of water, hiddenness, gestation, and formed depth.',
  },
  {
    id: 'tav',
    letter: 'ת',
    name: 'Tav',
    value: 400,
    themes: ['seal', 'completion', 'mark', 'covenant'],
    roots: ['אמת', 'תורה', 'תפארת'],
    note:
      'Tav is the sign of completion, the seal at the end of the alphabetic path.',
  },
]
