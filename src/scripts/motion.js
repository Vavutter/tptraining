import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const revealObserverOptions = {
  threshold: 0.18,
  rootMargin: "0px 0px -10% 0px"
};

let heroInterval = null;
let lenis = null;
let lenisTicker = null;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function desktopMotionEnabled() {
  return window.matchMedia("(min-width: 1060px)").matches;
}

function pinnedMotionEnabled() {
  return window.matchMedia("(min-width: 1240px)").matches;
}

function setHeroChipDelays() {
  const title = document.querySelector("[data-hero-title]");
  if (!title) return;

  const chips = title.querySelectorAll("[data-hero-chip]");
  chips.forEach((chip, index) => {
    chip.style.setProperty("--delay", `${index * 0.08}s`);
  });
}

function startHeroSlideshow() {
  const frames = Array.from(document.querySelectorAll("[data-hero-frame]"));
  if (frames.length <= 1) return;

  if (heroInterval) {
    window.clearInterval(heroInterval);
    heroInterval = null;
  }

  let active = 0;
  frames.forEach((frame) => frame.classList.remove("is-active"));
  frames[0].classList.add("is-active");

  heroInterval = window.setInterval(() => {
    frames[active].classList.remove("is-active");
    active = (active + 1) % frames.length;
    frames[active].classList.add("is-active");
  }, 4200);
}

function revealAll() {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.add("is-visible");
  });
}

function initLenis(updateProgressAndNav) {
  if (!desktopMotionEnabled() || prefersReducedMotion()) return;

  if (lenis) {
    if (lenisTicker) gsap.ticker.remove(lenisTicker);
    lenis.destroy();
    lenis = null;
    lenisTicker = null;
  }

  lenis = new Lenis({
    duration: 1.02,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 0.95,
    touchMultiplier: 1,
    easing: (t) => 1 - Math.pow(1 - t, 4)
  });

  lenis.on("scroll", ({ animatedScroll }) => {
    ScrollTrigger.update();
    if (typeof updateProgressAndNav === "function") {
      updateProgressAndNav(animatedScroll);
    }
  });

  lenisTicker = (time) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(lenisTicker);
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, {
        offset: -86,
        duration: 1.05
      });
    });
  });
}

function initHeroScrub() {
  const hero = document.querySelector("[data-hero]");
  const stage = document.querySelector("[data-hero-stage]");
  const media = document.querySelector(".hero-media");
  const content = document.querySelector("[data-hero-title]");
  const rail = document.querySelector(".hero-rail");
  const cue = document.querySelector(".hero-scroll-cue");

  if (!hero || !stage || !media || !content) return;

  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 1.2
    }
  })
    .to(media, { yPercent: 8, scale: 1.04, ease: "none" }, 0)
    .to(content, { yPercent: -10, autoAlpha: 0.74, ease: "none" }, 0)
    .to(rail, { yPercent: -12, autoAlpha: 0.5, ease: "none" }, 0)
    .to(cue, { autoAlpha: 0, ease: "none" }, 0.16)
    .to(stage, { filter: "saturate(0.94) contrast(1.01) brightness(1.04)", ease: "none" }, 0);
}

function initRevealAnimations() {
  const genericRevealSelector =
    "[data-reveal]:not(.path-card):not(.method-step):not(.programme-card):not(.coach-card):not(.conversion-panel)";

  gsap.utils.toArray(genericRevealSelector).forEach((el, index) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.82,
        delay: Math.min(index * 0.02, 0.2),
        ease: "power3.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          once: true
        }
      }
    );
  });
}

function initPathAnimations() {
  const cards = gsap.utils.toArray(".path-card");
  if (cards.length === 0) return;

  cards.forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        autoAlpha: 0,
        y: 56,
        rotateX: 4
      },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.95,
        ease: "power3.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: card,
          start: "top 86%",
          once: true
        }
      }
    );

    gsap.to(card, {
      yPercent: index === 1 ? -4 : -2.5,
      rotateZ: index === 1 ? -0.45 : 0.35,
      ease: "none",
      scrollTrigger: {
        trigger: "#path",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.4
      }
    });
  });
}

function initMethodAnimations() {
  const methodShell = document.querySelector("#method .shell-method");
  const steps = gsap.utils.toArray("#method .method-step");
  if (!methodShell || steps.length === 0) return;

  if (pinnedMotionEnabled()) {
    gsap.set(steps, { autoAlpha: 0.34, y: 32, scale: 0.97 });
    gsap.set(steps[0], { autoAlpha: 1, y: 0, scale: 1 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: methodShell,
        start: "top 19%",
        end: () => `+=${Math.max(window.innerHeight * 1.12, 700)}`,
        scrub: 1.15,
        pin: true,
        anticipatePin: 1
      }
    });

    steps.forEach((step, index) => {
      const stepPosition = index * 0.48;

      timeline.to(
        step,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power2.out"
        },
        stepPosition
      );

      if (index > 0) {
        timeline.to(
          steps[index - 1],
          {
            autoAlpha: 0.5,
            y: -8,
            scale: 0.985,
            duration: 0.45,
            ease: "power2.out"
          },
          stepPosition
        );
      }
    });

    return;
  }

  steps.forEach((step) => {
    gsap.fromTo(
      step,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: step,
          start: "top 86%",
          once: true
        }
      }
    );
  });
}

