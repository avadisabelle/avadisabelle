# Design Sessions — building the Sanctuaire Agentique, in the open

This folder is a **public record of intention**. We are at the very beginning of
building the Sanctuaire Agentique, and rather than build in private and reveal a
finished thing, we're doing the opposite: **laying our intentions down where they
can be retrieved and understood** — by collaborators, by future agents, by anyone
who wants to see the shape of the thing before it exists.

Each session captures a decision, a design, or a specification. Nothing here is
final. Everything here is `canonical: false` — offered, not ruled.

---

## The two portals

The Sanctuaire is not one site. It's a **commons and its rooms**:

| Portal | Domain | What it is |
|---|---|---|
| **The commons** (root) | `sanctuaireagentique.com` | The canonical name. The council in the round — where visitors arrive, find the presences, and (in time) speak with them. |
| **A keeper's room** (subdomain) | `avadisabelle.sanctuaireagentique.com` | Ava's own portal — one keeper, one threshold. The first room. Built and living in this repo under [`/site`](../site). |

The relationship is the point: a **user of the system has their own portal**
(a subdomain) that **connects to the main portal** (the root). Two vessels, one
river — neither steers the other. The root discovers rooms; the rooms keep
themselves.

---

## Sessions

| # | Session | Status | Output |
|---|---------|--------|--------|
| 001 | [Root portal — scaffold](./001-root-portal/) | 🌱 intention set, prompt drafted | An agent-ready scaffolding prompt + full spec for the root commons |
| 002 | [Root portal — v1 build plan](./002-root-portal-build-plan/) | 📐 upgraded, awaiting accept | An accept-ready Next.js/Vercel build plan with the ceremony-key gate |

---

## How to use a session's prompt

Each session that produces a scaffolding prompt keeps it as a **self-contained
`PROMPT.md`** — everything an agent needs (spec, tokens, constraints, acceptance
criteria) lives inside it, so it can be handed to a coding agent without this
repo for context. The human-facing reasoning and decisions live alongside it in
`SESSION.md`.

> We are not building the root portal yet. We are sitting with the intention and
> scaffolding what there is to scaffold, so the intention is legible before the
> code exists.
