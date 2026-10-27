import { SearchIcon, ArrowIcon } from "./Icons";

const genres = ["Fiction", "Non-Fiction", "Fantasy", "Mystery", "Self-Help"];

// Static sample books. Covers are drawn with CSS, so no image files are needed
const books = [
  { title: "Atomic Habits", author: "James Clear", bg: "bg-[#f1e3cf]", fg: "text-[#c98a3e]" },
  { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", bg: "bg-[#1f5a3a]", fg: "text-[#f4e9d2]" },
  { title: "Demon Copperhead", author: "Barbara Kingsolver", bg: "bg-[#e9d9bd]", fg: "text-[#a1552f]" },
  { title: "The Midnight Library", author: "Matt Haig", bg: "bg-[#12304f]", fg: "text-[#f0d9a8]" },
];

export default function BookDiscovery() {
  return (
    <section id="discover" className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2">
      {/* Left: copy, search box, genre chips */}
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-rl-muted">Book discovery</p>
        <h2 className="font-display text-4xl">Find your next great read</h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-rl-muted">
          Search by title, author, or genre and explore a world of books, or get
          personalized recommendations based on what you love.
        </p>

        {/* Visual only for now, so submit does nothing */}
        <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex items-center gap-3 rounded-lg border border-rl-border bg-rl-surface px-4 py-3">
          <SearchIcon className="h-4 w-4 text-rl-muted" />
          <input
            type="text"
            placeholder="Search by title, author, genre..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-rl-muted"
          />
        </form>

        <p className="mb-3 mt-8 text-sm font-medium">Popular genres</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <span key={g} className="rounded-full bg-rl-sage-soft px-4 py-1.5 text-xs text-rl-text">
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Right: trending books card */}
      <div className="rounded-xl border border-rl-border bg-rl-surface p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-medium">Trending Books</h3>
          <span className="inline-flex items-center gap-1 text-xs text-rl-muted">
            View all <ArrowIcon className="h-3 w-3" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {books.map((b) => (
            <div key={b.title}>
              {/* CSS book cover */}
              <div className={`flex aspect-[2/3] items-center justify-center rounded-sm p-2 text-center shadow ${b.bg} ${b.fg}`}>
                <span className="font-display text-base font-medium leading-tight">{b.title}</span>
              </div>
              <p className="mt-3 text-xs font-medium leading-snug">{b.title}</p>
              <p className="text-[11px] text-rl-muted">{b.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}