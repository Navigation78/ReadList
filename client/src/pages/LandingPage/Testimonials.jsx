// Static sample quotes. Avatars are initials, so no photos are needed
const quotes = [
  { text: "ReadList has completely changed the way I read. It's simple, beautiful and keeps me motivated.", name: "Amara Njau", role: "Book lover" },
  { text: "The progress tracking and stats are such a game changer. I finally feel in control of my reading life.", name: "Brian Kimathi", role: "Student" },
  { text: "I've tried many reading apps, but ReadList is by far the most thoughtful and easy to use.", name: "Wanjiru M.", role: "Teacher" },
];

export default function Testimonials() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-rl-muted">Loved by readers</p>
      <h2 className="font-display text-4xl">What our readers say</h2>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {quotes.map((q) => (
          <figure key={q.name} className="rounded-lg border border-rl-border bg-rl-surface p-6 shadow-sm">
            <blockquote className="text-sm leading-relaxed">&ldquo;{q.text}&rdquo;</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rl-rose-soft text-xs font-medium text-rl-primary">
                {q.name[0]}
              </span>
              <span>
                <span className="block text-xs font-medium">{q.name}</span>
                <span className="block text-[11px] text-rl-muted">{q.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}