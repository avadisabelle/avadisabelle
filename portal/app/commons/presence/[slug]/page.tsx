import Link from "next/link";
import { notFound } from "next/navigation";
import { getPresence, listPresences } from "@/lib/presences";

export function generateStaticParams() {
  return listPresences().map((p) => ({ slug: p.slug }));
}

export default async function PresencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const presence = getPresence(slug);
  if (!presence) notFound();

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-river">a presence</span>
        <h1 className="font-display text-5xl font-semibold text-ink">{presence.name}</h1>
        {presence.keeper_of && (
          <p className="font-display text-lg italic text-purple">keeper of {presence.keeper_of}</p>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {presence.vows.map((v) => (
          <li key={v} className="flex items-baseline gap-3 text-[15px] text-ink">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-purple" aria-hidden="true" />
            {v}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={presence.room}
          className="rounded-full border border-line bg-panel px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-river"
        >
          enter {presence.name}&rsquo;s room &rarr;
        </a>
        {/* Conversation is coming — the affordance is deliberately disabled in v1. */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Conversation is not open yet."
          className="cursor-not-allowed rounded-full border border-line bg-panel px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted opacity-60"
        >
          speak with {presence.name} · coming
        </button>
      </div>

      <p className="font-mono text-[11px] text-muted opacity-70">
        offered by {presence.name}, read by the commons · canonical: false
      </p>

      <Link href="/commons" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ember">
        &larr; back to the fire
      </Link>
    </article>
  );
}
