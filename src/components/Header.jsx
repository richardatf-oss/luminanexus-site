export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        
        {/* Brand */}
        <a className="site-brand" href="#top">
          <span className="site-brand__title">LuminaNexus</span>
          <span className="site-brand__tagline">
            A Quiet Digital Sanctuary
          </span>
        </a>

        {/* Navigation */}
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#tree">The Tree</a>
          <a href="#roots-letters">Roots & Letters</a>
          <a href="#library">Library</a>
          <a href="#chavruta">Chavruta</a>
          <a href="#ivritcode">IvritCode</a>
          <a href="#support" className="nav-support">
            Support
          </a>
        </nav>
      </div>
    </header>
  )
}
