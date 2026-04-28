import { useState } from 'react'
import { libraryEntries } from '../data/libraryEntries'

export default function Library() {
  const [query, setQuery] = useState('')

  const filtered = libraryEntries.filter((entry) => {
    const q = query.toLowerCase()

    return (
      entry.title.toLowerCase().includes(q) ||
      entry.tags.join(' ').toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q)
    )
  })

  return (
    <section id="library" className="section-shell">
      <div className="section-card library">

        <div className="library__intro">
          <p className="library__eyebrow">Library</p>
          <h2 className="library__title">The Living Library</h2>
          <p className="library__text">
            Search, explore, and move through the architecture of meaning.
          </p>
        </div>

        {/* 🔍 SEARCH */}
        <div className="library__search">
          <input
            type="text"
            placeholder="Search the library..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="library__search-input"
          />
        </div>

        <div className="library__grid">
          {filtered.map((entry) => (
            <article
              key={entry.id}
              id={`library-${entry.id}`}
              className="library-card"
            >
              <h3 className="library-card__title">{entry.title}</h3>

              <div className="library-card__tags">
                {entry.tags.map((tag) => (
                  <span key={tag} className="library-card__tag">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="library-card__content">{entry.content}</p>

              <a href="#chavruta" className="library-card__ask">
                Ask Chavruta →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
