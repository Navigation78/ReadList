import { Link } from "react-router-dom";
import heroImg from "../../assets/ReadList Hero Image.jpg";
import { ArrowIcon } from "./Icons";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-12 md:grid-cols-2">
      <div>
        <p className="mb-6 text-[11px] uppercase tracking-[0.25em] text-rl-muted">
          A reading journal, reimagined
        </p>

        {/* Two-line headline: the second line is italic and in the brand color */}
        <h1 className="font-display text-5xl leading-[1.1] md:text-6xl">
          A little more reading.
          <span className="block italic text-rl-primary">A little less keeping track.</span>
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed text-rl-text/90">
          ReadList helps you keep your books, track your progress and discover your next
          great read, all in one place.
        </p>

        <div className="mt-8 flex items-center gap-6">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-md bg-rl-primary px-5 py-3 text-sm font-medium text-rl-contrast transition-colors hover:bg-rl-primary-hover"
          >
            Build your library <ArrowIcon />
          </Link>
          <a
            href="#features"
            className="border-b border-rl-text pb-0.5 text-sm hover:text-rl-primary"
          >
            Explore features
          </a>
        </div>
      </div>

      {/* Hero photo */}
      <img
        src={heroImg}
        alt="A reader enjoying a book by a sunny window"
        className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
      />
    </section>
  );
}