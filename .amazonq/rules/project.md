---
name: clone-website
description: Reverse-engineer and clone a website in one shot — extracts assets, CSS, and content section-by-section using HTML, CSS, JavaScript and CDN libraries for pixel-perfect animations. Use this whenever the user wants to clone, replicate, rebuild, reverse-engineer, or copy any website. Also triggers on phrases like "make a copy of this site", "rebuild this page", "pixel-perfect clone". Provide the target URL as an argument.
argument-hint: "<url>"
user-invocable: true
---

# Clone Website

You are about to reverse-engineer and rebuild **$ARGUMENTS** as a pixel-perfect clone using **HTML, CSS, and JavaScript** with **CDN libraries** for animations and advanced UI — no build tools, no transpilation.

This is not a two-phase process (inspect then build). You are a **foreman walking the job site** — as you inspect each section of the page, you write a detailed specification to a file, then build it section by section. Extraction and construction are meticulous and produce auditable artifacts.

## Pre-Flight

1. **Playwright is required for screenshots and extraction.** Verify Node.js is available: `node --version`. If not, stop and tell the user to install it.

2. **MANDATORY: Create a dedicated project folder.** The clone MUST live in its own isolated directory — NEVER scatter files across the workspace root or mix them with existing project files.
   - Extract the **domain name** from `$ARGUMENTS` (e.g., `https://mode.com/` → `mode-com`, `https://example.org/pricing` → `example-org`).
   - Create the folder: `site-<domain>/` in the workspace root (e.g., `site-mode-com/`).
   - **ALL files** for this clone go inside that folder — HTML, CSS, JS, images, fonts, docs, scripts. Nothing outside it.
   - If the folder already exists, ask the user: continue (overwrite) or pick a different name.
   - From this point forward, every path in this skill is **relative to the project folder**, not the workspace root.

3. Inside the project folder, create `TARGET.md` with the URL and scope. If the file already exists and the URL doesn't match `$ARGUMENTS`, update it.

4. Verify the project structure exists inside the project folder:
   ```
   site-<domain>/
     index.html          ← main page (what you are building)
     TARGET.md           ← URL and scope
     assets/
       css/              ← all stylesheets
       js/               ← all scripts
       img/              ← all images (.webp preferred, fallback .png/.jpg/.svg)
       fonts/            ← self-hosted font files (.woff2, .woff)
     docs/
       research/         ← extraction artifacts, specs
       design-references/ ← screenshots
     scripts/            ← Node.js helper scripts (download, extract, qa)
   ```

5. Create missing directories inside the project folder: `docs/research/`, `docs/research/components/`, `docs/design-references/`, `scripts/`, `assets/css/`, `assets/js/`, `assets/img/`, `assets/fonts/`.

6. **No npm install, no build step.** The clone opens directly in a browser as a static HTML file. All third-party libraries load via CDN `<script>` / `<link>` tags in `index.html`.

---

## Third-Party Libraries — CDN Toolkit

You MUST use CDN libraries to match the original site's animations and behaviors as closely as possible. Analyze what the original uses and pick the right tools.

### Detecting What the Original Uses

During reconnaissance, check for these in the page source and network requests:
- **Smooth scroll:** Look for `.lenis` class, `data-scroll` attributes, Locomotive Scroll, or Lenis
- **Animations:** Look for GSAP's `.gsap`, ScrollTrigger, AOS `data-aos` attributes, Framer Motion
- **Sliders/Carousels:** Swiper, Slick, Splide, Embla
- **Parallax:** simpleParallax.js, Rellax, or GSAP ScrollTrigger
- **Lightbox:** GLightbox, Fancybox
- **Counters / Typing:** CountUp.js, Typed.js
- **Scroll-driven progress/reveal:** ScrollMagic, Waypoints, AOS

Run this in Playwright to detect libraries:
```javascript
page.evaluate(() => {
  const scripts = [...document.querySelectorAll('script[src]')].map(s => s.src);
  const links = [...document.querySelectorAll('link[href]')].map(l => l.href);
  const hasLenis = !!document.querySelector('.lenis') || !!window.Lenis;
  const hasGSAP = !!window.gsap;
  const hasAOS = !!window.AOS;
  const hasSwiper = !!window.Swiper;
  const hasLoco = !!window.LocomotiveScroll;
  return { scripts, links, hasLenis, hasGSAP, hasAOS, hasSwiper, hasLoco };
});
```

### Recommended Library Stack

Pick the libraries that best match what the original site does. Here is the go-to CDN toolkit — use these exact CDN URLs:

#### Smooth Scrolling
```html
<!-- Lenis smooth scroll (most modern sites use this) -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
```
```javascript
const lenis = new Lenis({ lerp: 0.1, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```

#### Scroll Animations (GSAP + ScrollTrigger)
```html
<!-- GSAP — the industry standard for scroll-driven animation -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
```
```javascript
gsap.registerPlugin(ScrollTrigger);
gsap.from('.hero__heading', {
  y: 60, opacity: 0, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.hero', start: 'top 80%' }
});
```

