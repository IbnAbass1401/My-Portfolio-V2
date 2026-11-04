const rows = [
  { key: "problem", label: "The problem", hint: "Add 1–2 sentences: who needed this and what was painful without it" },
  { key: "role", label: "My role", hint: "Add what YOU designed and built" },
  { key: "stack", label: "Stack", hint: "Add the technologies you used" },
  { key: "challenge", label: "Hardest challenge", hint: "Add: the one bug or decision that was actually hard" },
  { key: "solution", label: "How I solved it", hint: "Add: what you tried, what worked, what you learned" },
];

export default function CaseStudy({ data }) {
  const dev = import.meta.env.DEV; // placeholders only show while developing
  const hasContent = rows.some((r) => data?.[r.key]);
  if (!hasContent && !dev) return null;

  return (
    <details className="group mt-5 rounded-xl border border-line bg-bg/60">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 text-sm font-semibold text-glow transition-colors hover:bg-glow/5 focus-visible:outline-2 focus-visible:outline-glow [&::-webkit-details-marker]:hidden">
        Read case study
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
        >
          <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <dl className="grid gap-4 px-4 pb-4 pt-2">
        {rows.map((r) => {
          const value = data?.[r.key];
          if (!value && !dev) return null;
          return (
            <div key={r.key}>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-glow">
                {r.label}
              </dt>
              {value ? (
                <dd className="mt-1 text-sm leading-relaxed text-muted">{value}</dd>
              ) : (
                <dd className="mt-1 rounded-lg border border-dashed border-star/60 bg-star/5 px-3 py-2 text-sm text-star">
                  ✎ {r.hint}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </details>
  );
}