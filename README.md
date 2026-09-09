# SONGS FOR SPECIFIC DAMAGE

> **An Index of Bad Ideas & Good Music**

Music for whatever is specifically wrong with you today.

**Songs for Specific Damage** is a music discovery project that classifies playlists by human situations and emotional damage instead of musical genre.

> Spotify asks what music you like. We ask what went wrong.

## Product loop

**Diagnose → classify → recommend → listen → make it worse → share**

The archive contains **125 documented cases** across eight primary damage families:

- Soft Collapse
- Controlled Rage
- Glamorous Bad Decisions
- Cosmic Malfunction
- Punishment as Self-Care
- Cinematic Escape
- Functional Insanity
- Absurd Joy

## MVP included

- Homepage and brand world
- Full Damage Index with all 125 cases
- Search and damage-family filtering
- Eight-question Diagnose My Damage quiz
- Nine-axis emotional scoring engine
- Primary + alternative playlist recommendations
- MAKE IT WORSE escalation mechanic
- Surprise Me route
- Individual case files with Spotify embeds
- Full SSD damage database in versioned JSON chunks
- CASE ART // BATCH 001 integrated as visual evidence

## Stack

- Next.js 16.3.4 (App Router)
- React 19.2
- TypeScript
- Plain CSS — deliberately

## Run locally

```bash
npm install
npm run dev
```

`predev` and `prebuild` automatically materialize the compressed AVIF case art from the versioned Base64 sources in `assets-src/case-art` into `public/case-art`.

## Source of truth

The runtime database is deliberately split to keep the archive easy to version and review:

- `src/data/families.json` — eight damage-family prototypes
- `src/data/chunks/cases-01.json` … `cases-10.json` — all 125 documented cases
- `src/lib/data.ts` — combines those chunks for the application and recommendation engine
- `src/data/case-art.ts` — maps cases to available visual evidence
- `assets-src/case-art` — source payloads for CASE ART // BATCH 001

The editable source workbook is generated from the same dataset and kept as a separate project artifact rather than committed as binary source.

The v1 classification is editorial and based on playlist title + supplied description. Track-level review is a later refinement; confidence and review metadata are retained in the data model.

## Brand rule #1

> **The content may be absurd. The interface may not.**

See `/docs` for the full system.

SSD//00125 — AUDIO PSYCHOLOGY UNIT — CASE REMAINS OPEN.
