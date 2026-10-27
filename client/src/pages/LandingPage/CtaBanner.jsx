import { Link } from "react-router-dom";
import heroImg from "../../assets/ReadList Hero Image.jpg";
import { ArrowIcon } from "./Icons";

export default function CtaBanner() {
  return (
    <section id="get-started" className="mx-auto max-w-6xl px-6">
      <div className="grid overflow-hidden rounded-xl bg-rl-alt md:grid-cols-[1fr_1.6fr]">
        {/* Swap this for a stacked-books photo if you have one in assets */}
        <img src={heroImg} alt="" className="h-48 w-full object-cover md:h-full" />

        <div className="flex flex-col justify-center p-8 md:p-10">
          <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-rl-muted">Ready to start?</p>
          <h2 className="font-display text-3xl">Your next chapter is waiting.</h2>
          <p className="mt-2 text-sm">
            Join thousands of readers who are making time for what matters.
          </p>
          <Link
            to="/signup"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-md bg-rl-primary px-5 py-3 text-sm font-medium text-rl-contrast transition-colors hover:bg-rl-primary-hover"
          >
            Get started for free <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}