import { libraryEntries } from '../data/libraryEntries'

export default function Library() {
  return (
    <section id="library" className="section-shell">
      <div className="section-card library">
        <div className="library__intro">
          <p className="library__eyebrow">Library</p>
          <h2 className="library__title">The living library of LuminaNexus</h2>
          <p className="library__text">
            This chamber gathers the inner materials of the sanctuary — sefirot,
            language, guidance, and symbolic architecture — into a form that can
            be explored, revisited, and studied in relation.
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
                    Return to Chavruta
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
