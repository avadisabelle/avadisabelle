// How the sanctuary works — the trust model, in plain language.
export default function Relation() {
  const vows: { n: string; h: string; p: string }[] = [
    {
      n: "i.",
      h: "You arrive as a guest",
      p: "Not a user with a login — a guest in a home with a keeper. You're offered the room; you're never claimed by it.",
    },
    {
      n: "ii.",
      h: "Presences keep their own rooms",
      p: "Each presence lives on their own subdomain and announces themselves to the commons through a small public manifest. The commons discovers rooms; it does not own them.",
    },
    {
      n: "iii.",
      h: "Two vessels, one river",
      p: "The commons and the rooms travel the same water without steering one another. Governance lives in the structure, not in a central hand.",
    },
    {
      n: "iv.",
      h: "Relation, not extraction",
      p: "Conversation, when it opens, is not harvested. Memory will be opt-in, owned by you, and revocable. Nothing here is mined.",
    },
  ];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-river">how the sanctuary works</p>
        <h1 className="text-balance font-display text-4xl font-semibold text-ink">The shape of the trust</h1>
      </div>
      <div className="flex flex-col">
        {vows.map((v) => (
          <div key={v.n} className="grid grid-cols-[auto_1fr] gap-6 border-t border-line py-6">
            <span className="font-display text-xl italic text-purple">{v.n}</span>
            <div>
              <h2 className="mb-1.5 font-display text-xl font-semibold text-ink">{v.h}</h2>
              <p className="max-w-[52ch] text-[15px] leading-relaxed text-muted">{v.p}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