function initProgrammeAnimations() {
  const cards = gsap.utils.toArray(".programme-card");
  if (cards.length === 0) return;

  cards.forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        autoAlpha: 0,
        y: 36,
        rotateX: 3
      },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: card,
          start: "top 86%",
          once: true
        }
      }
    );

    if (desktopMotionEnabled()) {
      gsap.to(card, {
        yPercent: index === 1 ? -4 : -2.4,
        ease: "none",
        scrollTrigger: {
          trigger: "#programmes",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.35
        }
      });
    }
  });
}

function initCoachAnimations() {
  const cards = gsap.utils.toArray(".coach-card");
  if (cards.length === 0) return;

  cards.forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        autoAlpha: 0,
        y: 50,
        x: index % 2 === 0 ? -34 : 34
      },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration: 0.95,
        ease: "power3.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: card,
          start: "top 84%",
          once: true
        }
      }
    );

    gsap.to(card, {
      yPercent: index % 2 === 0 ? -3 : 3,
      ease: "none",
      scrollTrigger: {
        trigger: "#coaches",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.4
      }
    });
  });
}

function initConversionAnimations() {
  const panel = document.querySelector(".conversion-panel");
  const trustItems = gsap.utils.toArray(".conversion-trust li");

  if (!panel) return;

  gsap.fromTo(
    panel,
    { autoAlpha: 0, y: 36, scale: 0.98 },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.95,
      ease: "power3.out",
      overwrite: "auto",
      scrollTrigger: {
        trigger: panel,
        start: "top 84%",
        once: true
      }
    }
  );

  if (trustItems.length > 0) {
    gsap.fromTo(
      trustItems,
      { autoAlpha: 0, x: 24 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: panel,
          start: "top 82%",
          once: true
        }
      }
    );
  }
}

export function initHeroMotion() {
  const hero = document.querySelector("[data-hero]");
  const stage = document.querySelector("[data-hero-stage]");

  if (!hero || !stage) return;

  setHeroChipDelays();
  startHeroSlideshow();

  // Keep CSS variable in sync for non-GSAP fallback and subtle UI interpolation.
  let ticking = false;

  const apply = () => {
    const rect = hero.getBoundingClientRect();
    const max = Math.max(window.innerHeight, 1);
    const raw = (max - rect.top) / (rect.height + max);
    const clamped = Math.min(1, Math.max(0, raw));
    hero.style.setProperty("--hero-progress", clamped.toFixed(4));
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(apply);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  apply();
}

export function initSectionReveal() {
  if (prefersReducedMotion()) {
    revealAll();
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, revealObserverOptions);

  document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
}

export function initProgressAndNav() {
  const progress = document.querySelector("[data-scroll-progress]");
  const links = Array.from(document.querySelectorAll("[data-chapter-link]"));
  const sections = Array.from(document.querySelectorAll("[data-chapter]"));

  if (!progress && links.length === 0) {
    return { update: () => {} };
  }

  const update = (scrollY = window.scrollY) => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, scrollY / max));

    if (progress) {
      progress.style.transform = `scaleX(${ratio})`;
    }

    const offset = 140;
    const active = sections.find((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      return scrollY + offset >= top && scrollY + offset < bottom;
    });

    links.forEach((link) => {
      if (!active) {
        link.removeAttribute("aria-current");
        return;
      }

      if (link.getAttribute("href") === `#${active.id}`) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const onScroll = () => {
    window.requestAnimationFrame(() => update(window.scrollY));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => update(window.scrollY));
  update(window.scrollY);

  return { update };
}

export function initPhaseThreeMotion(progressNavController) {
  if (prefersReducedMotion()) {
    revealAll();
    return;
  }

  initLenis(progressNavController?.update);

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  initRevealAnimations();
  initHeroScrub();
  initPathAnimations();
  initMethodAnimations();
  initProgrammeAnimations();
  initCoachAnimations();
  initConversionAnimations();

  ScrollTrigger.refresh();
}

export function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");

  if (!toggle || !panel) return;

  const close = () => {
    panel.setAttribute("data-open", "false");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = panel.getAttribute("data-open") === "true";
    panel.setAttribute("data-open", String(!open));
    toggle.setAttribute("aria-expanded", String(!open));
  });

  panel.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}
