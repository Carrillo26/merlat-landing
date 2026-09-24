# Merlat Landing v2 — FintechX Fusion

LATAM-first prediction market fundraising page for **US memecoin / pump.fun traders**. English default + Spanish toggle. Soft community raise **$50K–$100K USD**.

**Visual direction:** FintechX-style light premium SaaS layout × **Señal Editorial** palette (paper / ink / charcoal / `#E10600`). Distinct from v1 editorial brutalism.

## Preview

```bash
cd /workspace/merlat-landing-v2-fusion
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

## Sections (slim · pump.fun traders)

1. Nav · 2. Hero + stats · 3. Product preview (phone mock) · 4. Why LATAM · 5. Raise + use of funds · 6. Token · 7. FAQ (3) · 8. Final CTA · Footer

Removed from main scroll: How it works / features · trust strip · 5-phase roadmap.

## Files

`index.html` · `styles.css` · `script.js` · `assets/logo.svg` · `VERSION.md` · this README

See `VERSION.md` for v1 vs v2 relationship.

## GitHub Pages

Static site ready for project Pages: root `index.html`, relative `styles.css` / `script.js` / `assets/`. Replace `{{PLACEHOLDERS}}` before public launch. Do not invent raised amounts or licenses.
