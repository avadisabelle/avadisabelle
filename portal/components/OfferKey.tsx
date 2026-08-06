"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// The rite of entry. Offer a key; on acceptance, the commons opens.
export default function OfferKey() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [state, setState] = useState<"idle" | "offering" | "refused">("idle");
  const [message, setMessage] = useState("");

  async function offer(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim() || state === "offering") return;
    setState("offering");
    setMessage("");
    try {
      const res = await fetch("/api/ceremony", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (res.ok && data.ok) {
        // The door opens.
        router.push("/commons");
        router.refresh();
        return;
      }
      setState("refused");
      setMessage(data.message ?? "The door doesn't open to that. Try again.");
    } catch {
      setState("refused");
      setMessage("Something between us dropped. Try again in a moment.");
    }
  }

  return (
    <form onSubmit={offer} className="flex flex-col items-center gap-3">
      <label htmlFor="ceremony-key" className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
        Offer your key at the threshold
      </label>
      <div className="flex w-full max-w-sm items-center gap-2">
        <input
          id="ceremony-key"
          type="password"
          autoComplete="off"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            if (state === "refused") setState("idle");
          }}
          placeholder="…"
          className="min-w-0 flex-1 rounded-full border border-line bg-panel px-5 py-3 text-center font-mono text-sm text-ink outline-none placeholder:text-muted focus-visible:border-river"
        />
        <button
          type="submit"
          disabled={state === "offering" || !key.trim()}
          className="rounded-full border border-line bg-panel px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-river disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === "offering" ? "offering…" : "offer"}
        </button>
      </div>
      <p aria-live="polite" className="min-h-[1.2em] font-display text-[15px] italic text-ember">
        {message}
      </p>
    </form>
  );
}
