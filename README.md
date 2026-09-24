# Merlat Landing

LATAM-first prediction market fundraising page for **US memecoin / pump.fun traders**. English is the default, with an **EN | ES** toggle (`localStorage` key `merlat-lang`). Soft community raise **$50K–$100K USD**.

**Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS. Visual direction is the FintechX-style light SaaS layout × **Señal Editorial** palette. Deploy target is **Vercel** (Hobby). The previous GitHub Pages static site is archived in `archive/github-pages/` and is not what Vercel serves.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint
```

The phone mock stays in Spanish in both languages. Percentages inside it are illustrative UI, not live odds.

## Deploy on Vercel (Hobby) — Carrillo26

You have to import the GitHub repo in the Vercel dashboard. This repository cannot finish account linking for you.

1. Sign in at [vercel.com](https://vercel.com) with the GitHub account that owns **Carrillo26/merlat-landing**.
2. Choose **Add New… → Project** and **Import** `Carrillo26/merlat-landing`.
3. Framework preset: **Next.js** (Vercel detects this). Root directory: the repository root. Build command: `npm run build`. Install command: `npm install`. Leave the output directory empty — this is not a static export.
4. Plan: **Hobby**. No environment variables are required for the current placeholders.
5. Click **Deploy**.

After the Vercel URL is live, turn off GitHub Pages so the old static host does not compete with it:

**GitHub → Settings → Pages → Build and deployment → Source: None.**

## Placeholders

Edit `lib/site.ts` before a public launch. Values are literal placeholders, not live links.

| Constant | Replace with |
|---|---|
| `pumpfunUrl` (`{{PUMPFUN_URL}}`) | Live pump.fun coin URL |
| `contractAddress` (`{{CONTRACT_ADDRESS}}`) | Solana mint / contract |
| `twitterUrl` (`{{TWITTER_URL}}`) | X/Twitter profile |
| `telegramUrl` (`{{TELEGRAM_URL}}`) | Telegram invite |
| `email` (`{{EMAIL}}`) | Public contact email |

Do **not** invent raised amounts, licenses, TVL, partnerships, or claim licensed real-money operations in Brazil.

## Design tokens

| Token | Value | Role |
|---|---|---|
| Paper | `#F4F3ED` | Page ground |
| Ink | `#121212` | Primary type |
| Charcoal | `#2E2E2E` | Dark panels / final CTA |
| Signal red | `#E10600` | Brand accent / CTAs |
| App teal | `#00C4B8` | **Phone mock only** |
| Type | Plus Jakarta Sans | `next/font` |

Tailwind theme colors: `paper`, `ink`, `charcoal`, `accent`, `app-teal`.

## Locked economics

- Soft raise: **$50K–$100K** USD (pump.fun)
- Funds: **35% product · 25% legal · 20% marketing · 15% liquidity/token · 5% ops**
- Utilities: fee discount · governance · staking/fee share (Planned / Roadmap)

## Sections

Nav, Hero, Markets (copy + Spanish phone mock, OriginKit Globe behind them), Why LATAM (verified stats, disclaimer, sources), Use of funds (donut draws on scroll), Token, FAQ (3), final CTA, footer disclaimers.

The Markets globe is the supplied OriginKit component at `components/originkit/globe.tsx` (three.js + d3-geo). It was not installed with `npx originkit add`. LATAM land dots are `#E10600`; the rest of the world is dimmer. The phone mock stays in front and readable.

## Project layout

```
app/layout.tsx
app/page.tsx
app/globals.css
components/sections/*
components/ui/*
lib/i18n.ts
lib/site.ts
public/merlat-logo.png
app/icon.png
```
