function esc(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }
  return String(value).replace(/"/g, "\\\"");
}

function copyToClipboard(text) {
  if (!navigator.clipboard) {
    window.prompt("Bitte kopieren:", text);
    return Promise.resolve(false);
  }

  return navigator.clipboard.writeText(text).then(() => true).catch(() => {
    window.prompt("Bitte kopieren:", text);
    return false;
  });
}

function optionText(selectEl) {
  if (!selectEl) return "";
  const option = selectEl.options[selectEl.selectedIndex];
  return option ? option.textContent.trim() : "";
}

export function initBooking({ businessEmail = "tp.training@gmx.net", programmes = [] } = {}) {
  const modal = document.getElementById("booking-modal");
  const panel = document.getElementById("booking-panel");
  const form = document.getElementById("booking-form");
  const steps = form ? Array.from(form.querySelectorAll(".booking-step")) : [];

  if (!modal || !panel || !form || steps.length === 0) return;

  const progressBar = document.getElementById("booking-progress-bar");
  const stepLabel = document.getElementById("booking-step-label");
  const nextBtn = document.getElementById("booking-next");
  const prevBtn = document.getElementById("booking-prev");
  const submitBtn = document.getElementById("booking-submit");
  const summary = document.getElementById("booking-summary");

  const success = document.getElementById("booking-success");
  const bookingMailto = document.getElementById("booking-mailto");
  const bookingCopy = document.getElementById("booking-copy");
  const recoTitle = document.getElementById("booking-reco-title");
  const recoText = document.getElementById("booking-reco-text");

  const openTriggers = Array.from(document.querySelectorAll("[data-booking-open]"));
  const closeTriggers = Array.from(document.querySelectorAll("[data-booking-close]"));

  let currentStep = 0;
  let userPlanTouched = false;
  let lastCompiledMessage = "";
  let lastFocus = null;

  const planMap = new Map();
  programmes.forEach((plan) => {
    planMap.set(plan.id, plan);
  });
  planMap.set("adventure-camp-anfrage", {
    name: "Adventure Camp Anfrage",
    price: "auf Anfrage"
  });
  planMap.set("schule-projekt-anfrage", {
    name: "Schule / Projekt Anfrage",
    price: "auf Anfrage"
  });

  function lockBody(lock) {
    document.body.classList.toggle("overflow-hidden", lock);
  }

  function setStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach((stepEl, idx) => {
      const active = idx === currentStep;
      stepEl.classList.toggle("hidden", !active);
      stepEl.setAttribute("aria-hidden", active ? "false" : "true");
    });

    const pct = Math.round(((currentStep + 1) / steps.length) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (stepLabel) stepLabel.textContent = `Schritt ${currentStep + 1} / ${steps.length}`;

    if (prevBtn) prevBtn.classList.toggle("hidden", currentStep === 0);
    if (nextBtn && submitBtn) {
      const lastStep = currentStep === steps.length - 1;
      nextBtn.classList.toggle("hidden", lastStep);
      submitBtn.classList.toggle("hidden", !lastStep);
    }

    if (currentStep >= 1) {
      updateRecommendation();
    }
    if (currentStep === steps.length - 1) {
      renderSummary();
    }
  }

  function getValue(name) {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return "";

    if (input instanceof HTMLSelectElement) {
      return input.value;
    }

    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      return input.value.trim();
    }

    return "";
  }

  function getSelectedRadioValue(name) {
    const radio = form.querySelector(`input[name="${name}"]:checked`);
    return radio ? radio.value : "";
  }

  function computeRecommendation() {
    const sport = getValue("sport_focus");

    if (sport === "adventure") {
      return {
        planId: "adventure-camp-anfrage",
        title: "Adventure Camp Anfrage",
        text: "Camps werden individuell nach Termin, Ort und Level geplant."
      };
    }

    if (sport === "schule") {
      return {
        planId: "schule-projekt-anfrage",
        title: "Schule / Projekt Anfrage",
        text: "Gruppenprogramme werden individuell mit Schule/Projekt abgestimmt."
      };
    }

    let score = 0;

    const experience = getValue("experience");
    if (experience === "anfaenger") score += 1;
    if (experience === "fortgeschritten") score += 2;
    if (experience === "ambitioniert") score += 3;

    const sessions = getValue("weekly_sessions");
    if (sessions === "1-2") score += 1;
    if (sessions === "3-4") score += 2;
    if (sessions === "5+") score += 3;

    const goal = getValue("goal");
    if (goal === "leistung") score += 1;
    if (goal === "wettkampf") score += 2;

    let planId = "einsteiger";
    if (score >= 6) planId = "pro-athlete";
    else if (score >= 3) planId = "fortgeschritten";

    const selected = planMap.get(planId);
    return {
      planId,
      title: selected?.name || "Fortgeschritten",
      text:
        planId === "einsteiger"
          ? "Starker Einstieg mit Fokus auf Technik und klare Trainingsstruktur."
          : planId === "fortgeschritten"
            ? "Empfohlen für regelmäßiges Training mit ambitioniertem Fortschritt."
            : "High-Performance Betreuung für hohe Umfänge und feinere Steuerung."
    };
  }

  function updateRecommendation() {
    const recommendation = computeRecommendation();
    if (recoTitle) recoTitle.textContent = recommendation.title;
    if (recoText) recoText.textContent = recommendation.text;

    if (!userPlanTouched) {
      const target = form.querySelector(
        `input[name="selected_plan"][value="${esc(recommendation.planId)}"]`
      );
      if (target) target.checked = true;
    }
  }

  function validateStep() {
    const current = steps[currentStep];
    if (!current) return true;

    const controls = Array.from(
      current.querySelectorAll("input, select, textarea")
    ).filter((el) => !el.disabled && el.offsetParent !== null);

    for (const control of controls) {
      if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) {
        if (!control.checkValidity()) {
          control.reportValidity();
          control.focus();
          return false;
        }
      }
    }

    if (currentStep === 1 && !getSelectedRadioValue("selected_plan")) {
      const firstOption = current.querySelector('input[name="selected_plan"]');
      if (firstOption) firstOption.focus();
      return false;
    }

    return true;
  }

  function buildSummaryRows() {
    const sportSelect = form.querySelector('[name="sport_focus"]');
    const expSelect = form.querySelector('[name="experience"]');
    const goalSelect = form.querySelector('[name="goal"]');
    const weeklySelect = form.querySelector('[name="weekly_sessions"]');
    const channelSelect = form.querySelector('[name="preferred_channel"]');

    const selectedPlan = getSelectedRadioValue("selected_plan");
    const selectedPlanMeta = planMap.get(selectedPlan);

    return [
      ["Sport", optionText(sportSelect)],
      ["Erfahrung", optionText(expSelect)],
      ["Ziel", optionText(goalSelect)],
      ["Einheiten/Woche", optionText(weeklySelect)],
      ["Plan", selectedPlanMeta ? `${selectedPlanMeta.name} (${selectedPlanMeta.price || ""})` : "-"],
      ["Name", getValue("name")],
      ["E-Mail", getValue("email")],
      ["Telefon", getValue("phone") || "-"],
      ["Kanal", optionText(channelSelect)],
      ["Nachricht", getValue("message") || "-"]
    ];
  }

  function renderSummary() {
    if (!summary) return;

    const rows = buildSummaryRows();
    summary.innerHTML = rows
      .map(
        ([label, value]) => `
          <div class="booking-summary-row">
            <span>${label}</span>
            <strong>${value}</strong>
          </div>
        `
      )
      .join("");
  }

  function compileMessage() {
    const rows = buildSummaryRows();
    const lines = [
      "TPTraining - Schnellstart Check",
      "--------------------------------"
    ];

    rows.forEach(([label, value]) => {
      lines.push(`${label}: ${value}`);
    });

    return lines.join("\n");
  }

  function showSuccess() {
    if (!success) return;

    form.classList.add("hidden");
    success.classList.remove("hidden");
    if (stepLabel) stepLabel.textContent = "Anfrage bereit";
    if (nextBtn) nextBtn.classList.add("hidden");
    if (prevBtn) prevBtn.classList.add("hidden");
    if (submitBtn) submitBtn.classList.add("hidden");
  }

  function prepareSubmission() {
    lastCompiledMessage = compileMessage();

    const selectedPlan = getSelectedRadioValue("selected_plan");
    const selectedPlanMeta = planMap.get(selectedPlan);
    const subject = `TPTraining Anfrage - ${selectedPlanMeta?.name || "Schnellstart"}`;
    const mailto = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lastCompiledMessage)}`;

    if (bookingMailto) bookingMailto.href = mailto;

    showSuccess();
  }

  function resetToStart() {
    form.reset();
    userPlanTouched = false;
    setStep(0);
    form.classList.remove("hidden");
    success?.classList.add("hidden");
  }

  function openBooking({ plan = "", sport = "" } = {}) {
    lastFocus = document.activeElement;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    lockBody(true);
    resetToStart();

    if (sport) {
      const sportInput = form.querySelector('[name="sport_focus"]');
      if (sportInput) {
        const normalized = sport.toLowerCase();
        if (normalized.includes("triathlon")) sportInput.value = "triathlon";
        else if (normalized.includes("mtb") || normalized.includes("mountainbike")) sportInput.value = "mtb";
        else if (normalized.includes("schule")) sportInput.value = "schule";
      }
    }

    if (plan) {
      const radio = form.querySelector(`input[name="selected_plan"][value="${esc(plan)}"]`);
      if (radio) {
        radio.checked = true;
        userPlanTouched = true;
      }
    }

    updateRecommendation();

    window.setTimeout(() => {
      const firstFocusable = panel.querySelector("button, input, select, textarea, a[href]");
      if (firstFocusable instanceof HTMLElement) firstFocusable.focus();
    }, 40);
  }

  function closeBooking() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    lockBody(false);
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  openTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openBooking({
        plan: trigger.getAttribute("data-plan") || "",
        sport: trigger.getAttribute("data-sport") || ""
      });
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeBooking);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeBooking();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeBooking();
    }
  });

  form.addEventListener("change", (event) => {
    if (event.target && event.target.name === "selected_plan") {
      userPlanTouched = true;
    }

    if (
      event.target &&
      ["sport_focus", "experience", "goal", "weekly_sessions"].includes(event.target.name)
    ) {
      updateRecommendation();
    }

    if (currentStep === steps.length - 1) {
      renderSummary();
    }
  });

  form.addEventListener("input", () => {
    if (currentStep === steps.length - 1) {
      renderSummary();
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (!validateStep()) return;
    setStep(currentStep + 1);
  });

  prevBtn?.addEventListener("click", () => {
    setStep(currentStep - 1);
  });

  submitBtn?.addEventListener("click", () => {
    if (!validateStep()) return;
    prepareSubmission();
  });

  bookingCopy?.addEventListener("click", async () => {
    if (!lastCompiledMessage) return;
    await copyToClipboard(lastCompiledMessage);
  });

  setStep(0);
}
