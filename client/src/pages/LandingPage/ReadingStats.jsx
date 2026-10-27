import { Link } from "react-router-dom";
import { ArrowIcon } from "./Icons";

// Static sample data (books finished per month, sums to 12)
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthly = [1, 1, 1, 2, 3, 0, 1, 0, 1, 1, 0, 1];
const maxValue = 4; // top of the chart scale

// Donut slices, in order. "pct" values add up to 100
const breakdown = [
  { label: "Fiction", pct: 50, color: "#a9c0a6" },
  { label: "Non-Fiction", pct: 25, color: "#3f5b49" },
  { label: "Fantasy", pct: 17, color: "#d9a7a0" },
  { label: "Other", pct: 8, color: "#8fae8f" },
];

const topGenres = [
  ["Fiction", 5],
  ["Non-Fiction", 3],
  ["Fantasy", 2],
  ["Mystery", 1],
  ["Self-Help", 1],
];

// Build a conic-gradient string like "#a9c0a6 0% 50%, #3f5b49 50% 75%, ..."
function buildGradient() {
  let start = 0;
  return breakdown
    .map((s) => {
      const part = `${s.color} ${start}% ${start + s.pct}%`;
      start += s.pct;
      return part;
    })
    .join(", ");
}

export default function ReadingStats() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="grid gap-10 rounded-2xl bg-rl-panel p-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Left: headline numbers */}
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-rl-muted">Your reading journey</p>
          <h2 className="font-display text-4xl">Reading stats</h2>
          <p className="mt-4 max-w-xs text-sm text-rl-muted">
            See your reading habits, track your progress and celebrate your milestones.
          </p>

          <div className="mt-8 grid grid-cols-3 divide-x divide-rl-border">
            {[
              ["12", "Books finished", "this year"],
              ["8,342", "Pages read", "this year"],
              ["5", "Day streak", "current"],
            ].map(([num, label, sub]) => (
              <div key={label} className="px-4 first:pl-0">
                <p className="font-display text-3xl">{num}</p>
                <p className="mt-1 text-xs">{label}</p>
                <p className="text-[11px] text-rl-muted">{sub}</p>
              </div>
            ))}
          </div>

          <Link to="/signup" className="mt-8 inline-flex items-center gap-2 border-b border-rl-text pb-0.5 text-xs">
            View detailed stats <ArrowIcon className="h-3 w-3" />
          </Link>
        </div>

        {/* Right: chart card */}
        <div className="rounded-xl bg-rl-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base">Monthly reading</h3>
            <span className="text-[11px] text-rl-muted">Jan 2025 - Dec 2025</span>
          </div>

          {/* Bar chart: each bar height is a percentage of maxValue */}
          <div className="mt-4 flex h-28 items-end gap-2 border-b border-rl-border">
            {monthly.map((v, i) => (
              <div key={months[i]} className="flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t-sm bg-rl-sage"
                  style={{ height: `${Math.max((v / maxValue) * 100, 4)}%`, opacity: v === 0 ? 0.3 : 1 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1 flex gap-2">
            {months.map((m) => (
              <span key={m} className="flex-1 text-center text-[9px] text-rl-muted">{m}</span>
            ))}
          </div>

          {/* Donut and top genres */}
          <div className="mt-6 grid gap-6 sm:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="mb-3 text-xs font-medium">Reading breakdown</p>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0 rounded-full" style={{ background: `conic-gradient(${buildGradient()})` }}>
                  {/* Inner circle punches the hole in the donut */}
                  <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-rl-surface">
                    <span className="font-display text-lg leading-none">12</span>
                    <span className="text-[9px] text-rl-muted">books</span>
                  </div>
                </div>
                <ul className="w-full space-y-1.5 text-[11px]">
                  {breakdown.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      <span className="flex-1">{s.label}</span>
                      <span className="text-rl-muted">{s.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium">Top genres</p>
              <ul className="space-y-1.5 text-[11px]">
                {topGenres.map(([name, count]) => (
                  <li key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span className="text-rl-muted">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}