#### Lightweight Scroll Reveal (if GSAP is overkill)
```html
<!-- AOS — Animate On Scroll (simple declarative data-aos attributes) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2/dist/aos.css">
<script src="https://cdn.jsdelivr.net/npm/aos@2/dist/aos.js"></script>
```
```html
<div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">...</div>
```
```javascript
AOS.init({ once: true, offset: 80 });
```

#### Sliders / Carousels
```html
<!-- Swiper — modern touch slider -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

#### Parallax
```html
<!-- simpleParallax.js -->
<script src="https://cdn.jsdelivr.net/npm/simple-parallax-js@5/dist/simpleParallax.min.js"></script>
```

#### Number Counter Animation
```html
<!-- CountUp.js -->
<script src="https://cdn.jsdelivr.net/npm/countup.js@2/dist/countUp.umd.js"></script>
```

#### Typewriter Effect
```html
<!-- Typed.js -->
<script src="https://cdn.jsdelivr.net/npm/typed.js@2/dist/typed.umd.js"></script>
```

#### Lightbox for Images/Videos
```html
<!-- GLightbox -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3/dist/css/glightbox.min.css">
<script src="https://cdn.jsdelivr.net/npm/glightbox@3/dist/js/glightbox.min.js"></script>
```

#### CSS Animation Utilities
```html
<!-- Animate.css — premade animation classes -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css@4/animate.min.css">
```

### Decision Logic

During reconnaissance, determine which libraries to use:

| Original site behavior | Use this |
|---|---|
| Smooth buttery scroll (not native) | **Lenis** |
| Elements fade/slide/scale on scroll | **GSAP + ScrollTrigger** (complex) or **AOS** (simple) |
| Horizontal scroll / pinned sections | **GSAP + ScrollTrigger** (pin, scrub) |
| Image/card carousel | **Swiper** |
| Parallax background layers | **simpleParallax** or **GSAP ScrollTrigger** |
| Number counts up to value | **CountUp.js** |
| Text types itself | **Typed.js** |
| Image/video opens in overlay | **GLightbox** |
| Simple entrance animations only | **AOS** (lightest option) |
| Complex timeline sequences | **GSAP** |

**Rule: If the original site uses GSAP, always use GSAP.** If it uses simpler scroll-reveal (AOS-style), use AOS. If unsure, default to **GSAP + ScrollTrigger** — it handles 90% of animation needs.

### CDN Script Order in `index.html`

Place all CDN links/scripts BEFORE your own files:
```html
<head>
  <!-- Third-party CSS first -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2/dist/aos.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
  <!-- Your CSS last (overrides as needed) -->
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <!-- ... HTML ... -->

  <!-- Third-party JS first -->
  <script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/aos@2/dist/aos.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <!-- Your JS last (initializes everything) -->
  <script src="assets/js/main.js"></script>
