
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = user
    ? [
      { label: "Dashboard", to: "/" },
      { label: "My Library", to: "/library" },
      { label: "Discover", to: "/search" },
      { label: "Statistics", to: "/stats" },
    ]
    : [
      { label: "Home", to: "/" },
      { label: "Features", to: "/#features" },
    ];

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  return (
    <header className="rl-navbar">
      <div className="rl-navbar__inner">
        <Link
          to="/"
          className="rl-brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="rl-brand__symbol" aria-hidden="true">
            &#10022;
          </span>
          ReadList
        </Link>

        <button
          className="rl-navbar__toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="readlist-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav
          id="readlist-navigation"
          className={`rl-navbar__nav ${menuOpen ? "rl-navbar__nav--open" : ""
            }`}
          aria-label="Main navigation"
        >
          {links.map((link) =>
            link.to.includes("#") ? (
              <a
                key={link.label}
                href={link.to}
                className="rl-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rl-nav-link ${isActive ? "rl-nav-link--active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            )
          )}

          {user ? (
            <>
              <NavLink to="/profile" className="rl-nav-link">
                Profile
              </NavLink>
              <Button variant="outline" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="rl-nav-link">
                Log in
              </Link>
              <Link to="/signup" className="rl-button rl-button--primary rl-button--md">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
