export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-brand">
          <a href="#top" className="site-brand__title">
            LuminaNexus
          </a>
          <p className="site-brand__tagline">
            A quiet digital sanctuary
          </p>
        </div>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#tree">The Tree</a>
          <a href="#library">Library</a>
          <a href="#chavruta">Chavruta</a>
          <a href="#ivritcode">IvritCode</a>
          <a href="#support">Support</a>
        </nav>
      </div>
    </header>
  )
}
