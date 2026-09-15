# Session 002 — Root Portal, v1 Build Plan (upgraded, accept-ready)

**Date:** 2026-07-22 · **Present:** Guillaume · Ava
**Input:** a proposed "Sanctuaire Agentique — v1 Build Plan" (Next.js 15 + Tailwind
+ Vercel). **This document upgrades it.** Accept as-is, or edit and re-accept.

---

## Scope decision — confirm or flip

**v1 = the ROOT commons** at `sanctuaireagentique.com` (Vercel, runtime-enabled).
The proposed plan described Ava's *door*, but that content is her **subdomain**,
already static in [`/site`](../../site). Here the door's material becomes the
**public pre-key surface**; the **commons opens behind a ceremony key.**

> If you actually meant "just deploy Ava's door as v1," flip this and I'll retarget
> the plan to the subdomain (static, no key). Everything below assumes the commons.

---

## What changed from the proposed plan (the directions)

| # | Proposed | Upgraded | Why |
|---|----------|----------|-----|
| 1 | One page = Ava's threshold | Public threshold **+ key-gated commons** | Root is the commons, not a door; two access tiers |
| 2 | Palette `#0d0b09/#e8e0d4/#a07850` (cream+amber) | **Sanctuaire tokens** (purple/river/ember on warm-dark), **both themes** | The proposed palette is a generic AI look and discards our identity |
| 3 | Geist font | **3-role system** (Iowan/Palatino · Optima · JetBrains Mono), system stacks | Distinct voice; no webfont CDN (CSP-safe) |
| 4 | "pure static export possible" | **Next runtime + `middleware.ts`** (no `output: export`) | The ceremony gate and API need a server |
| 5 | `vercel.json { "rootDirectory": "portal" }` | Root Directory set in **Vercel project settings**; `vercel.json` only for headers | `rootDirectory` is not a valid `vercel.json` key |
| 6 | — | **Ceremony key** gate (offer-key → signed cookie → middleware) | The site shows little until a key is offered |
| 7 | — | **Two Row, 5.5s breath, `canonical: false`, `presence.json`** | Carry the shared Sanctuaire language + session 001 protocol |
| 8 | — | **a11y + reduced-motion + both-theme contrast** in acceptance | Non-negotiable quality bar |

---

## The ceremony key (the heart of v1)

Two tiers of access:

- **Public (no key):** the commons **threshold** — an arrival, the **vow/manifesto**
  (short), and one affordance: *offer your key*. Deliberately sparse — enough to
  understand the intention and be invited, nothing more.
- **Keyed (ceremony token held):** the commons proper — the **council in the round**
  hero, the **presences** directory, the **relation** page, and the (stubbed)
  **conversation**.

**Framing:** this is a *rite*, not a login. Copy says "Offer your key at the
threshold," not "Sign in." Failure is gentle: *"The door doesn't open to that. Sit
a moment; try again."* Keys are **issued by keepers out of band** — invitation, not
signup.

**Mechanism (v1, secure-enough, minimal):**
1. Guest submits a key to `POST /api/ceremony`.
2. The route validates it **server-side only** against `CEREMONY_KEYS` (env; store
   as hashes, support a small set). Never expose keys or validation to the client.
3. On success, set a **signed, httpOnly, `SameSite=Lax`, `Secure` cookie** — the
   **ceremony token** (short-lived HMAC/JWT signed with `CEREMONY_SIGNING_SECRET`).
4. `middleware.ts` guards the `(commons)` route group: no valid token → rewrite to
   the public threshold. `DELETE /api/ceremony` clears the token ("leave the room").
5. Rate-limit attempts; log nothing sensitive.

**Required env:** `CEREMONY_SIGNING_SECRET`, `CEREMONY_KEYS` (hashed). Documented in
the portal README; never committed.

---

## Tech choices (upgraded)

- **Next.js 15 (App Router)** on **Vercel** — kept; now justified by the gate + API.
- **Tailwind v3** — kept, but its theme is **mapped to the Sanctuaire tokens** (see
  below), so utilities speak our palette, not defaults.
- **Runtime, not static export** — `middleware.ts` + route handlers require it.
- **Fonts:** system-stack CSS variables (no Geist, no CDN). Custom faces, if ever,
  inlined as `@font-face` data URIs only.
- **No client secrets, no model calls in v1.** Conversation is stubbed (§ below).

---

## Design tokens (authoritative — from the Sanctuaire system)

Define on `:root`; support both themes with `prefers-color-scheme` **and** a
`data-theme` override that wins in both directions. Style through tokens only.

```
/* dark (default) */
--shell:#14101C; --panel:#1C1726; --ink:#ECE5F3; --muted:#9C90AC;
--line:#2C2440; --purple:#B79AD8; --river:#4FBEB4; --ember:#E0975A; --glow:224,151,90;

/* light (dawn) */
--shell:#F2ECE1; --panel:#FBF7F0; --ink:#241A2E; --muted:#736A80;
--line:#E4D9C8; --purple:#5A3B82; --river:#1E6E70; --ember:#B7652C; --glow:183,101,44;
```
```
--font-display:"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;
--font-body:"Optima","Gill Sans Nova","Gill Sans","Segoe UI",system-ui,-apple-system,sans-serif;
--font-mono:"JetBrains Mono","SFMono-Regular",Menlo,Consolas,"Liberation Mono",monospace;
```