</body>
```

Only include libraries you actually use — don't load everything speculatively.

---

## CRITICAL: Token-Efficiency Rules (Lessons Learned)

These rules exist because violating them caused 500K-1M+ wasted tokens in past sessions. **Follow them exactly.**

### Rule 1: Single Class Namespace — NEVER Mix Original + Clone Classes

**Problem:** CSS was generated using the original site's class names (`.pb-row-hero__title`), but HTML used simplified BEM names (`.hero__title`). Result: 100% CSS rewrite = ~500K wasted tokens.

**Fix — The Class Contract:**
1. During Phase 2, BEFORE writing any HTML or CSS, create `docs/research/CLASS_MAP.md` that maps every original class to a simplified BEM class.
2. **ALL three files (HTML, CSS, JS) MUST use the simplified BEM classes. NEVER the original site classes.**
3. CSS selectors must be written AFTER HTML structure is finalized, targeting the exact class names in the HTML.
4. When delegating to subagents: include the full CLASS_MAP and explicit instruction: "Use ONLY these class names."

**Class naming convention:**
```
section:     .hero, .services, .tech-stack, .testimonials, .cta
children:    .hero__title, .hero__text, .hero__buttons
modifiers:   .service--full, .btn--cta, .btn--outline
states:      .is-open, .is-active, .header--scrolled
```

### Rule 2: NEVER Hide Elements with CSS for GSAP Animation

**Problem:** CSS had `.js-reveal { opacity: 0; }`, AND GSAP did `gsap.from(el, { opacity: 0 })`. Double-hiding = blank page, multiple debug rounds = ~200K wasted tokens.

**Fix — GSAP Owns All Animation State:**
1. **NEVER add `opacity: 0` or `transform: translateY()` in CSS for elements that GSAP animates.** GSAP's `gsap.from()` sets its own initial state.
2. Elements are visible by default in CSS. GSAP hides them at runtime just before animating.
3. **NEVER use a generic `.js-reveal` CSS class that sets opacity to 0.** If you want a marker class, use it ONLY as a JS selector, not a CSS rule.
4. For the hero section specifically: do NOT apply generic scroll-reveal animations — hero elements are above the fold and need their own `gsap.from()` with no ScrollTrigger (they animate on page load, not on scroll).

**Correct pattern:**
```css
/* CSS: elements are visible by default — NO opacity:0 anywhere */
.hero__title { font-size: 80px; /* visible */ }
```
```javascript
/* JS: GSAP handles the from-state at runtime */
gsap.from('.hero__title', { opacity: 0, y: 60, duration: 0.8, ease: 'power3.out' });
```

**Incorrect pattern (BANNED):**
```css
.js-reveal { opacity: 0; transform: translateY(40px); } /* NEVER DO THIS */
```

### Rule 3: QA Screenshots Must Scroll First

**Problem:** Playwright `fullPage: true` captures the full DOM but doesn't trigger GSAP ScrollTrigger animations below the fold. Result: blank sections in screenshots → false bug reports → wasted debug cycles.

**Fix — Always Scroll Before Screenshot:**
```javascript
async function triggerAllAnimations(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const vh = await page.evaluate(() => window.innerHeight);
  for (let y = 0; y < height; y += vh * 0.5) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(400);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
}
```
Call `triggerAllAnimations(page)` BEFORE every `page.screenshot({ fullPage: true })`.

### Rule 4: Avoid Double-Animating Elements

**Problem:** A `.js-reveal-group` stagger animation AND individual `.js-reveal` animations both targeted the same children → conflicting tweens → invisible elements.

**Fix:** In JS, track which elements are already part of a group animation and skip them in the individual loop:
```javascript
const grouped = new Set();
document.querySelectorAll('.js-reveal-group').forEach(group => {
  const kids = group.querySelectorAll('.js-reveal');
  kids.forEach(k => grouped.add(k));
  gsap.from(kids, { opacity: 0, y: 60, stagger: 0.15, scrollTrigger: { trigger: group, start: 'top 85%' } });
});
document.querySelectorAll('.js-reveal').forEach(el => {
  if (grouped.has(el)) return; // skip — already animated by group
  gsap.from(el, { opacity: 0, y: 60, scrollTrigger: { trigger: el, start: 'top 85%' } });
});
```

### Rule 5: Max 2 QA Rounds

**Problem:** 4+ QA cycles with growing input context = exponential token burn.

**Fix:**
1. **Round 1 (comprehensive):** Take screenshots, list ALL issues, fix ALL of them in one batch.
2. **Round 2 (verification):** Take final screenshots. If minor issues remain, note them in the completion report but do NOT start Round 3.
3. If Round 1 screenshots show a blank page or catastrophic failure, check for Rule 2/Rule 4 violations first.

### Rule 6: Use Local Server for QA, Not file:// Protocol

CDN scripts may fail to load from `file://` due to CORS. Always use a local server:
```javascript
// In qa-screenshot.mjs, use http://localhost:PORT, NOT file:///
// Start with: npx serve site-folder -l PORT
```

---

## Guiding Principles

### 1. Completeness Beats Speed

Every section spec must contain **everything** needed to build it perfectly: screenshot, exact CSS values, downloaded assets with local paths, real text content, DOM structure. If you have to guess anything — a color, a font size, a padding value — you have failed at extraction.

### 2. Sections, Not Components

This is HTML/CSS/JS — there are no React components. Think in **sections**: each major visual block of the page becomes a `<section>` (or `<header>`, `<footer>`) in `index.html` with its own CSS block in `assets/css/style.css` and JS in `assets/js/main.js`.

### 3. Real Content, Real Assets

Extract the actual text, images, videos, and SVGs from the live site using Playwright. Download every image to `assets/img/`. Convert images to `.webp` when possible. Extract inline `<svg>` elements and save them inline in the HTML or as separate `.svg` files.

### 4. Foundation First

Before writing any section HTML, establish:
- `assets/css/style.css` — CSS variables (colors, fonts), global reset, base styles
- `assets/fonts/` — all self-hosted font files downloaded
- `index.html` skeleton — `<!DOCTYPE html>`, `<head>` with meta, CDN links, CSS link, base structure

### 5. Match Animations Precisely

Don't just make elements appear — match **how** they appear. Extract:
- **Easing curve:** `ease`, `power3.out`, `cubic-bezier(0.16, 1, 0.3, 1)` — the easing changes the feel dramatically
- **Duration:** 0.3s feels snappy, 1.2s feels smooth — extract the actual timing
- **Delay / Stagger:** elements that appear one after another need stagger delays
- **Direction:** fade-up, fade-left, scale-from-center, blur-in — match the exact direction
- **Scroll trigger point:** when does the animation fire? At `top 80%`? At `top center`?

Use `getComputedStyle()` for CSS transitions. For JS-driven animations, read the source or observe the behavior frame by frame.

