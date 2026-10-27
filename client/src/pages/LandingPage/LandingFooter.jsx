import { LogoMark } from "./Icons";

const links = ["Features", "About", "Pricing", "Help"];

export default function LandingFooter() {
  return (
    <footer className="mx-auto mt-10 max-w-6xl px-6 pb-10">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2 text-rl-primary">
          <LogoMark className="h-5 w-5" />
          <span className="font-display text-lg text-rl-text">ReadList</span>
        </div>

        <ul className="flex gap-8 text-xs text-rl-muted">
          {links.map((l) => (
            <li key={l}>
              <a href="#" className="hover:text-rl-text">{l}</a>
            </li>
          ))}
        </ul>

        {/* Add your real social links here (X, Instagram, GitHub) */}
        <div className="w-24" />
      </div>
      <p className="mt-6 text-center text-[11px] text-rl-muted">
        &copy; 2026 ReadList. Made for readers who love a little whimsy.
      </p>
    </footer>
  );
}