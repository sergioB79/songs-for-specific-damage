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
- Full SSD damage database in JSON + source XLSX

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

## Source of truth

`src/data/ssd.json` contains the 125-case database used by the site and quiz engine.

The v1 classification is editorial and based on playlist title + supplied description. Track-level review is a later refinement; confidence and review metadata are retained in the data model.

## Brand rule #1

> **The content may be absurd. The interface may not.**

See `/docs` for the full system.

SSD//00125 — AUDIO PSYCHOLOGY UNIT — CASE REMAINS OPEN.
