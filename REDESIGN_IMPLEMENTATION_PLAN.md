# TPTraining Redesign Blueprint (High-Conversion + Premium Scroll Experience)

## 1. Objectives
- Make the website feel premium, cinematic, and memorable.
- Increase conversion to contact/check funnel without visual clutter.
- Keep long coach and brand descriptions accessible and readable.
- Deliver excellent UX on desktop and mobile, with motion that degrades gracefully.

## 2. Current Website Audit (What to improve)
- The site is implemented as a single very large file (`index.html`) with inline CSS and JS, which slows iteration and creates style/behavior coupling.
- Many UI and animation patterns already exist, but motion is mostly local (reveal/tilt/parallax) and not orchestrated into a strong story.
- Tailwind is loaded from CDN in production mode, which is not ideal for performance and maintainability.
- Long-form text exists (good for trust), but the reading flow is mixed into many competing visual blocks.
- The booking wizard is strong, but mobile cannot open it and is redirected to contact.

## 3. Competitive Motion Benchmark (Yucca patterns worth adopting)
From visual and source review of [yucca.co.za](https://yucca.co.za):
- Uses an orchestrated motion stack (GSAP + ScrollTrigger + Lenis-style smooth scrolling + route transitions) for a unified feel.
- Strong section choreography: intro, headline entrance, structured content blocks, and clean pacing.
- Big typography, strict spacing, and fewer competing accents per viewport.

Your redesign should exceed this by adding stronger story flow and more emotionally engaging sports visuals while keeping usability clean.

## 4. New Visual Direction
Working theme: **Alpine Velocity**.

### Core look
- Palette: charcoal/graphite base, glacier white surfaces, controlled red accent (existing brand red remains primary action color).
- Typography pair:
  - Display: `Sora` or `Bricolage Grotesque` (bold, modern, athletic).
  - Body/UI: `Manrope` or `Plus Jakarta Sans`.
- Visual language:
  - Large cinematic imagery/video crops.
  - Layered glass and soft metallic gradients only where meaningful.
  - Cleaner card system with fewer always-visible elements.

### Desktop motion language
- Smooth scrolling with light inertia.
- Pinned chapters for key story beats.
- Depth transitions (scale + blur + parallax planes).
- Horizontal section only where it truly improves storytelling.

### Mobile motion language
- Native scrolling (no heavy smooth-scroll polyfill).
- Shorter, snappier transitions.
- No cluttered pin-stacks; simplify to vertical chapters.

## 5. Proposed Page Story Architecture
1. Hero film strip (pinned first viewport)
- Large statement: Train. Perform. Thrive.
- Cycling sport visuals behind text.
- One primary CTA + one secondary CTA.

2. "Choose your path" chapter
- 3 cards: Triathlon, MTB, Schule/Projekt.
- Scroll-linked active card highlight with subtle image pan.

3. Coaching methodology chapter
- 3-step process appears as timeline while scrolling.
- Each step has proof point and clear action.

4. Coach credibility chapter
- Portrait cards with concise summary first.
- "Read full story" opens expanded side panel/modal (desktop) or bottom sheet (mobile).
- Preserve all long original text verbatim in these expanded views.

5. Programme + pricing chapter
- Scroll-reveal package comparison with sticky recommendation panel.
- Keep current recommendation logic but present it earlier and more clearly.

6. Conversion chapter
- Keep multi-step Schnellstart funnel.
- Enable full funnel on mobile (not contact-only redirect).
- Add trust footer strip (response time, safety, youth focus, local presence).

## 6. Scroll Effects Spec (Beautiful but practical)
- Hero pin + crossfade media sequence.
- Text split reveal (line-by-line) for major headlines.
- Section parallax layers (background/media/foreground).
- Card stack transitions for sports and programme blocks.
- Progress-linked chapter indicator in the side rail (desktop) and top bar (mobile).
- Scroll-synced testimonial/proof quote transitions.

Guardrails:
- Respect `prefers-reduced-motion`.
- Keep transform/opacity-only animations where possible.
- No scroll jank: avoid layout-thrashing effects.

## 7. Content Strategy (No clutter + long descriptions preserved)
- Default: concise summaries in each section.
- Secondary: full descriptions hidden behind explicit "Read full story" controls.
- Add deep links to full descriptions, e.g. `#marco-story`, `#benjamin-story`.
- Keep current long biographies and company narrative unchanged in content, only change presentation.

## 8. Technical Implementation Strategy
### Recommended stack
- Build tool: Vite (static site output).
- Styling: Tailwind (compiled) + CSS variables.
- Motion: GSAP + ScrollTrigger.
- Smooth scroll: Lenis (desktop/tablet only).

### Code structure
- `src/data/content.json` for text and pricing content.
- `src/styles/tokens.css` for design tokens.
- `src/styles/components.css` for reusable sections.
- `src/scripts/motion/*.ts` for section-specific animation timelines.
- `src/scripts/booking/*.ts` for funnel logic.

## 9. Delivery Plan (Phased)
### Phase 1: Foundation (1-2 days)
- Split monolithic HTML/CSS/JS into modular structure.
- Set up build pipeline and production CSS.
- Preserve all existing content and working links.

### Phase 2: Visual system (2-3 days)
- Implement typography, spacing, color tokens, and component shells.
- Redesign hero and navigation for desktop/mobile parity.

### Phase 3: Motion system (3-4 days)
- Add GSAP + ScrollTrigger timelines for hero and chapter transitions.
- Add desktop smooth scroll + mobile fallbacks.
- Add reduced-motion branch.

### Phase 4: Conversion and long-text UX (2 days)
- Upgrade programme/pricing chapter and recommendation presentation.
- Enable mobile booking flow fully.
- Implement expandable long-story panels.

### Phase 5: Performance, QA, and polish (2 days)
- Image optimization and lazy-loading tuning.
- Cross-browser and responsive QA.
- Lighthouse, accessibility, and interaction bug-fixing.

## 10. Acceptance Criteria
- Motion feels premium and intentional on desktop, not gimmicky.
- Mobile remains clean and readable with fast interactions.
- All long original descriptions are preserved and easy to access.
- Funnel completion path exists and works on both mobile and desktop.
- Performance targets:
  - LCP under 2.5s on fast 4G.
  - CLS under 0.1.
  - No long tasks over 200ms during normal scroll.

## 11. Immediate Next Build Tasks
1. Set up Vite + Tailwind build and migrate `index.html` structure.
2. Build redesigned hero + chapter scaffolding (no motion yet).
3. Add GSAP timelines for hero pin, chapter transitions, and card stack.
4. Refactor booking wizard into reusable module and enable mobile flow.
5. Run responsive QA and refine based on real-device screenshots.
