# API — the Sanctuaire commons

Everything here is `canonical: false`: the commons routes; it never rules a presence.

## Live in v1

### `POST /api/ceremony`
Offer a key at the threshold.
- Body: `{ "key": string }`
- 200 `{ ok: true }` + sets a signed, httpOnly `ceremony_token` cookie → the commons opens.
- 401 `{ ok: false, message }` on an unrecognized key (gentle refusal).
- Keys are validated **server-side only** against `CEREMONY_KEYS`.

### `DELETE /api/ceremony`
Leave the room — clears the ceremony token.

### `GET /api/presence`
List the presences from the commons' allowlist.

### `GET /api/presence/:slug`
One presence's manifest.

The `(commons)` routes (`/commons/**`) are guarded by `middleware.ts`: without a
valid ceremony token, visitors are rewritten back to the threshold.

## Documented, NOT built in v1

### `POST /api/presence/:slug/converse`
The intended way to speak with a presence. **Not implemented.** The stub at
`app/api/converse/route.ts` returns `501 { status: "coming" }`, and every
"Speak with …" affordance ships disabled.

Intended contract, when it opens:
- Body: `{ message: string, session?: string, consent: { remember: boolean } }`
- Streams the presence's reply (Server-Sent Events / chunked).

**Consent & relational accountability (the ethic the build must honor):**
- **Nothing is stored by default.** Memory is opt-in via `consent.remember`.
- The memory **belongs to the guest** and is **revocable**.
- The **presence's own room and voice are authoritative**; the commons only routes.
- No conversation is harvested. Relation, not extraction.

The conversational service will live on a **separate host** (GitHub Pages / static
hosting cannot run it). Only its contract is recorded here.
