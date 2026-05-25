# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static one-page website for **Sieker Friseur**, a hair salon in Bielefeld, Germany.
No build step, no framework — pure HTML/CSS/vanilla JS, deployable by dropping the folder onto any host.

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — no transpilation, no bundler, no package.json
- **Fonts:** Montserrat (headings, 600/700) + Inter (body, 400/500) via Google Fonts CDN
  - For strict DSGVO compliance, self-host instead (see TODO in `index.html`)
- **Booking system:** Simplybook.me embedded via `<iframe>` (free tier, salon-specific)
- **Cookie Consent:** custom implementation in `cookie-consent.js`, no third-party library
- **Analytics:** Google Analytics 4 + Meta Pixel, both gated behind cookie consent

## File Structure

```
index.html            Main page (single file, all sections)
style.css             All styles — mobile-first, CSS variables throughout
main.js               Navigation, hamburger menu, lightbox, booking fallback
cookie-consent.js     Cookie banner, tracker loading, Google Maps gating
DEPLOYMENT.md         Hosting & go-live guide (German, for the salon owner)
assets/
  logo.svg            SVG wordmark with scissors icon
  hero.svg            Hero image placeholder (replace with real .jpg)
  team-sipan.svg      Team photo placeholder
  gallery/01–06.svg   Gallery image placeholders
```

## Corporate Identity

```
--orange:    #F47F47   (primary CTA, accents)
--navy:      #1B3A5C   (headings, nav, footer)
--bg:        #F9F9F9   (page background)
--text:      #222222
```
All CI values are CSS custom properties in `:root` at the top of `style.css`.

## Architecture Notes

### Cookie Consent flow
`cookie-consent.js` exposes `window.CookieConsent` (IIFE). On load it calls `init()`:
- **First visit:** injects bottom banner into `<body>`; no trackers load
- **"Alle akzeptieren":** saves `sieker_cookie_consent = 'all'` to `localStorage`,
  then dynamically appends GA4 + Meta Pixel `<script>` tags and swaps the Maps iframe
  `src` from `about:blank` to the real Google Maps embed URL
- **"Nur notwendige":** saves `'necessary'`, no trackers ever load
- **Returning visitor (all):** trackers load immediately, no banner shown
- The footer "Cookie-Einstellungen" button calls `CookieConsent.show()` to re-open the banner

Google Maps iframe uses a `data-src` attribute pattern: the real URL sits in `data-src`
and is only moved to `src` after consent, so no request is made before acceptance.

### Section layout
All sections live in `index.html` in order: `#hero → #team → #salon → #termine → #kontakt → footer`.
Each section uses `<div class="container">` for max-width centering. Alternating sections
have `class="section-alt"` (white background) to break visual monotony.

### Booking placeholder detection
`main.js` checks if the iframe `src` still contains `IHRE-SUBDOMAIN` at load time.
If so, it hides the iframe and shows `#booking-fallback` with a phone link.
This prevents a broken embed on staging before the real account is configured.

## TODOs Before Go-Live

All placeholder locations are marked with `<!-- TODO: ... -->` or `/* TODO: ... */`:

| Location | What to replace |
|---|---|
| `cookie-consent.js` lines 14–17 | GA4 Measurement ID (`G-XXXXXXXXXX`) and Meta Pixel ID |
| `index.html` booking `<iframe src>` | `IHRE-SUBDOMAIN` → real Simplybook.me account name |
| `index.html` Google Maps `data-src` | Verify/update the embed URL for the exact address |
| `index.html` social `<a href>` | Replace `TODO-SIEKER-FRISEUR` placeholder slugs |
| `index.html` canonical + OG tags | Replace `https://www.sieker-friseur.de` with real domain |
| `assets/hero.svg` | Replace with `hero.jpg` (1440×720 px) and update `<img src>` |
| `assets/team-sipan.svg` | Replace with real photo, update `<img src>` in `#team` |
| `assets/gallery/01–06.svg` | Replace with real salon photos, update `src` attributes |
| `impressum.html`, `datenschutz.html` | Create these pages (linked from footer) |