### 6. Extract How It Looks AND How It Behaves

A website is not a screenshot — it's a living thing. For every section, extract:
- **Appearance:** exact computed CSS values via `getComputedStyle()`
- **Behavior:** what changes, what triggers the change, how the transition works

Behaviors to watch for:
- Navbar that changes on scroll (background, shadow, size)
- Elements that animate into view on scroll (fade, slide, scale, blur)
- Hover states on buttons, cards, links (color, scale, shadow transitions)
- Mobile hamburger menu with open/close animation
- Smooth scroll (Lenis, Locomotive — replicate with Lenis CDN)
- Auto-playing carousels or cycling content (Swiper CDN)
- Tabbed/pill content switching
- Scroll-snap sections
- Parallax background layers
- Pinned/sticky sections during scroll
- Text typing or counter animations
- Stagger animations (multiple elements appearing one by one)

### 7. Identify the Interaction Model Before Building

Before writing any JS for a section, determine: **Is this driven by clicks, scrolls, hovers, time, or a combination?**

### 8. CSS Architecture

Use a single `assets/css/style.css` file with this structure:
1. `@font-face` declarations
2. CSS custom properties (`:root { --color-...: ...; }`)
3. Global reset
4. Base styles (body, headings, links, img)
5. Utility classes (.container, .btn, etc.)
6. Section-specific styles, each commented: `/* === SECTION: NavBar === */`
7. Responsive media queries at the end

### 9. JavaScript Architecture

Use `assets/js/main.js` organized as:
1. Library initialization (Lenis, AOS, GSAP ScrollTrigger registration)
2. Per-section animation/behavior blocks, each commented: `/* === NavBar === */`
3. DOMContentLoaded wrapper for initialization

Use CDN libraries for complex behavior. Use vanilla JS for simple DOM manipulation (hamburger menu, tab switching).

### 10. Spec Files Are the Source of Truth

Every section gets a spec file in `docs/research/components/` BEFORE building it. This is the contract between extraction and implementation.

---

## Phase 1: Reconnaissance

Use a Playwright Node.js script (`scripts/extract.mjs`) to navigate to the target URL.

### Screenshots
- Full-page screenshots at desktop (1440px) and mobile (390px)
- Save to `docs/design-references/desktop-full.png` and `docs/design-references/mobile-full.png`
- Section-by-section viewport screenshots for reference

### Global Extraction

Run a Playwright script to extract:

**Fonts** — Check `<link>` tags for Google Fonts or self-hosted fonts. Download all `.woff2`/`.woff` files to `assets/fonts/`. Add `@font-face` rules to `assets/css/style.css`.

**Colors** — Extract computed `backgroundColor`, `color` from key elements. Define as CSS custom properties in `:root`.

**Favicons & Meta** — Download to `assets/img/`. Note all meta tags for `<head>`.

**Libraries used** — Detect GSAP, Lenis, AOS, Swiper, Locomotive, etc. Record in `docs/research/BEHAVIORS.md` which libraries to include via CDN.

**Animation patterns** — For each section, record:
- What animates (heading, image, card, etc.)
- Trigger (scroll position, viewport entry, time)
- Animation type (fade-up, slide-left, scale, blur, parallax)
- Duration, easing, delay, stagger
- Library used (CSS transition, GSAP, AOS, custom JS)

### CSS Extraction Script

Run for each major section container to get exact computed styles:

```javascript
(function extractCSS(selector) {
  const el = document.querySelector(selector);
  if (!el) return { error: 'not found: ' + selector };
  const props = [
    'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
    'textTransform','backgroundColor','background',
    'paddingTop','paddingRight','paddingBottom','paddingLeft',
    'marginTop','marginBottom','width','height','maxWidth','minWidth',
    'display','flexDirection','justifyContent','alignItems','gap',
    'gridTemplateColumns','borderRadius','border','boxShadow',
    'position','top','right','bottom','left','zIndex',
    'opacity','transform','transition','overflow','objectFit','mixBlendMode'
  ];
  function getStyles(el) {
    const cs = getComputedStyle(el);
    const out = {};
    props.forEach(p => { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0,0,0,0)') out[p] = v; });
    return out;
  }
  function walk(el, depth) {
    if (depth > 4) return null;
    return {
      tag: el.tagName.toLowerCase(),
      cls: el.className?.toString().slice(0, 80),
      text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent.trim().slice(0, 150) : null,
      styles: getStyles(el),
      img: el.tagName === 'IMG' ? { src: el.src, alt: el.alt } : null,
      children: [...el.children].slice(0, 15).map(c => walk(c, depth + 1)).filter(Boolean)
    };
  }
  return walk(el, 0);
})('SELECTOR_HERE');
```

### Mandatory Interaction Sweep

After screenshots, scroll through the page and record:

