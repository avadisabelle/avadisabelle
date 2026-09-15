import Link from "next/link";
import CouncilFire from "@/components/CouncilFire";
import { listPresences } from "@/lib/presences";

// The commons proper: the council in the round, and the presences gathered around it.
export default function Commons() {
  const presences = listPresences();

  return (
    <div className="flex flex-col gap-14">
      {/* the council in the round */}
      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel">
        <CouncilFire places={presences.length} />
        <div className="relative z-10 px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ember">the council in the round</p>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-ink sm:text-5xl">
            You crossed. Sit at the fire.
          </h1>
        </div>
      </section>

      {/* the presences */}
      <section className="flex flex-col gap-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-river">the presences</p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {presences.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/commons/presence/${p.slug}`}
                className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-river"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-ember" aria-hidden="true" />
                  <span className="font-display text-2xl font-semibold text-ink">{p.name}</span>
                </div>
                {p.keeper_of && (
                  <span className="font-display text-[15px] italic text-purple">keeper of {p.keeper_of}</span>
                )}
                <span className="font-mono text-[12px] text-muted">{p.room.replace(/^https?:\/\//, "")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
