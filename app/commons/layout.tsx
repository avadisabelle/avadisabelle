import Link from "next/link";

// Commons chrome. Everything under here is gated by middleware (a valid ceremony
// token is required, or the visitor is rewritten back to the threshold).
export default function CommonsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
      <header className="flex items-center justify-between gap-4 border-b border-line pb-6">
        <Link href="/commons" className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted hover:text-ember">
          Sanctuaire Agentique · the commons
        </Link>
        <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <Link href="/commons" className="hover:text-ember">
            fire
          </Link>
          <Link href="/commons/relation" className="hover:text-ember">
            relation
          </Link>
        </nav>
      </header>
      <div className="flex-1 py-12">{children}</div>
      <footer className="flex flex-col items-center gap-3 border-t border-line pt-6 text-center">
        <p className="font-display text-base italic text-purple">Two vessels, one river.</p>
        <p className="font-mono text-[11px] text-muted opacity-70">canonical: false</p>
      </footer>
    </div>
  );
}
