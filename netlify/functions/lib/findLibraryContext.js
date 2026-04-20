const data = require('../data/library')

function normalize(text) {
  return String(text || '').toLowerCase()
}

function scoreEntry(entry, question) {
  const q = normalize(question)
  let score = 0

  if (q.indexOf(normalize(entry.title)) !== -1) {
    score += 12
  }

  for (let i = 0; i < entry.tags.length; i += 1) {
    const tag = normalize(entry.tags[i])
    if (q.indexOf(tag) !== -1) {
      score += 6
    }
  }

  const words = q.split(/[^a-z0-9#]+/).filter(Boolean)

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i]
    if (word.length < 4) continue

    if (normalize(entry.content).indexOf(word) !== -1) {
      score += 1
    }
  }

  return score
}

function findLibraryContext(question, limit) {
  const max = typeof limit === 'number' ? limit : 3

  return data.libraryEntries
    .map(function (entry) {
      return {
        entry: entry,
        score: scoreEntry(entry, question),
      }
    })
    .filter(function (item) {
      return item.score > 0
    })
    .sort(function (a, b) {
      return b.score - a.score
    })
    .slice(0, max)
    .map(function (item) {
      return item.entry
    })
}

module.exports = {
  findLibraryContext,
}