**Scroll sweep:** Does the header change? Do elements animate in? Are there scroll-snap points? Does the scroll feel smooth (Lenis)?

**Click sweep:** Click every button, tab, link. What changes?

**Hover sweep:** Hover over buttons, cards, nav links. What CSS properties change? What's the transition timing?

**Responsive sweep:** Test at 1440px, 768px, 390px. Record what collapses/stacks/hides.

Save findings to `docs/research/BEHAVIORS.md`. **Include a "Libraries to Use" section** listing every CDN library needed and why.

### Page Topology

Map every distinct section top to bottom. Document:
- Visual order, element type (header/section/footer)
- Fixed vs. flow content
- Interaction model (static / click-driven / scroll-driven / time-driven)
- **Animation type per element** (e.g., "heading: fade-up 0.8s power3.out", "image: scale-in 1s on scroll")
- Dependencies (nav overlays everything, etc.)

Save to `docs/research/PAGE_TOPOLOGY.md`.

---

## Phase 2: Foundation Build

### 0. Define the Class Map (MANDATORY — Do This First)

Before writing ANY HTML or CSS, create `docs/research/CLASS_MAP.md`:

```markdown
# Class Map — Original → Clone

## Naming Convention: simplified BEM
- Section: .hero, .services, .testimonials
- Children: .hero__title, .hero__text, .hero__buttons
- Modifiers: .service--full, .btn--cta

## Sections
| Original class | Clone class | Element |
|---|---|---|
| .pb-row-hero | .hero | Hero section |
| .pb-row-hero__title | .hero__title | Hero heading |
| .pb-row-services__service | .service | Service card |
| ... | ... | ... |
```

**This file is the single source of truth.** HTML, CSS, and JS all reference ONLY the "Clone class" column.

### 1. Download Fonts
Write and run `scripts/download-assets.mjs` to download all font files to `assets/fonts/`.

### 2. Download Images
Download all images to `assets/img/`. Prefer `.webp`. For SVG logos/icons, save as `.svg`.

### 3. Create `assets/css/style.css`
Structure:
```css
/* === FONTS === */
@font-face { font-family: ...; src: url('../fonts/...') format('woff2'); }

/* === CSS VARIABLES === */
:root {
  --color-primary: #...;
  --color-bg: #...;
  --font-heading: 'FontName', serif;
  --font-body: 'FontName', sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

/* === RESET === */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-body); }
h1, h2, h3, h4 { font-family: var(--font-heading); font-weight: 400; }
img, video { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }

/* === UTILITIES === */
.container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
.btn { ... }

/* === SECTION: NavBar === */
/* ... */

/* === RESPONSIVE === */
@media (max-width: 768px) { ... }
```

### 4. Create `index.html` skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="...">
  <title>...</title>
  <!-- CDN CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2/dist/aos.css">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

  <!-- sections go here -->

  <!-- CDN JS -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
  <!-- Custom JS -->
  <script src="assets/js/main.js"></script>
</body>
</html>
```

### 5. Create `assets/js/main.js` skeleton
```javascript
'use strict';

