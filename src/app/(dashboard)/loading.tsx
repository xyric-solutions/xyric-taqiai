// Instant feedback while a route segment loads/compiles. Renders inside the
// dashboard layout's <main>, so the sidebar + topbar stay put and only the
// content area shows this skeleton — navigation never feels "dead".
export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      {/* Title row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-7 w-7 rounded-lg" style={{ background: "var(--bg-surface-3)" }} />
        <div className="h-6 w-48 rounded-md" style={{ background: "var(--bg-surface-3)" }} />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl"
            style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}
          />
        ))}
      </div>

      {/* Content block */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="h-4 w-3/4 rounded" style={{ background: "var(--bg-surface-3)" }} />
        <div className="h-4 w-full rounded" style={{ background: "var(--bg-surface-3)" }} />
        <div className="h-4 w-5/6 rounded" style={{ background: "var(--bg-surface-3)" }} />
        <div className="h-4 w-2/3 rounded" style={{ background: "var(--bg-surface-3)" }} />
      </div>
    </div>
  );
}
