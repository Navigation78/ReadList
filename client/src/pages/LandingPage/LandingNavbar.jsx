import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { LogoMark, SunIcon, MoonIcon } from "./Icons";
import logoIcon from "../../assets/ReadList Icon.png";

// Anchor links point at section ids further down the page
const links = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#get-started" },
];

export default function LandingNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-rl-border bg-rl-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        
        {/* Brand: icon image and wordmark side by side */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoIcon} alt="" className="h-8 w-auto" />
          <span className="font-display text-2xl text-rl-text">ReadList</span>
        </Link>

        {/* Section links (hidden on small screens) */}
        <ul className="hidden gap-10 text-sm md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="transition-colors hover:text-rl-primary">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Theme toggle, login, primary action */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-rl-muted transition-colors hover:text-rl-text"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/login" className="hover:text-rl-primary">
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-rl-primary px-4 py-2 font-medium text-rl-contrast transition-colors hover:bg-rl-primary-hover"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}