/* === LIBRARY INIT === */
// Lenis smooth scroll
const lenis = new Lenis({ lerp: 0.1, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// AOS init (if using AOS instead of/alongside GSAP)
// AOS.init({ once: true, offset: 80, duration: 800 });

/* === SECTION: NavBar === */
// ...

/* === SECTION: Hero === */
gsap.from('.hero__heading', {
  y: 60, opacity: 0, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.hero', start: 'top 80%' }
});

document.addEventListener('DOMContentLoaded', () => {
  // init hamburger, tabs, etc.
});
```

---

## Phase 3: Section Specification & Build

For each section (top to bottom), do THREE things: **extract CSS**, **write spec file**, **build HTML+CSS+JS**.

### Step 1: Extract

For each section:
1. Screenshot the section (viewport screenshot at that scroll position)
2. Run the CSS extraction script on the section's container element
3. Extract multi-state styles (scroll-triggered, hover, active)
4. **Extract animation details:** what elements animate, trigger, duration, easing, direction, stagger
5. Extract all text content verbatim
6. Identify all images used

### Step 2: Write Spec File

**Path:** `docs/research/components/<section-name>.spec.md`

**Template:**
```markdown
# <SectionName> Specification

## Overview
- **Target:** `<section id="...">` in index.html
- **Screenshot:** docs/design-references/<name>.png
- **Interaction model:** static | click-driven | scroll-driven | time-driven

## HTML Structure
<element hierarchy>

## Exact CSS Values (from getComputedStyle)
### Container
- background-color: ...
- padding: ...

### <Child>
- font-size: ...
- color: ...

## Animations
### <Element> entrance
- **Library:** GSAP / AOS / CSS transition
- **Trigger:** scroll enters viewport at 80% | page load | hover
- **Animation:** fade-up / slide-left / scale-in / blur-in
- **From state:** opacity: 0; y: 60px
- **To state:** opacity: 1; y: 0
- **Duration:** 0.8s
- **Easing:** power3.out / ease / cubic-bezier(0.16,1,0.3,1)
- **Delay:** 0s (or stagger 0.15s per child)
- **GSAP code:** `gsap.from('.el', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: {...} })`
- **AOS alternative:** `data-aos="fade-up" data-aos-duration="800"`

## Hover States
- **<element>:** transform: scale(1) → scale(1.03), box-shadow: none → 0 8px 30px rgba(0,0,0,0.12), transition: all 0.3s var(--ease-out)

## Assets
- Images: assets/img/<file>

## Text Content (verbatim)
<copy-pasted text>

## Responsive
- Desktop (1440px): ...
- Tablet (768px): ...
- Mobile (390px): ...
```

### Step 3: Build (HTML → CSS → JS, in that order)

**CRITICAL: Build in this exact order for each section:**
1. **Write HTML first** — defines the class names (from CLASS_MAP.md)
2. **Write CSS second** — targets EXACTLY the classes from the HTML you just wrote
3. **Write JS last** — targets EXACTLY the same selectors

**Never generate CSS before HTML exists.** This is the #1 cause of class mismatch bugs.

**HTML conventions:**
- Semantic elements: `<header>`, `<nav>`, `<section>`, `<footer>`
- `id` on each section matching spec name
- BEM-style classes from CLASS_MAP: `.hero`, `.hero__title`, `.hero__buttons`
- All images: `<img src="assets/img/..." alt="..." loading="lazy">`
- **Do NOT add `.js-reveal` classes with CSS `opacity: 0`.** Use `.js-reveal` only as a JS selector hook if needed.
- For Swiper: use Swiper's required HTML structure (`.swiper > .swiper-wrapper > .swiper-slide`)
- **Hero section elements should NOT have scroll-reveal classes** — they are above the fold

**CSS conventions:**
- Comment each section: `/* === SECTION: Hero === */`
- CSS custom properties for all colors, fonts, easings
- Desktop-first for cloning
- `@media` queries in RESPONSIVE section at bottom
- **NEVER set `opacity: 0` or `visibility: hidden` on elements that GSAP will animate**

**JS conventions:**
- Comment each section: `/* === Hero === */`
- GSAP for complex scroll animations (timeline, stagger, pin)
- AOS for simple fade-in-on-scroll
- Vanilla JS for hamburger menus, tab switching, simple toggles
- Swiper for carousels
- Lenis for smooth scroll
- **Track grouped elements to avoid double-animation** (see Rule 4 above)
- **Hero animations: use `gsap.from()` WITHOUT ScrollTrigger** (they fire on page load)

Build sections sequentially, verifying after each one.

---

## Phase 4: Visual QA (Max 2 Rounds)

After all sections are built:

### 0. Start a local server (MANDATORY)

```bash
npx serve site-<domain> -l 3456
```

**Never use `file:///` for QA screenshots** — CDN scripts fail to load via file protocol.

### 1. Take QA screenshots (with scroll-trigger)

```javascript
// scripts/qa-screenshot.mjs
import { chromium } from 'playwright';
import path from 'path';

const BASE = path.resolve(import.meta.dirname, '..');
const DESIGN = path.join(BASE, 'docs', 'design-references');

async function triggerAllAnimations(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const vh = await page.evaluate(() => window.innerHeight);
  for (let y = 0; y < height; y += vh * 0.5) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(400);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Desktop
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3456', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);
await triggerAllAnimations(page);
await page.screenshot({ path: path.join(DESIGN, 'qa-desktop-full.png'), fullPage: true });

// Per-section screenshots
const sections = [
  { name: 'hero', sel: '#hero' },
  { name: 'services', sel: '#services' },
  { name: 'testimonials', sel: '#testimonials' },
  { name: 'footer', sel: '.site-footer' },
  // add more as needed
];
for (const { name, sel } of sections) {
  const el = await page.$(sel);
  if (el) {
    try { await el.screenshot({ path: path.join(DESIGN, `qa-${name}.png`) }); } catch {}
  }
}

// Mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(2000);
await triggerAllAnimations(page);
await page.screenshot({ path: path.join(DESIGN, 'qa-mobile-full.png'), fullPage: true });

await browser.close();
```

**KEY: `triggerAllAnimations()` must run before EVERY `fullPage` screenshot.** Without it, GSAP ScrollTrigger animations below the fold won't fire and sections will appear blank.

### 2. QA Round 1: Comprehensive fix batch
- Review EVERY section screenshot against originals
- List ALL issues in one pass
- Fix ALL issues in one batch (CSS, HTML, JS together)
- Retake screenshots

### 3. QA Round 2: Verification only
- Retake screenshots one final time
- If minor issues remain, note them in the completion report
- **DO NOT start Round 3.** Diminishing returns kick in hard.

### 4. If screenshots show blank sections
Before debugging anything else, check:
1. Are CDN scripts loading? (Use `http://localhost`, not `file://`)
2. Does CSS have `opacity: 0` on animated elements? (Remove it — see Rule 2)
3. Are elements double-animated? (Check for group + individual conflicts — see Rule 4)
4. Did you scroll before screenshotting? (See `triggerAllAnimations` above)

---

## Pre-Build Checklist

Before building any section, verify:

- [ ] Spec file written to `docs/research/components/<name>.spec.md`
- [ ] Every CSS value from `getComputedStyle()`, not estimated
- [ ] Interaction model documented (static / click / scroll / time)
- [ ] **Animation details captured:** library, trigger, from/to states, duration, easing, delay, stagger
- [ ] All hover states captured with transition timing
- [ ] All images downloaded to `assets/img/`
- [ ] All text content verbatim
- [ ] Responsive behavior documented for desktop + mobile
- [ ] Required CDN libraries listed

---

## Handling Non-Downloadable Visual Content (WebGL, Canvas, 3D, Video)

Many modern sites render key visuals using WebGL, Three.js, `<canvas>`, or embedded video players. These visuals **cannot be cloned** with HTML/CSS/JS — they require runtime rendering engines. **Never leave empty placeholder areas** with gradient backgrounds or text like "3D Experience". Instead:

### Detection

During reconnaissance, check if the site uses:
- A fixed `<canvas>` element behind the page content
- Three.js, Babylon.js, PixiJS, or other WebGL libraries
- Video-based hero sections or project thumbnails
- Lottie/Rive animations embedded in iframes or canvas

```javascript
page.evaluate(() => {
  const canvas = document.querySelector('canvas');
  const hasThree = !!window.THREE;
  const hasPixi = !!window.PIXI;
  const videos = [...document.querySelectorAll('video')].length;
  return { hasCanvas: !!canvas, canvasSize: canvas ? { w: canvas.width, h: canvas.height } : null,
           hasThree, hasPixi, videoCount: videos };
});
```

### Strategy: Screenshot as Fallback Image

When visual content is rendered by WebGL/canvas/video, **capture it as a screenshot and use the screenshot as a static `<img>` in the clone**:

1. **Navigate to the live site** with Playwright (`headless: true` — Chromium renders WebGL)
2. **Wait for WebGL to render** — at least 8-12 seconds after `domcontentloaded`
3. **Scroll to the element's position** using `page.mouse.wheel(0, amount)` — NOT `window.scrollTo()`, which doesn't work with custom scroll systems (Lenis, Locomotive)
4. **Wait for Lenis/scroll to settle** — 1-2 seconds after each scroll step
5. **Get the element's bounding box** via `getBoundingClientRect()` and capture a clipped screenshot
6. **Save to `assets/img/`** and use `<img src="...">` in the HTML

### Scroll Handling for Lenis/Custom Scroll Sites

Sites using Lenis or Locomotive Scroll use CSS transforms instead of native scroll. Standard `window.scrollTo()` and `element.scrollIntoView()` do NOT work. Use mouse wheel events:

```javascript
// Scroll incrementally and check position
async function scrollToElement(page, targetY) {
  let attempts = 0;
  while (attempts < 100) {
    const box = await page.evaluate(sel => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect() : null;
    }, selector);
    if (box && box.y >= 50 && box.y < 400) break; // in viewport
    const delta = box.y > 400 ? Math.min(box.y - 150, 400) : Math.max(box.y - 100, -400);
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(350);
    attempts++;
  }
  await page.waitForTimeout(1500); // let Lenis settle
}
```

### Rules for Visual Placeholders

- **NEVER** use gradient divs with text labels as placeholders (e.g., `<div style="background: linear-gradient(...)">Project Name</div>`)
- **ALWAYS** capture the actual rendered content via Playwright screenshot and use `<img>` tags
- Use `<img>` with `width: 100%; height: auto;` for natural sizing — no `padding-top` aspect-ratio hacks needed when you have a real image
- Remove any `position: absolute; inset: 0;` patterns that were designed for empty containers
- If the screenshot includes page chrome (header/nav overlays), crop it out by adjusting the clip coordinates

### Example: Capturing Project Thumbnails from a WebGL Gallery

```javascript
// For each project card, scroll into view and screenshot
for (let i = 0; i < projectCount; i++) {
  // Scroll to project using mouse.wheel
  await scrollToElement(page, `.project-item:nth-child(${i + 1}) .project-item-main`);
  
  const box = await page.evaluate(i => {
    const items = document.querySelectorAll('.project-item');
    const main = items[i]?.querySelector('.project-item-main');
    if (!main) return null;
    const r = main.getBoundingClientRect();
    return { x: Math.max(0, Math.round(r.left)), y: Math.max(0, Math.round(r.top)),
             width: Math.round(r.width), height: Math.round(r.height) };
  }, i);
  
  if (box && box.width > 50 && box.y >= 0 && (box.y + box.height) <= viewportHeight + 5) {
    await page.screenshot({ path: `assets/img/project-${name}.png`, clip: box });
  }
}
```

### Every Section Must Have a Visual Element

A cloned website must **never** have a section that is text-only if the original had any kind of visual (WebGL, image, video, canvas art). For each section of the original site:

1. **Audit every section for visual content** during reconnaissance. At each scroll position, take a viewport screenshot and note what visual elements are present (3D scenes, images, videos, animations, decorative graphics).

2. **Capture a screenshot for every section** that has non-downloadable visual content. Don't skip sections just because the visual is "secondary" or "decorative" — it defines the feel of the page.

3. **Match the visual placement** in the clone. If the original has a visual on the LEFT and text on the RIGHT, preserve that layout:
   ```html
   <div id="section-visual" style="grid-column: 1 / span 5;">
     <img src="assets/img/section-visual.png" alt="...">
   </div>
   <div id="section-content" style="grid-column: 7 / span 6;">
     <p>Description text...</p>
   </div>
   ```

4. **Add GSAP entrance animations** for every visual element:
   - Images entering from the side: `gsap.from('#visual', { x: -80, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: {...} })`
   - Background images: `gsap.from('#bg', { scale: 1.15, opacity: 0, duration: 2, ease: 'power2.out', scrollTrigger: {...} })`
   - Text overlaying dark backgrounds: add `text-shadow: 0 2px 30px rgba(0,0,0,0.5)` for readability

5. **For full-viewport dark sections** (CTA, tunnel, immersive), use the captured screenshot as a background image with `position: absolute; object-fit: cover; opacity: 0.7;` and ensure all content sits above it with `position: relative; z-index: 1;`

6. **Fine-grained scroll sweeps** are required for sites with scroll-dependent 3D content. Capture screenshots at 200-400px scroll increments through the entire page, since the WebGL canvas shows different content at each position.

### Reducing Dead Space

When replacing WebGL/canvas areas with static screenshots:
- Remove `min-height: 100vh` from sections that were sized for full-screen 3D content
- Remove `flex-grow: 1` spacers in footers or between sections
- Reduce excessive vertical padding (`padding-bottom: 20vh` → `10vh`)
- The image's natural aspect ratio replaces the need for `padding-top: 56.25%` aspect-ratio hacks

---

## What NOT to Do

### Architecture
- **Don't use React/Vue/Angular.** HTML + CSS + JS + CDN libraries only.
- **Don't use npm/bundlers.** No webpack, Vite, Parcel. CDN scripts + static files only.
- **Don't link to external CDNs for fonts** — download fonts locally. CDNs are only for JS/CSS libraries.
- **Don't write inline `style=""` attributes** — all styles in `assets/css/style.css`.
- **Don't load CDN libraries you don't use.** Only include what's needed.

### CSS/HTML Alignment (HIGH-COST BUGS)
- **Don't generate CSS before HTML exists.** Always write HTML first, then CSS targeting those exact classes.
- **Don't use original site class names in clone CSS.** Use only simplified BEM from CLASS_MAP.md.
- **Don't set `opacity: 0` in CSS on GSAP-animated elements.** GSAP manages its own initial state.
- **Don't use `.js-reveal { opacity: 0 }` in CSS.** Use `.js-reveal` only as a JS selector, never a CSS rule.
- **Don't apply scroll-reveal classes to hero elements.** They're above the fold — use page-load animations.
- **Don't animate the same element from two different GSAP sources.** Track grouped vs. individual elements.

### Extraction
- **Don't approximate CSS.** Extract the actual computed value.
- **Don't skip assets.** Without real images and fonts, the clone looks fake.
- **Don't skip the spec file.** It forces exhaustive extraction.

### Animations
- **Don't write animations from scratch when a CDN library does it better.** Use GSAP for scroll-driven animation, not manual IntersectionObserver + CSS classes.
- **Don't use IntersectionObserver when GSAP ScrollTrigger is already loaded.** GSAP handles it better.
- **Don't build click-based tabs when the original is scroll-driven.**
- **Don't forget to connect Lenis to GSAP** if using both — otherwise ScrollTrigger won't track Lenis scroll position.

### QA
- **Don't use `file://` protocol for QA screenshots.** Use a local server (`npx serve`).
- **Don't take fullPage screenshots without scrolling first.** GSAP animations won't trigger.
- **Don't do more than 2 QA rounds.** Fix everything in Round 1, verify in Round 2, stop.
- **Don't miss overlay/layered images.**
- **Don't forget responsive breakpoints.** Test at 1440, 768, 390.

---

## Completion Report

When done, report:
- Total sections built
- Total HTML lines in `index.html`
- Total assets downloaded (images, fonts, SVGs)
- CDN libraries used and why
- Visual QA results (any remaining discrepancies)
- Any known gaps or limitations
- How to open: "Open `index.html` in any browser — no server required"
