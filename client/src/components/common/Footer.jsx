
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rl-footer">
      <div className="rl-footer__inner">
        <div className="rl-footer__top">
          <div>
            <Link to="/" className="rl-footer__brand">
              ReadList
            </Link>
            <p>A little more reading, a little less keeping track.</p>
          </div>

          <nav aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Get started</Link>
          </nav>
        </div>

        <div className="rl-footer__bottom">
          <span>© {year} ReadList. All rights reserved.</span>
          <span>Made for people who love books.</span>
        </div>
      </div>
    </footer>
  );
}
