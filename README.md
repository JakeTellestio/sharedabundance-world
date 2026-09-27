# Shared Abundance

Public website for [sharedabundance.world](https://sharedabundance.world) — an open proposal for building productive businesses with AI and automation, then sharing available surplus equally among eligible members.

**Status:** Open proposal · Version 0.1

## Stack

Plain semantic HTML, CSS, and a small amount of vanilla JavaScript. No framework. Hosted on GitHub Pages from the `main` branch with custom domain `sharedabundance.world`.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — proposition, process, and entry points |
| `/how-it-works/` | Model detail, finances, growth, industries, FAQ |
| `/business-001/` | Proposed first digital-services pilot |
| `/pioneers/` | Early support with temporary, defined terms |
| `/rules/` | Draft principles v0.1 and safeguards |
| `/progress/` | Milestones from concept to operation |
| `/contribute/` | Local contribution and proposal draft tools |

## Local preview

```bash
python3 -m http.server 8080
```

Open http://localhost:8080/

## Contribution drafts

Until a submission backend is configured, `/contribute/` keeps drafts in the browser and offers download (and copy for proposals). Nothing is sent to a server. Status messaging makes that explicit.

## Assets

Nineteen conceptual PNG illustrations live in `assets/`. They depict proposed applications of automation, not existing Shared Abundance operations.

## Configuration still needed (owner)

- Public submission / contact endpoint (optional)
- Contact email (only when confirmed for this site)
- Analytics, legal entity details, privacy policy (if/when applicable)
- DNS is already assumed configured for GitHub Pages; this repo keeps `CNAME` and `.nojekyll`

## License / notice

Site content presents a concept-stage proposal. Illustrations are conceptual artwork. Do not treat page examples as forecasts, accounts, or offers of investment.
