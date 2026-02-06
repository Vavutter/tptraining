import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import { content } from "./data/content";
import { initBooking } from "./scripts/booking";
import brandLogo from "../tptraining.png";
import {
  initHeroMotion,
  initPhaseThreeMotion,
  initMobileMenu,
  initProgressAndNav
} from "./scripts/motion";

function renderHeroFrames(media) {
  return media
    .map(
      (frame) => `
        <img
          src="${frame.src}"
          alt="${frame.alt}"
          class="hero-frame"
          data-hero-frame
          fetchpriority="high"
          decoding="async"
        />
      `
    )
    .join("");
}

function renderHeroStats(items) {
  return items
    .map(
      (item) => `
        <article class="hero-stat">
          <p class="hero-stat-value">${item.value}</p>
          <p class="hero-stat-label">${item.label}</p>
        </article>
      `
    )
    .join("");
}

function renderPathCards(items) {
  return items
    .map(
      (item, index) => `
        <article class="path-card" data-reveal>
          <div class="path-card-media">
            <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" />
          </div>
          <div class="path-card-body">
            <p class="path-card-tag">${item.tag || `Path 0${index + 1}`}</p>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
            <button type="button" class="path-card-link path-card-link-btn" data-booking-open data-sport="${item.title}">
              Zum Check
            </button>
          </div>
          <span class="path-card-index">0${index + 1}</span>
        </article>
      `
    )
    .join("");
}

function renderProgrammeCards(items) {
  return items
    .map(
      (plan) => `
        <article class="programme-card${plan.featured ? " is-featured" : ""}" data-reveal>
          <p class="programme-tag">${plan.tag}</p>
          <h3>${plan.name}</h3>
          <p class="programme-price">${plan.price}</p>
          <p class="programme-copy">${plan.text}</p>
          <ul class="programme-features">
            ${plan.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
          <button
            type="button"
            class="btn ${plan.featured ? "btn-primary" : "btn-secondary"} programme-cta"
            data-booking-open
            data-plan="${plan.id}"
          >
            Paket wählen
          </button>
        </article>
      `
    )
    .join("");
}

