const { libraryEntries } = require('../data/libraryEntries')

function normalize(text) {
  return String(text || '').toLowerCase()
}

function scoreEntry(entry, question) {
  var q = normalize(question)
  var score = 0

  if (q.indexOf(normalize(entry.title)) !== -1) {
    score += 12
  }

  for (var i = 0; i < entry.tags.length; i += 1) {
    var tag = normalize(entry.tags[i])

    if (q.indexOf(tag) !== -1) {
      score += 6
    }
  }

  var words = q.split(/[^a-z0-9#]+/).filter(Boolean)

  for (var j = 0; j < words.length; j += 1) {
    var word = words[j]

    if (word.length < 4) continue

    if (normalize(entry.content).indexOf(word) !== -1) {
      score += 1
    }
  }

  return score
}

function findLibraryContext(question, limit) {
  var max = typeof limit === 'number' ? limit : 3

  return libraryEntries
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
