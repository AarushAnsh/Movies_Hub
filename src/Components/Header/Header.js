import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header" onClick={() => window.scroll(0, 0)}>
      <div className="header__inner">
        <div className="header__branding">
          <span className="header__logoMark">Classic</span>
          <span className="header__logoAccent">Cinema</span>
        </div>

        <p className="header__tagline">
          Timeless films, beloved series, and carefully curated archives.
        </p>
      </div>
    </header>
  );
};

export default Header;