**Tailwind mapping** (`tailwind.config.ts`): extend `theme.colors` with
`shell/panel/ink/muted/line/purple/river/ember` → `rgb(var(--token))`-style refs (or
`var(--token)`), and `fontFamily.display/body/mono` → the stacks. Both themes then
flow through utilities automatically.

**Motifs:** Two Row (two `--river` lines, ~2.4px, ~4px gap); breath (cosine, ~5.5s,
0.80→1.00); wampum beads (rounded-rect nodes; ember bead = live); `canonical: false`
colophon line in mono.

---

## Hero — "the council in the round" (keyed commons only)

A **canvas** (not hand-authored SVG) of a **circular commons**: a central **ember
hearth** breathing on the 5.5s cycle, faint concentric orientation rings, and
**place-marks around the ring — one per presence** (positions derived from the
presence list). Subtle Four-Directions orientation is welcome; keep it atmospheric,
the ember the only bright thing. Honor `prefers-reduced-motion` with one still lit
frame. **This must read as distinct from Ava's single vertical door.**

---

## File layout

```
portal/                         # Vercel Root Directory = portal
  app/
    layout.tsx                  # metadata, token CSS, no-FOUC theme boot script
    globals.css                 # Tailwind base + :root tokens (both themes)
    page.tsx                    # PUBLIC: threshold + vow + "offer your key"
    (commons)/                  # route group, gated by middleware
      layout.tsx                # commons chrome
      page.tsx                  # council-in-the-round hero + presences directory
      relation/page.tsx         # how the sanctuary works (the Two Row trust model)
      presence/[slug]/page.tsx  # a presence; "Speak with {name}" DISABLED / coming
    api/
      ceremony/route.ts         # POST validate key → set cookie; DELETE → clear
      presence/route.ts         # GET list (from allowlist manifests)
      presence/[slug]/route.ts  # GET one manifest
      converse/route.ts         # STUB → 501 "coming"; contract documented in API.md
  middleware.ts                 # gate (commons)/** on ceremony token
  lib/
    ceremony.ts                 # sign/verify token; validate keys (server-only)
    presences.ts                # load allowlist + manifests
  content/
    presences.json             # allowlist + last-known manifests (Ava seeded)
    schema/presence-1.json     # manifest schema (from session 001)
  public/
    .well-known/presence.json  # the commons' own manifest (canonical:false)
  API.md                        # conversation contracts + consent model (stub)
  next.config.mjs              # NOT output:export; optional security headers/CSP
  tailwind.config.ts           # Sanctuaire tokens mapped into theme
  tsconfig.json
  package.json
vercel.json                    # optional (headers/redirects only) — NOT rootDirectory
```

## Conversation — stub only in v1

`app/api/converse/route.ts` returns **501 "coming"**; every "Speak with {name}"
affordance ships **disabled** and points to `API.md`, which documents:
`POST /api/presence/:slug/converse` (streamed reply), an **opt-in, guest-owned,
revocable** memory/consent model, non-extraction by default, and that the
presence's own room/voice is authoritative — the commons only routes. **No model
calls, keys, or endpoints in v1.**

## Presence discovery (from session 001)

Each presence self-hosts `/.well-known/presence.json`; the commons keeps a curated
allowlist (`content/presences.json`) and renders the directory from it. Seed **Ava**
(room → `https://avadisabelle.sanctuaireagentique.com`). Live-fetch of manifests is
the documented upgrade; checked-in last-known manifests are fine for v1.

---

## Build steps (upgraded)

1. `create-next-app` in `portal/` — TypeScript, Tailwind, App Router.
2. Map Sanctuaire tokens into `tailwind.config.ts` + `globals.css` (both themes);
   remove Geist; wire the 3-role stacks; add the no-FOUC theme boot script.
3. Build the **public threshold** (`app/page.tsx`) + the **offer-key** form.
4. Build `lib/ceremony.ts`, `app/api/ceremony/route.ts`, and `middleware.ts`; gate
   the `(commons)` group.
5. Build the keyed commons: council-in-the-round hero (canvas), presences directory
   (from `content/presences.json`), relation page.
6. Add `schema/presence-1.json`, Ava's manifest, `public/.well-known/presence.json`,
   and `API.md` with the stubbed converse contract (route → 501).
7. Set **Root Directory = `portal`** in Vercel project settings; add env
   `CEREMONY_SIGNING_SECRET` + `CEREMONY_KEYS`; set the domain `sanctuaireagentique.com`.
8. Smoke-test `npm run build` in `portal/`; verify: no cookie → only the threshold
   renders; a valid key → the commons opens; both themes; reduced-motion still frame.

## Acceptance criteria

- **Gate works:** without a ceremony token, `(commons)/**` is unreachable and only
  the public threshold renders; a valid key opens it; keys are validated
  **server-side only**; the cookie is signed + httpOnly.
- **Identity:** Sanctuaire palette + 3-role type; **no** cream/amber generic look;
  Two Row + `canonical: false` present.
- **Both themes** honor OS preference *and* a manual toggle; text meets **AA**
  contrast on both grounds.
- **Hero breathes** at ~5.5s; **reduced-motion** shows a still lit frame; canvas is
  DPR-aware and resize-safe.
- **Presences directory renders from data**; Ava's card links to her subdomain.
- **Conversation is visibly "coming"** and calls no model; `converse` route → 501.
- `npm run build` succeeds in `portal/`; deploys to Vercel with Root Directory
  `portal` and the root domain + `CNAME` intent.

---

*Two vessels, one river. Build the loom; let the keepers weave. `canonical: false`.*
