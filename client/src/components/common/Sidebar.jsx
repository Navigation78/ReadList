
import React from "react";
import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Dashboard", to: "/" },
  { label: "My Library", to: "/library" },
  { label: "Discover Books", to: "/search" },
  { label: "Reading Stats", to: "/stats" },
  { label: "My Profile", to: "/profile" },
];

export default function Sidebar({ className = "" }) {
  return (
    <aside className={`rl-sidebar ${className}`}>
      <div className="rl-sidebar__heading">
        <span className="rl-sidebar__eyebrow">YOUR SPACE</span>
        <h2>Reading Journal</h2>
      </div>

      <nav className="rl-sidebar__nav" aria-label="Dashboard navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `rl-sidebar__link ${isActive ? "rl-sidebar__link--active" : ""
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="rl-sidebar__bottom">
        <p>A place for every story.</p>
        <span>ReadList</span>
      </div>
    </aside>
  );
}