function renderMethod(items) {
  return items
    .map(
      (item, index) => `
        <article class="method-step" data-reveal>
          <div class="method-step-top">
            <span class="method-step-index">0${index + 1}</span>
            <h3>${item.title}</h3>
          </div>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

function renderCoaches(items) {
  return items
    .map(
      (coach) => `
        <article class="coach-card" id="${coach.id}" data-reveal>
          <div class="coach-head">
            <img src="${coach.image}" alt="${coach.name}" loading="lazy" decoding="async" />
            <div>
              <p class="coach-role">${coach.role}</p>
              <h3>${coach.name}</h3>
            </div>
          </div>
          <ul class="coach-highlights">
            ${coach.highlights.map((point) => `<li>${point}</li>`).join("")}
          </ul>
          <details class="coach-story">
            <summary>Volle Story lesen</summary>
            <div>
              ${coach.story.map((paragraph) => `<p>${paragraph}</p>`).join("")}
            </div>
          </details>
        </article>
      `
    )
    .join("");
}

function renderConversionTrust(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function renderBookingPlanOptions(items) {
  const staticOptions = items.map(
    (plan) => `
      <label class="booking-choice">
        <input type="radio" name="selected_plan" value="${plan.id}" />
        <span class="booking-choice-copy">
          <strong>${plan.name}</strong>
          <small>${plan.price}</small>
        </span>
      </label>
    `
  );

  staticOptions.push(`
    <label class="booking-choice">
      <input type="radio" name="selected_plan" value="adventure-camp-anfrage" />
      <span class="booking-choice-copy">
        <strong>Adventure Camp Anfrage</strong>
        <small>Individuelle Termin- und Umfangsplanung</small>
      </span>
    </label>
  `);

  staticOptions.push(`
    <label class="booking-choice">
      <input type="radio" name="selected_plan" value="schule-projekt-anfrage" />
      <span class="booking-choice-copy">
        <strong>Schule / Projekt Anfrage</strong>
        <small>Sportwochen und Projekttage mit Gruppenfokus</small>
      </span>
    </label>
  `);

  return staticOptions.join("");
}

function renderBookingModal(items) {
  return `
    <section class="booking-modal hidden" id="booking-modal" aria-hidden="true" aria-labelledby="booking-title" role="dialog">
      <div class="booking-backdrop" data-booking-close></div>
      <div class="booking-panel" id="booking-panel">
        <header class="booking-header">
          <div>
            <p class="booking-kicker">TP Schnellstart Check</p>
            <h3 id="booking-title">In 4 Schritten zur Empfehlung</h3>
          </div>
          <button type="button" class="booking-close" data-booking-close aria-label="Funnel schließen">Schließen</button>
        </header>

        <div class="booking-progress-track" aria-hidden="true">
          <div class="booking-progress-bar" id="booking-progress-bar"></div>
        </div>

        <form id="booking-form" class="booking-form" novalidate>
          <section class="booking-step" data-step="0">
            <h4>1. Kontext</h4>
            <div class="booking-grid-2">
              <label class="booking-field">
                <span>Sportfokus</span>
                <select name="sport_focus" required>
                  <option value="">Bitte wählen</option>
                  <option value="triathlon">Triathlon</option>
                  <option value="mtb">Mountainbike</option>
                  <option value="laufen">Laufen</option>
                  <option value="schwimmen">Schwimmen</option>
                  <option value="adventure">Adventure Camp</option>
                  <option value="schule">Schule / Projekt</option>
                </select>
              </label>

              <label class="booking-field">
                <span>Erfahrung</span>
                <select name="experience" required>
                  <option value="">Bitte wählen</option>
                  <option value="anfaenger">Anfänger:in</option>
                  <option value="fortgeschritten">Fortgeschritten</option>
                  <option value="ambitioniert">Ambitioniert</option>
                </select>
              </label>
            </div>

            <div class="booking-grid-2">
              <label class="booking-field">
                <span>Primäres Ziel</span>
                <select name="goal" required>
                  <option value="">Bitte wählen</option>
                  <option value="technik">Technik verbessern</option>
                  <option value="leistung">Leistung steigern</option>
                  <option value="wettkampf">Wettkampf vorbereiten</option>
                  <option value="spaß">Spaß & Fitness</option>
                </select>
              </label>

              <label class="booking-field">
                <span>Einheiten / Woche</span>
                <select name="weekly_sessions" required>
                  <option value="">Bitte wählen</option>
                  <option value="1-2">1-2</option>
                  <option value="3-4">3-4</option>
                  <option value="5+">5+</option>
                </select>
              </label>
            </div>
          </section>

          <section class="booking-step hidden" data-step="1" aria-hidden="true">
            <h4>2. Empfehlung</h4>
            <div class="booking-reco">
              <p class="booking-reco-kicker">Empfohlen</p>
              <p class="booking-reco-title" id="booking-reco-title">Fortgeschritten</p>
              <p class="booking-reco-text" id="booking-reco-text">Basierend auf deinen Angaben.</p>
            </div>
            <div class="booking-choice-grid">
              ${renderBookingPlanOptions(items)}
            </div>
          </section>

          <section class="booking-step hidden" data-step="2" aria-hidden="true">
            <h4>3. Kontakt</h4>
            <div class="booking-grid-2">
              <label class="booking-field">
                <span>Name</span>
                <input type="text" name="name" required placeholder="Vor- und Nachname" />
              </label>
              <label class="booking-field">
                <span>E-Mail</span>
                <input type="email" name="email" required placeholder="name@example.com" />
              </label>
            </div>

            <div class="booking-grid-2">
              <label class="booking-field">
                <span>Telefon (optional)</span>
                <input type="tel" name="phone" placeholder="+43 ..." />
              </label>
              <label class="booking-field">
                <span>Bevorzugter Kanal</span>
                <select name="preferred_channel" required>
                  <option value="">Bitte wählen</option>
                  <option value="email">E-Mail</option>
                  <option value="telefon">Telefon</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </label>
            </div>

            <label class="booking-field">
              <span>Zusatzinfo (optional)</span>
              <textarea name="message" rows="3" placeholder="Was sollen wir für das Erstgespräch wissen?"></textarea>
            </label>
          </section>

          <section class="booking-step hidden" data-step="3" aria-hidden="true">
            <h4>4. Zusammenfassung</h4>
            <div class="booking-summary" id="booking-summary"></div>
          </section>
        </form>

        <section class="booking-success hidden" id="booking-success">
          <p class="booking-reco-kicker">Anfrage bereit</p>
          <h4 id="booking-success-title">Danke - dein Check ist vorbereitet.</h4>
          <p id="booking-success-text">Wir haben deine Angaben aufbereitet. Du kannst die Anfrage jetzt direkt senden oder den Text kopieren.</p>
          <div class="booking-success-actions">
            <a class="btn btn-primary" id="booking-mailto" href="#">E-Mail öffnen</a>
            <button type="button" class="btn btn-secondary" id="booking-copy">Text kopieren</button>
          </div>
        </section>

        <p class="booking-error hidden" id="booking-error" role="status" aria-live="polite"></p>

        <footer class="booking-footer">
          <p class="booking-step-label" id="booking-step-label">Schritt 1 / 4</p>
          <div class="booking-footer-actions">
            <button type="button" class="btn btn-secondary" id="booking-prev">Zurück</button>
            <button type="button" class="btn btn-primary" id="booking-next">Weiter</button>
            <button type="button" class="btn btn-primary hidden" id="booking-submit">Anfrage vorbereiten</button>
          </div>
        </footer>
      </div>
    </section>
  `;
}

function render() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="scroll-progress" data-scroll-progress></div>

    <header class="site-header">
      <a class="brand" href="#hero" aria-label="Startseite">
        <img src="${brandLogo}" alt="TPTraining" />
        <div>
          <strong>${content.brand.name}</strong>
          <span>${content.brand.strap}</span>
        </div>
      </a>

      <nav class="desktop-nav" aria-label="Kapitel Navigation">
        <a href="#hero" data-chapter-link>Start</a>
        <a href="#path" data-chapter-link>Sportarten</a>
        <a href="#method" data-chapter-link>Methode</a>
        <a href="#programmes" data-chapter-link>Pakete</a>
        <a href="#coaches" data-chapter-link>Coaches</a>
        <a href="#conversion" data-chapter-link>Kontakt</a>
      </nav>

      <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-label="Menü öffnen">
        Menü
      </button>
    </header>

    <aside class="mobile-panel" data-mobile-panel data-open="false">
      <a href="#hero">Start</a>
      <a href="#path">Sportarten</a>
      <a href="#method">Methode</a>
      <a href="#programmes">Pakete</a>
      <a href="#coaches">Coaches</a>
      <a href="#conversion">Kontakt</a>
    </aside>

    <main>
      <section class="chapter chapter-hero" id="hero" data-hero data-chapter>
        <div class="hero-stage" data-hero-stage>
          <div class="hero-media-wrap">
            <div class="hero-media">${renderHeroFrames(content.hero.media)}</div>
            <div class="hero-vignette"></div>
            <div class="hero-fog"></div>
          </div>

          <div class="hero-grid">
            <div class="hero-content" data-hero-title>
              <p class="hero-kicker" data-reveal>${content.hero.kicker}</p>
              <h1 data-reveal>
                ${content.hero.title
                  .map(
                    (line, index) =>
                      `<span class="hero-line${index === 2 ? " accent" : ""}">${line}</span>`
                  )
                  .join("")}
              </h1>
              <p class="hero-subtitle" data-reveal>${content.hero.subtitle}</p>
              <div class="hero-cta" data-reveal>
                <a class="btn btn-primary" href="${content.hero.primaryCta.href}">${content.hero.primaryCta.label}</a>
                <a class="btn btn-secondary" href="${content.hero.secondaryCta.href}" data-booking-open>${content.hero.secondaryCta.label}</a>
              </div>
              <div class="hero-chip-row" data-reveal>
                ${content.hero.chips
                  .map((chip) => `<span class="hero-chip" data-hero-chip>${chip}</span>`)
                  .join("")}
              </div>
            </div>

            <aside class="hero-rail" data-reveal>
              <div class="hero-rail-panel">
                <p class="hero-rail-kicker">TP Blueprint</p>
                <div class="hero-stat-grid">
                  ${renderHeroStats(content.hero.stats)}
                </div>
              </div>

              <div class="hero-rail-panel hero-rail-panel-soft">
                <p class="hero-rail-kicker">Flow</p>
                <p class="hero-rail-copy">Von der ersten Session über Technik-Blocks bis zur stabilen Performance im Alltag und bei Events.</p>
                <a class="hero-rail-link" href="#method">Methodik ansehen</a>
              </div>
            </aside>
          </div>

          <a class="hero-scroll-cue" href="#path" aria-label="Zu Sportarten scrollen">Scroll</a>
        </div>
      </section>

      <section class="chapter chapter-path" id="path" data-chapter>
        <div class="shell shell-path">
          <div class="section-head" data-reveal>
            <p>Choose your path</p>
            <h2>Drei Wege, ein Ziel: kontrollierter Fortschritt.</h2>
          </div>
          <p class="section-lead" data-reveal>
            Jeder Pfad kombiniert Struktur, Technik und Motivation. Du steigst dort ein, wo du gerade stehst, und baust mit klaren nächsten Schritten auf.
          </p>
          <div class="path-grid">
            ${renderPathCards(content.path)}
          </div>
        </div>
      </section>

      <section class="chapter chapter-method" id="method" data-chapter>
        <div class="shell shell-method">
          <div class="section-head" data-reveal>
            <p>Coaching System</p>
            <h2>Ein System, das Entscheidungen einfacher macht.</h2>
          </div>
          <div class="method-grid">
            ${renderMethod(content.method)}
          </div>
        </div>
      </section>

      <section class="chapter chapter-programmes" id="programmes" data-chapter>
        <div class="shell shell-programmes">
          <div class="section-head" data-reveal>
            <p>Pakete</p>
            <h2>Wähle die Intensität, die zu deinem Ziel passt.</h2>
          </div>
          <p class="section-lead" data-reveal>
            Die Empfehlung im Schnellstart-Check hilft dir bei der Auswahl. Du kannst jedes Paket direkt wählen und später feinjustieren.
          </p>
          <div class="programme-grid">
            ${renderProgrammeCards(content.programmes)}
          </div>
        </div>
      </section>

      <section class="chapter chapter-coaches" id="coaches" data-chapter>
        <div class="shell shell-coaches">
          <div class="section-head" data-reveal>
            <p>Vertrauen & Erfahrung</p>
            <h2>Persönlich geführt, sportlich verankert.</h2>
          </div>
          <p class="section-lead" data-reveal>
            Die langen Original-Stories bleiben vollständig erhalten und sind bewusst als vertiefende Ebene lesbar, damit die Hauptseite klar und schnell bleibt.
          </p>
          <div class="coach-grid">
            ${renderCoaches(content.coaches)}
          </div>
        </div>
      </section>

      <section class="chapter chapter-conversion" id="conversion" data-chapter>
        <div class="conversion-panel" data-reveal>
          <div class="conversion-copy">
            <p class="conversion-kicker">Next Move</p>
            <h2>${content.conversion.title}</h2>
            <p>${content.conversion.text}</p>
            <div class="conversion-actions">
              <button type="button" class="btn btn-primary" data-booking-open>${content.conversion.ctas[0].label}</button>
              <a class="btn btn-secondary" href="${content.conversion.ctas[1].href}">${content.conversion.ctas[1].label}</a>
            </div>
          </div>
          <ul class="conversion-trust">
            ${renderConversionTrust(content.conversion.trust)}
          </ul>
        </div>
      </section>
    </main>

    ${renderBookingModal(content.programmes)}

    <footer class="site-footer">
      <p>${new Date().getFullYear()} ${content.brand.name}</p>
      <a href="/Impressum.html">Impressum</a>
      <a href="/legacy/index-legacy.html">Legacy Site</a>
    </footer>
  `;
}

render();
initMobileMenu();
initHeroMotion();
const progressNavController = initProgressAndNav();
initPhaseThreeMotion(progressNavController);
initBooking({
  businessEmail: "tp.training@gmx.net",
  programmes: content.programmes
});
