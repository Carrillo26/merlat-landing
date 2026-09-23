# Merlat Landing v2 — FintechX Fusion

LATAM-first prediction market fundraising page for **US memecoin / pump.fun traders**. English default + Spanish toggle. Soft community raise **$50K–$100K USD**.

**Visual direction:** FintechX-style light premium SaaS layout × **Señal Editorial** palette (paper / ink / charcoal / `#E10600`). Distinct from v1 editorial brutalism.

## Live site

**https://carrillo26.github.io/merlat-landing/**

GitHub Pages source: **Deploy from a branch** → branch **`main`** → folder **`/`** (repository root), so `index.html` is served at `/`.

Repo → **Settings** → **Pages** → Build and deployment → Source **Deploy from a branch** → Branch **`main`** / **`/ (root)`** → Save. The first build often takes 1–2 minutes.

Phone-friendly: the page uses a mobile viewport, a burger nav under 960px, and stacked sections.

## Preview

```bash
python3 -m http.server 8082
# visit http://localhost:8082
```

Or open `index.html` directly.

## Placeholders (replace before public launch)

| Placeholder | Replace with |
|---|---|
| `{{PUMPFUN_URL}}` | Live pump.fun coin URL |
| `{{CONTRACT_ADDRESS}}` | Solana mint / contract |
| `{{TWITTER_URL}}` | X/Twitter profile |
| `{{TELEGRAM_URL}}` | Telegram invite |
| `{{EMAIL}}` | Public contact email |
| `{{LOGO_PATH}}` | Optional logo path (`assets/logo.svg`) |

Do **not** invent raised amounts, licenses, partnerships, or claim licensed real-money ops in Brazil.

## Language

- Default: **EN** · Toggle: **EN | ES** · `localStorage` key `merlat-lang`
- Strings: `script.js` → `I18N.en` / `I18N.es`

## Design tokens

| Token | Value | Role |
|---|---|---|
| Paper | `#F4F3ED` | Page ground |
| Ink | `#121212` | Primary type |
| Charcoal | `#2E2E2E` | Dark panels / final CTA |
| Signal red | `#E10600` | Brand accent / CTAs |
| White | `#FFFFFF` | Soft cards |
| App teal | `#00C4B8` | **Phone mock only** |
| Type | Plus Jakarta Sans | Clean SaaS (not Syne ALL-CAPS) |

## Locked economics

- Soft raise: **$50K–$100K** USD (pump.fun)
- Funds: **35% product · 25% legal · 20% marketing · 15% liquidity/token · 5% ops**
- Utilities: fee discount · governance · staking/fee share (Planned / Roadmap)

## Sections

1. Nav · 2. Hero + stats · 3. Features (how it works) · 4. Product preview (phone mock) · 5. Why LATAM / trust · 6. Raise · 7. Use of funds · 8. Token · 9. Roadmap · 10. FAQ · 11. Final CTA · 12. Footer disclaimers

## Files

`index.html` · `styles.css` · `script.js` · `assets/logo.svg` · `VERSION.md` · this README

See `VERSION.md` for v1 vs v2 relationship.
