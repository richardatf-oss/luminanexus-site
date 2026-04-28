import { libraryEntries } from '../data/libraryEntries'

export default function Library() {
  return (
    <section id="library" className="section-shell">
      <div className="section-card library">
        <div className="library__intro">
          <p className="library__eyebrow">Library</p>
          <h2 className="library__title">The Living Library</h2>
          <p className="library__text">
            A growing chamber of teachings, pathways, and symbols within
            LuminaNexus — built so the Tree, Chavruta, and study all return to
            one shared source.
          </p>
        </div>

        <div className="library__grid">
          {libraryEntries.map(function (entry) {
            return (
              <article
                key={entry.id}
                id={'library-' + entry.id}
                className="library-card"
              >
                <div className="library-card__top">
                  <p className="library-card__eyebrow">{entry.title}</p>
                </div>

                <div className="library-card__tags">
                  {entry.tags.map(function (tag) {
                    return (
                      <span key={tag} className="library-card__tag">
                        {tag}
                      </span>
                    )
                  })}
                </div>

                <p className="library-card__content">{entry.content}</p>

                <div className="library-card__footer">
                  <a className="library-card__jump" href="#chavruta">
                    Ask Chavruta about this
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
