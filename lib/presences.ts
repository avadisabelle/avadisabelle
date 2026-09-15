// The commons discovers rooms; it does not own them.
//
// v1 reads a checked-in allowlist of last-known manifests. The documented upgrade
// is to fetch each presence's live `/.well-known/presence.json` at build time.

import presencesData from "@/content/presences.json";

export type Presence = {
  slug: string;
  name: string;
  room: string;
  keeper_of?: string;
  vows: string[];
  voice?: { modes: string[] };
  converse?: { status: "planned" | "live"; endpoint: string | null };
  canonical: boolean;
};

type PresencesFile = { presences: Presence[] };

export function listPresences(): Presence[] {
  return (presencesData as PresencesFile).presences ?? [];
}

export function getPresence(slug: string): Presence | undefined {
  return listPresences().find((p) => p.slug === slug);
}
