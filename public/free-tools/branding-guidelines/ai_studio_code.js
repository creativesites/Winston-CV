// Add your own Google Gemini API key here to enable AI features.
// Get a free key at: https://aistudio.google.com/app/apikey
// Leave empty to use the built-in local suggestions instead.
const API_KEY = "";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;
const STORAGE_KEY = "websiteBuilderDraft:v2";
const TOTAL_STEPS = 8;

const PALETTE_META = [
  { role: "primary", label: "Primary", hex: "#3B82F6", name: "Brand Blue", usage: "Primary buttons, key calls-to-action, and conversion moments." },
  { role: "secondary", label: "Secondary", hex: "#1E3A8A", name: "Deep Navy", usage: "Section headings, anchoring elements, and premium highlights." },
  { role: "accent", label: "Accent", hex: "#F59E0B", name: "Warm Amber", usage: "Secondary accents, badges, and attention-drawing details." },
  { role: "bg", label: "Background", hex: "#F8FAFC", name: "Soft White", usage: "Light section backgrounds and spacious canvas areas." },
  { role: "text", label: "Text", hex: "#0F172A", name: "Rich Black", usage: "Primary text, headings, and dark section grounding." }
];

const WEBSITE_TYPE_LABELS = {
  "service-business": "Service Business",
  agency: "Agency",
  ecommerce: "E-commerce Store",
  saas: "SaaS / Tech Product",
  portfolio: "Portfolio / Creative",
  "hospitality-travel": "Hospitality / Travel",
  "personal-brand": "Personal Brand",
  nonprofit: "Nonprofit / Cause"
};

const PAGE_LABELS = {
  home: "Home",
  about: "About Us",
  services: "Services / Products",
  portfolio: "Portfolio / Gallery",
  blog: "Blog / News",
  contact: "Contact",
  faq: "FAQ",
  testimonials: "Testimonials",
  team: "Team / Staff",
  pricing: "Pricing"
};

const FEATURE_LABELS = {
  "contact-form": "Contact Form",
  newsletter: "Newsletter Signup",
  search: "Site Search",
  "social-media": "Social Media Integration",
  blog: "Blog System",
  ecommerce: "E-commerce",
  booking: "Booking / Appointments",
  "user-accounts": "User Accounts",
  "live-chat": "Live Chat",
  gallery: "Image / Video Gallery",
  testimonials: "Testimonials / Reviews",
  "multi-language": "Multi-language",
  analytics: "Analytics / Tracking",
  seo: "SEO Optimization"
};

const TONE_LABELS = {
  formal: "Formal",
  friendly: "Friendly",
  authoritative: "Authoritative",
  casual: "Casual",
  inspiring: "Inspiring"
};

const ALLOWED_FONTS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Inter",
  "Montserrat",
  "Poppins",
  "Merriweather",
  "Lora",
  "Oswald",
  "Open Sans",
  "Source Sans 3",
  "DM Sans"
];

const suggestionHandlers = new Map();
const colorNameDebouncers = new Map();
let suggestionActionCounter = 0;
let toastTimer = null;

let state = normalizeState(loadDraft());

document.addEventListener("DOMContentLoaded", init);

function init() {
  renderDynamicListsFromState();
  hydrateFormFromState();
  attachEventListeners();
  goToStep(state.currentStep || 1, { save: false });
  renderAll({ save: false });

  if (state.updatedAt) {
    showDraftBanner("Draft restored from local storage.");
  }

  setInterval(updateSaveStatusText, 30000);
}

function buildDefaultState() {
  return {
    currentStep: 1,
    updatedAt: null,
    data: {
      basics: {
        websiteType: "service-business",
        industry: "",
        targetAudience: "",
        primaryGoal: ""
      },
      identity: {
        businessName: "",
        tagline: "",
        mission: "",
        values: ["Quality", "Transparency", "Innovation", "Trust"],
        uniqueness: ""
      },
      colors: {
        moods: ["professional"],
        paletteInstructions: "",
        preferredColors: "",
        palette: PALETTE_META.map((item) => ({
          role: item.role,
          label: item.label,
          hex: item.hex,
          name: item.name,
          usage: item.usage,
          suggestedName: ""
        }))
      },
      typography: {
        headingFont: "Inter",
        bodyFont: "Inter"
      },
      style: {
        selectedStyle: "modern",
        layout: "wide",
        visualElements: ["animations", "shadows"]
      },
      content: {
        tone: "friendly",
        messages: [],
        ctaText: "Get Started"
      },
      siteStructure: {
        pages: ["home", "about", "services", "contact"],
        customPages: [],
        features: ["contact-form", "analytics", "seo"],
        integrations: []
      },
      references: {
        referenceSites: [],
        competitors: [],
        designDonts: ""
      },
      review: {
        aiSummary: "",
        generatedAt: ""
      }
    }
  };
}

function normalizeState(raw) {
  const defaults = buildDefaultState();
  const rawData = raw && raw.data ? raw.data : {};
  const rawIdentity = rawData.identity || {};
  const rawColors = rawData.colors || {};
  const rawStyle = rawData.style || {};
  const rawContent = rawData.content || {};
  const rawStructure = rawData.siteStructure || {};
  const rawReferences = rawData.references || {};
  const rawReview = rawData.review || {};

  if (!raw || typeof raw !== "object") {
    return defaults;
  }

  const normalized = {
    currentStep: clamp(Number(raw.currentStep) || 1, 1, TOTAL_STEPS),
    updatedAt: raw.updatedAt || null,
    data: {
      basics: { ...defaults.data.basics, ...(rawData.basics || {}) },
      identity: {
        ...defaults.data.identity,
        ...rawIdentity,
        values: normalizeStringArray(rawIdentity.values, defaults.data.identity.values)
      },
      colors: {
        moods: normalizeStringArray(rawColors.moods, defaults.data.colors.moods),
        paletteInstructions: rawColors.paletteInstructions || defaults.data.colors.paletteInstructions,
        preferredColors: rawColors.preferredColors || defaults.data.colors.preferredColors,
        palette: normalizePalette(rawColors.palette)
      },
      typography: { ...defaults.data.typography, ...(rawData.typography || {}) },
      style: {
        ...defaults.data.style,
        ...rawStyle,
        visualElements: normalizeStringArray(rawStyle.visualElements, defaults.data.style.visualElements)
      },
      content: {
        ...defaults.data.content,
        ...rawContent,
        messages: normalizeStringArray(rawContent.messages, defaults.data.content.messages)
      },
      siteStructure: {
        pages: normalizePages(rawStructure.pages, defaults.data.siteStructure.pages),
        customPages: normalizeObjectArray(rawStructure.customPages, ["name", "description"]),
        features: normalizeStringArray(rawStructure.features, defaults.data.siteStructure.features),
        integrations: normalizeStringArray(rawStructure.integrations, defaults.data.siteStructure.integrations)
      },
      references: {
        referenceSites: normalizeObjectArray(rawReferences.referenceSites, ["url", "notes"]),
        competitors: normalizeObjectArray(rawReferences.competitors, ["url", "notes"]),
        designDonts: rawReferences.designDonts || ""
      },
      review: {
        aiSummary: rawReview.aiSummary || "",
        generatedAt: rawReview.generatedAt || ""
      }
    }
  };

  return normalized;
}

function normalizePalette(palette) {
  return PALETTE_META.map((meta, index) => {
    const current = palette && palette[index] ? palette[index] : {};
    return {
      role: meta.role,
      label: meta.label,
      hex: current.hex || meta.hex,
      name: current.name || meta.name,
      usage: current.usage || meta.usage,
      suggestedName: current.suggestedName || ""
    };
  });
}

function normalizePages(pages, fallback) {
  const normalized = normalizeStringArray(pages, fallback).filter(Boolean);
  if (!normalized.includes("home")) {
    normalized.unshift("home");
  }
  return Array.from(new Set(normalized));
}

function normalizeStringArray(values, fallback) {
  if (!Array.isArray(values)) {
    return [...fallback];
  }

  const filtered = values.map((item) => String(item || "").trim()).filter(Boolean);
  return filtered.length ? filtered : [...fallback];
}

function normalizeObjectArray(values, keys) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => {
      const next = {};
      keys.forEach((key) => {
        next[key] = String((item && item[key]) || "").trim();
      });
      return next;
    })
    .filter((item) => keys.some((key) => item[key]));
}

function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse local draft:", error);
    return null;
  }
}

function attachEventListeners() {
  document.querySelectorAll(".step-tab").forEach((button) => {
    button.addEventListener("click", () => {
      goToStep(Number(button.dataset.stepTarget));
    });
  });

  byId("prevStepBtn").addEventListener("click", () => changeStep(-1));
  byId("nextStepBtn").addEventListener("click", () => changeStep(1));
  byId("exportBtn").addEventListener("click", exportToWord);
  byId("resetDraftBtn").addEventListener("click", clearSavedDraft);
  byId("startOverBtn").addEventListener("click", resetBuilder);
  byId("mobilePreviewToggle").addEventListener("click", togglePreviewOverlay);
  byId("closePreviewBtn").addEventListener("click", closePreviewOverlay);

  document.querySelector(".builder-content").addEventListener("input", handleBuilderInput);
  document.querySelector(".builder-content").addEventListener("change", handleBuilderInput);
  document.querySelector(".builder-content").addEventListener("click", handleBuilderClick);
}

function handleBuilderInput(event) {
  const target = event.target;

  if (target.matches(".color-input")) {
    const index = Number(target.id.replace("color", "").replace("Hex", ""));
    byId(`color${index}HexText`).textContent = target.value.toUpperCase();
    state.data.colors.palette[index].suggestedName = "";
    renderColorSuggestion(index);
    syncStateFromForm();
    scheduleColorNaming(index, target.value);
    return;
  }

  syncStateFromForm();
}

function handleBuilderClick(event) {
  const moodChip = event.target.closest("[data-mood]");
  const styleCard = event.target.closest(".style-card");
  const aiButton = event.target.closest("[data-ai-action]");
  const suggestionButton = event.target.closest("[data-suggestion-action]");

  if (moodChip) {
    moodChip.classList.toggle("active");
    syncStateFromForm();
    return;
  }

  if (styleCard) {
    document.querySelectorAll(".style-card").forEach((card) => card.classList.remove("active"));
    styleCard.classList.add("active");
    syncStateFromForm();
    return;
  }

  if (suggestionButton) {
    const handler = suggestionHandlers.get(suggestionButton.dataset.suggestionAction);
    if (handler) {
      handler();
    }
    return;
  }

  if (aiButton) {
    runAiAction(aiButton.dataset.aiAction);
    return;
  }

  if (event.target.closest("#addValueBtn")) {
    state.data.identity.values.push("");
    renderValues();
    syncStateFromForm();
    focusLastInput("#valuesContainer input");
    return;
  }

  if (event.target.closest("#addMessageBtn")) {
    state.data.content.messages.push("");
    renderMessages();
    syncStateFromForm();
    focusLastInput("#messagesContainer input");
    return;
  }

  if (event.target.closest("#addCustomPageBtn")) {
    state.data.siteStructure.customPages.push({ name: "", description: "" });
    renderCustomPages();
    syncStateFromForm();
    focusLastInput("#customPagesContainer .repeater-item:last-child input");
    return;
  }

  if (event.target.closest("#addIntegrationBtn")) {
    state.data.siteStructure.integrations.push("");
    renderIntegrations();
    syncStateFromForm();
    focusLastInput("#integrationsContainer input");
    return;
  }

  if (event.target.closest("#addReferenceBtn")) {
    state.data.references.referenceSites.push({ url: "", notes: "" });
    renderReferences();
    syncStateFromForm();
    focusLastInput("#referencesContainer .repeater-item:last-child input");
    return;
  }

  if (event.target.closest("#addCompetitorBtn")) {
    state.data.references.competitors.push({ url: "", notes: "" });
    renderCompetitors();
    syncStateFromForm();
    focusLastInput("#competitorsContainer .repeater-item:last-child input");
    return;
  }

  const removeButton = event.target.closest(".remove-btn");
  if (removeButton) {
    const row = removeButton.closest(".repeater-item");
    if (row) {
      row.remove();
    }
    syncStateFromForm();
  }
}

function focusLastInput(selector) {
  const field = document.querySelector(selector);
  if (field) {
    field.focus();
  }
}

function renderDynamicListsFromState() {
  renderValues();
  renderMessages();
  renderCustomPages();
  renderIntegrations();
  renderReferences();
  renderCompetitors();
}

function renderValues() {
  const values = state.data.identity.values.length ? state.data.identity.values : [""];
  byId("valuesContainer").innerHTML = values
    .map(
      (value) => `
        <div class="repeater-item">
          <input type="text" data-repeater="values" placeholder="e.g. Trust" value="${escapeAttribute(value)}">
          <button type="button" class="remove-btn" aria-label="Remove value">×</button>
        </div>
      `
    )
    .join("");
}

function renderMessages() {
  const messages = state.data.content.messages.length ? state.data.content.messages : [""];
  byId("messagesContainer").innerHTML = messages
    .map(
      (value) => `
        <div class="repeater-item">
          <input type="text" data-repeater="messages" placeholder="e.g. Reliable service with premium support" value="${escapeAttribute(value)}">
          <button type="button" class="remove-btn" aria-label="Remove message">×</button>
        </div>
      `
    )
    .join("");
}

function renderCustomPages() {
  const pages = state.data.siteStructure.customPages.length ? state.data.siteStructure.customPages : [{ name: "", description: "" }];
  byId("customPagesContainer").innerHTML = pages
    .map(
      (item) => `
        <div class="repeater-item repeater-item--double">
          <input type="text" data-repeater="customPages" data-field="name" placeholder="Page name" value="${escapeAttribute(item.name)}">
          <input type="text" data-repeater="customPages" data-field="description" placeholder="What is this page for?" value="${escapeAttribute(item.description)}">
          <button type="button" class="remove-btn" aria-label="Remove custom page">×</button>
        </div>
      `
    )
    .join("");
}

function renderIntegrations() {
  const integrations = state.data.siteStructure.integrations.length ? state.data.siteStructure.integrations : [""];
  byId("integrationsContainer").innerHTML = integrations
    .map(
      (value) => `
        <div class="repeater-item">
          <input type="text" data-repeater="integrations" placeholder="e.g. Mailchimp, HubSpot, Google Analytics" value="${escapeAttribute(value)}">
          <button type="button" class="remove-btn" aria-label="Remove integration">×</button>
        </div>
      `
    )
    .join("");
}

function renderReferences() {
  const items = state.data.references.referenceSites.length ? state.data.references.referenceSites : [{ url: "", notes: "" }];
  byId("referencesContainer").innerHTML = items
    .map(
      (item) => `
        <div class="repeater-item repeater-item--double">
          <input type="url" data-repeater="referenceSites" data-field="url" placeholder="https://example.com" value="${escapeAttribute(item.url)}">
          <input type="text" data-repeater="referenceSites" data-field="notes" placeholder="What do you like about it?" value="${escapeAttribute(item.notes)}">
          <button type="button" class="remove-btn" aria-label="Remove reference website">×</button>
        </div>
      `
    )
    .join("");
}

function renderCompetitors() {
  const items = state.data.references.competitors.length ? state.data.references.competitors : [{ url: "", notes: "" }];
  byId("competitorsContainer").innerHTML = items
    .map(
      (item) => `
        <div class="repeater-item repeater-item--double">
          <input type="url" data-repeater="competitors" data-field="url" placeholder="https://competitor.com" value="${escapeAttribute(item.url)}">
          <input type="text" data-repeater="competitors" data-field="notes" placeholder="How should yours be different?" value="${escapeAttribute(item.notes)}">
          <button type="button" class="remove-btn" aria-label="Remove competitor website">×</button>
        </div>
      `
    )
    .join("");
}

function hydrateFormFromState() {
  const { basics, identity, colors, typography, style, content, siteStructure, references } = state.data;

  byId("websiteType").value = basics.websiteType;
  byId("industry").value = basics.industry;
  byId("targetAudience").value = basics.targetAudience;
  byId("primaryGoal").value = basics.primaryGoal;

  byId("businessName").value = identity.businessName;
  byId("tagline").value = identity.tagline;
  byId("mission").value = identity.mission;
  byId("uniqueness").value = identity.uniqueness;

  document.querySelectorAll("[data-mood]").forEach((chip) => chip.classList.remove("active"));
  colors.moods.forEach((mood) => {
    const chip = document.querySelector(`[data-mood="${mood}"]`);
    if (chip) {
      chip.classList.add("active");
    }
  });
  byId("paletteInstructions").value = colors.paletteInstructions || "";
  byId("preferredColors").value = colors.preferredColors || "";

  colors.palette.forEach((color, index) => {
    byId(`color${index}Hex`).value = color.hex;
    byId(`color${index}HexText`).textContent = color.hex.toUpperCase();
    byId(`color${index}Name`).value = color.name;
    byId(`color${index}Usage`).value = color.usage;
    renderColorSuggestion(index);
  });

  byId("headingFont").value = typography.headingFont;
  byId("bodyFont").value = typography.bodyFont;

  document.querySelectorAll(".style-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.style === style.selectedStyle);
  });

  document.querySelectorAll("input[name='layout']").forEach((input) => {
    input.checked = input.value === style.layout;
  });
  document.querySelectorAll("input[name='tone']").forEach((input) => {
    input.checked = input.value === content.tone;
  });
  byId("ctaText").value = content.ctaText;

  document.querySelectorAll("#visualElementsGrid input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = style.visualElements.includes(checkbox.value);
  });

  document.querySelectorAll("#pagesCheckboxes input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = siteStructure.pages.includes(checkbox.value) || checkbox.value === "home";
  });

  document.querySelectorAll("#featuresCheckboxes input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = siteStructure.features.includes(checkbox.value);
  });

  byId("designDonts").value = references.designDonts;
}

function syncStateFromForm() {
  const previousPalette = state.data.colors.palette;
  const previousReview = state.data.review;

  const nextData = {
    basics: {
      websiteType: byId("websiteType").value,
      industry: byId("industry").value.trim(),
      targetAudience: byId("targetAudience").value.trim(),
      primaryGoal: byId("primaryGoal").value.trim()
    },
    identity: {
      businessName: byId("businessName").value.trim(),
      tagline: byId("tagline").value.trim(),
      mission: byId("mission").value.trim(),
      values: collectSimpleRepeater("#valuesContainer input[data-repeater='values']"),
      uniqueness: byId("uniqueness").value.trim()
    },
    colors: {
      moods: Array.from(document.querySelectorAll("[data-mood].active")).map((chip) => chip.dataset.mood),
      paletteInstructions: byId("paletteInstructions").value.trim(),
      preferredColors: byId("preferredColors").value.trim(),
      palette: PALETTE_META.map((meta, index) => ({
        role: meta.role,
        label: meta.label,
        hex: byId(`color${index}Hex`).value,
        name: byId(`color${index}Name`).value.trim(),
        usage: byId(`color${index}Usage`).value.trim(),
        suggestedName: previousPalette[index] ? previousPalette[index].suggestedName || "" : ""
      }))
    },
    typography: {
      headingFont: byId("headingFont").value,
      bodyFont: byId("bodyFont").value
    },
    style: {
      selectedStyle: document.querySelector(".style-card.active") ? document.querySelector(".style-card.active").dataset.style : "modern",
      layout: document.querySelector("input[name='layout']:checked") ? document.querySelector("input[name='layout']:checked").value : "wide",
      visualElements: Array.from(document.querySelectorAll("#visualElementsGrid input[type='checkbox']:checked")).map((checkbox) => checkbox.value)
    },
    content: {
      tone: document.querySelector("input[name='tone']:checked") ? document.querySelector("input[name='tone']:checked").value : "friendly",
      messages: collectSimpleRepeater("#messagesContainer input[data-repeater='messages']"),
      ctaText: byId("ctaText").value.trim()
    },
    siteStructure: {
      pages: normalizePages(
        Array.from(document.querySelectorAll("#pagesCheckboxes input[type='checkbox']:checked")).map((checkbox) => checkbox.value),
        ["home"]
      ),
      customPages: collectObjectRepeater("#customPagesContainer .repeater-item", ["name", "description"]),
      features: Array.from(document.querySelectorAll("#featuresCheckboxes input[type='checkbox']:checked")).map((checkbox) => checkbox.value),
      integrations: collectSimpleRepeater("#integrationsContainer input[data-repeater='integrations']")
    },
    references: {
      referenceSites: collectObjectRepeater("#referencesContainer .repeater-item", ["url", "notes"]),
      competitors: collectObjectRepeater("#competitorsContainer .repeater-item", ["url", "notes"]),
      designDonts: byId("designDonts").value.trim()
    },
    review: {
      aiSummary: previousReview.aiSummary || "",
      generatedAt: previousReview.generatedAt || ""
    }
  };

  if (!nextData.colors.moods.length) {
    nextData.colors.moods = ["professional"];
    const defaultChip = document.querySelector("[data-mood='professional']");
    if (defaultChip) {
      defaultChip.classList.add("active");
    }
  }

  state = {
    ...state,
    data: nextData
  };

  renderAll();
}

function collectSimpleRepeater(selector) {
  return Array.from(document.querySelectorAll(selector))
    .map((input) => input.value.trim())
    .filter(Boolean);
}

function collectObjectRepeater(containerSelector, fields) {
  return Array.from(document.querySelectorAll(containerSelector))
    .map((item) => {
      const result = {};
      fields.forEach((field) => {
        const input = item.querySelector(`[data-field="${field}"]`);
        result[field] = input ? input.value.trim() : "";
      });
      return result;
    })
    .filter((item) => fields.some((field) => item[field]));
}

function renderAll(options = { save: true }) {
  updateProgressUI();
  updateTypographyPreview();
  renderPreview();
  renderReview();

  if (options.save !== false) {
    saveDraft();
  } else {
    updateSaveStatusText();
  }
}

function updateProgressUI() {
  const currentStep = clamp(state.currentStep, 1, TOTAL_STEPS);
  byId("stepIndicator").textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
  byId("progressBar").style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;

  document.querySelectorAll(".wizard-step").forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === currentStep);
  });

  document.querySelectorAll(".step-tab").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.stepTarget) === currentStep);
  });

  byId("prevStepBtn").disabled = currentStep === 1;
  byId("nextStepBtn").disabled = currentStep === TOTAL_STEPS;
  byId("nextStepBtn").textContent = currentStep === TOTAL_STEPS ? "All Steps Complete" : "Next Step";
}

function changeStep(direction) {
  goToStep(state.currentStep + direction);
}

function goToStep(step, options = { save: true }) {
  state.currentStep = clamp(step, 1, TOTAL_STEPS);
  updateProgressUI();
  renderReview();

  if (options.save !== false) {
    saveDraft();
  } else {
    updateSaveStatusText();
  }

  scrollBuilderToTop();
}

function saveDraft() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateSaveStatusText();
}

function updateSaveStatusText() {
  const saveStatus = byId("saveStatus");
  if (!state.updatedAt) {
    saveStatus.textContent = "Draft not saved yet";
    return;
  }

  saveStatus.textContent = `Saved locally ${formatRelativeTime(state.updatedAt)}`;
}

function formatRelativeTime(value) {
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 10000) {
    return "just now";
  }
  if (diff < 60000) {
    return `${Math.round(diff / 1000)} seconds ago`;
  }
  if (diff < 3600000) {
    return `${Math.round(diff / 60000)} minutes ago`;
  }
  return `${Math.round(diff / 3600000)} hours ago`;
}

function clearSavedDraft() {
  localStorage.removeItem(STORAGE_KEY);
  state.updatedAt = null;
  updateSaveStatusText();
  showDraftBanner("Saved local draft removed. Keep editing to create a fresh one.");
  showToast("Saved local draft cleared.");
}

function resetBuilder() {
  const confirmed = window.confirm("Clear the current draft and restart the builder?");
  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  state = buildDefaultState();
  renderDynamicListsFromState();
  hydrateFormFromState();
  clearSuggestionOutputs();
  goToStep(1, { save: false });
  renderAll({ save: false });
  showDraftBanner("Builder reset. You are back to the default starting point.");
  showToast("Builder reset.");
}

function clearSuggestionOutputs() {
  setPlaceholder("basicsAiResult", "Describe your website type and industry, then generate a sharper target audience and primary goal.");
  setPlaceholder("identityAiResult", "Generate a tagline or refine your mission to make the preview feel more complete.");
  setPlaceholder("colorsAiResult", "Pick a few moods, then let AI suggest a balanced palette with names and usage guidance.");
  setPlaceholder("typographyAiResult", "Generate a pairing if you want help choosing fonts that suit your style and audience.");
  setPlaceholder("contentAiResult", "Once you have basics and identity in place, AI can suggest stronger homepage messaging.");
  setPlaceholder("pagesAiResult", "Generate page recommendations based on your website type and goal.");
  setPlaceholder("featuresAiResult", "Generate feature recommendations once your pages and goals are defined.");
  setPlaceholder("summaryAiResult", "Generate a summary after you finish the key steps above.");
}

function showDraftBanner(message) {
  void message;
}

function togglePreviewOverlay() {
  document.body.classList.toggle("preview-open");
}

function closePreviewOverlay() {
  document.body.classList.remove("preview-open");
}

function scrollBuilderToTop() {
  const content = document.querySelector(".builder-content");
  const panel = document.querySelector(".builder-panel");

  if (content) {
    content.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (window.innerWidth <= 960 && panel) {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateTypographyPreview() {
  const { headingFont, bodyFont } = state.data.typography;
  loadGoogleFont(headingFont);
  loadGoogleFont(bodyFont);

  const sample = byId("typeSample");
  sample.style.fontFamily = `'${bodyFont}', sans-serif`;
  sample.querySelector("h3").style.fontFamily = `'${headingFont}', serif`;
}

function loadGoogleFont(fontName) {
  const fontId = `font-${fontName.replace(/\s+/g, "-")}`;
  if (document.getElementById(fontId)) {
    return;
  }

  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

function renderPreview() {
  const { basics, identity, colors, typography, style, content, siteStructure } = state.data;
  const palette = paletteMap(colors.palette);
  const brandName = identity.businessName || "Your Brand";
  const heroHeadline = identity.tagline || `A homepage for ${brandName}`;
  const heroCopy = identity.mission || buildFallbackMission(basics, content.tone);
  const ctaText = content.ctaText || "Get Started";
  const pages = getPlannedPages(siteStructure);
  const featureCards = getHomepageFeatureCards();
  const proofCards = getProofCards();
  const values = identity.values.length ? identity.values : ["Clear positioning", "Trust", "Strong CTA"];
  const navItems = pages.slice(0, 2);

  const previewStage = byId("previewStage");
  previewStage.style.setProperty("--preview-primary", palette.primary.hex);
  previewStage.style.setProperty("--preview-secondary", palette.secondary.hex);
  previewStage.style.setProperty("--preview-accent", palette.accent.hex);
  previewStage.style.setProperty("--preview-bg", palette.bg.hex);
  previewStage.style.setProperty("--preview-text", palette.text.hex);
  previewStage.style.setProperty("--preview-display-font", `'${typography.headingFont}', serif`);
  previewStage.style.setProperty("--preview-body-font", `'${typography.bodyFont}', sans-serif`);

  previewStage.innerHTML = `
    <div class="preview-site style-${escapeAttribute(style.selectedStyle)} layout-${escapeAttribute(style.layout)}">
      <div class="preview-shell">
        <nav class="preview-navbar">
          <div class="preview-brand">${escapeHtml(brandName)}</div>
          <div class="preview-navlinks">
            ${navItems.map((page) => `<span>${escapeHtml(page)}</span>`).join("")}
          </div>
          <button type="button" class="preview-btn">Book</button>
        </nav>

        <section class="preview-hero">
          <div class="preview-hero__content">
            <span class="preview-hero__eyebrow">${escapeHtml(WEBSITE_TYPE_LABELS[basics.websiteType] || "Website")} • ${escapeHtml(TONE_LABELS[content.tone] || "Friendly")}</span>
            <h1 class="preview-hero__headline">${escapeHtml(heroHeadline)}</h1>
            <p class="preview-hero__copy">${escapeHtml(heroCopy)}</p>
            <div class="preview-hero__actions">
              <button type="button" class="preview-btn">${escapeHtml(ctaText)}</button>
              <button type="button" class="preview-btn--ghost">See How It Works</button>
            </div>
          </div>

          <aside class="preview-hero__panel">
            <span class="preview-hero__badge">Live Website Direction</span>
            <h3>Homepage story</h3>
            <div class="preview-keylines">
              <div class="preview-keyline">
                <span class="preview-keyline__dot"></span>
                <div>
                  <strong>${escapeHtml(identity.businessName || "Your brand identity")}</strong>
                  <div>${escapeHtml(basics.primaryGoal || "Clarify the main action you want visitors to take.")}</div>
                </div>
              </div>
              <div class="preview-keyline">
                <span class="preview-keyline__dot"></span>
                <div>
                  <strong>Audience</strong>
                  <div>${escapeHtml(basics.targetAudience || "Your target audience will appear here once defined.")}</div>
                </div>
              </div>
              <div class="preview-keyline">
                <span class="preview-keyline__dot"></span>
                <div>
                  <strong>Visual direction</strong>
                  <div>${escapeHtml(capitalize(style.selectedStyle))} style with ${escapeHtml(style.layout)} layout cues.</div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section class="preview-section">
          <div class="preview-section__header">
            <div>
              <h2>Homepage feature focus</h2>
              <p>These cards adapt to your business type, messages, and chosen features.</p>
            </div>
          </div>
          <div class="preview-grid">
            ${featureCards
              .map(
                (card) => `
                  <article class="preview-card">
                    <div class="preview-card__icon"></div>
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.copy)}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>

        <section class="preview-section">
          <div class="preview-section__header">
            <div>
              <h2>About and trust layer</h2>
              <p>Mission and values become a confidence-building section on the homepage.</p>
            </div>
          </div>
          <div class="preview-about">
            <article class="preview-about__story">
              <h3>${escapeHtml(identity.businessName || "About your brand")}</h3>
              <p>${escapeHtml(identity.mission || "Use the mission field to explain what makes the business credible, helpful, and worth choosing.")}</p>
              ${identity.uniqueness ? `<p>${escapeHtml(identity.uniqueness)}</p>` : ""}
            </article>
            <aside class="preview-about__values">
              <h3>Core values in the design</h3>
              <div class="preview-values">
                ${values.map((value) => `<span class="preview-value">${escapeHtml(value)}</span>`).join("")}
              </div>
            </aside>
          </div>
        </section>

        <section class="preview-section">
          <div class="preview-section__header">
            <div>
              <h2>Proof and conversion modules</h2>
              <p>Selected features control which proof blocks appear on the homepage.</p>
            </div>
          </div>
          <div class="preview-proof-grid">
            ${proofCards
              .map((card) => {
                if (card.type === "gallery") {
                  return `
                    <article class="preview-proof-card preview-proof-card--gallery">
                      <h3>${escapeHtml(card.title)}</h3>
                      <p>${escapeHtml(card.copy)}</p>
                      <div class="preview-gallery-strip">
                        <div class="preview-gallery-tile"></div>
                        <div class="preview-gallery-tile"></div>
                        <div class="preview-gallery-tile"></div>
                      </div>
                    </article>
                  `;
                }

                return `
                  <article class="preview-proof-card">
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.copy)}</p>
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>

        <section class="preview-sitemap">
          <h3>Planned site structure</h3>
          <p>The homepage preview stays central, while your extra pages appear as a planned sitemap.</p>
          <div class="preview-sitemap__chips">
            ${pages.map((page) => `<span class="preview-sitemap__chip">${escapeHtml(page)}</span>`).join("")}
          </div>
        </section>

        <footer class="preview-footer">
          <div>
            <h3>${escapeHtml(content.ctaText || "Let’s start the conversation")}</h3>
            <p>${escapeHtml(buildFooterCopy())}</p>
          </div>
          <button type="button" class="preview-btn">${escapeHtml(ctaText)}</button>
        </footer>
      </div>
    </div>
  `;
}

function buildFallbackMission(basics, tone) {
  const typeLabel = WEBSITE_TYPE_LABELS[basics.websiteType] || "website";
  const toneLabel = TONE_LABELS[tone] || "friendly";
  const industry = basics.industry || "your industry";
  return `This ${toneLabel.toLowerCase()} ${typeLabel.toLowerCase()} homepage is designed to help visitors quickly understand the value of your ${industry.toLowerCase()} offer and take the right next step.`;
}

function buildFooterCopy() {
  const audience = state.data.basics.targetAudience || "your ideal visitors";
  const goal = state.data.basics.primaryGoal || "the next step";
  return `Guide ${audience.toLowerCase()} toward ${goal.toLowerCase()} with a confident final call-to-action.`;
}

function getHomepageFeatureCards() {
  const { basics, content, siteStructure } = state.data;
  const providedMessages = content.messages.filter(Boolean).slice(0, 3);

  if (providedMessages.length === 3) {
    return providedMessages.map((message, index) => ({
      title: message,
      copy: buildCardCopy(index, siteStructure.features)
    }));
  }

  const defaultsByType = {
    "service-business": [
      { title: "Clear offer", copy: "Show what you do, who it helps, and how to enquire without friction." },
      { title: "Trust signals", copy: "Use proof, testimonials, and process clarity to reduce hesitation." },
      { title: "Fast conversion path", copy: "Make it easy for visitors to contact you or request the next step." }
    ],
    agency: [
      { title: "Positioning", copy: "Lead with expertise, differentiation, and outcomes clients care about." },
      { title: "Selected work", copy: "Use proof modules that demonstrate your capability quickly." },
      { title: "Consultation CTA", copy: "Drive discovery calls and quality leads through one clear path." }
    ],
    ecommerce: [
      { title: "Product focus", copy: "Highlight top collections, benefits, and immediate purchase paths." },
      { title: "Proof and reassurance", copy: "Use reviews, shipping confidence, and FAQs to reduce drop-off." },
      { title: "Repeat browsing", copy: "Encourage discovery through collections, search, and featured products." }
    ],
    saas: [
      { title: "Product clarity", copy: "Explain the problem, solution, and outcomes with minimal friction." },
      { title: "Feature proof", copy: "Support the story with product benefits and workflow clarity." },
      { title: "Demo CTA", copy: "Lead users toward trial signup or booking a product walkthrough." }
    ],
    portfolio: [
      { title: "Signature work", copy: "Make standout projects and strengths instantly visible." },
      { title: "Creative viewpoint", copy: "Use tone and design style to express a distinct point of view." },
      { title: "Enquiry path", copy: "Invite collaboration with a direct and confidence-building CTA." }
    ],
    "hospitality-travel": [
      { title: "Experience promise", copy: "Lead with the destination, feeling, and booking motivation." },
      { title: "Visual immersion", copy: "Use gallery and social proof blocks to build desire." },
      { title: "Booking confidence", copy: "Make enquiries or reservations feel simple and premium." }
    ],
    "personal-brand": [
      { title: "Personal positioning", copy: "Clarify expertise, audience, and the value you bring." },
      { title: "Thought leadership", copy: "Support authority with articles, speaking, or social proof." },
      { title: "Connection CTA", copy: "Move visitors toward consultation, newsletter, or direct contact." }
    ],
    nonprofit: [
      { title: "Mission clarity", copy: "Communicate the cause and impact in a direct, human way." },
      { title: "Proof of impact", copy: "Use stories, testimonials, and evidence to build trust." },
      { title: "Next action", copy: "Direct supporters toward donate, volunteer, or get involved actions." }
    ]
  };

  return defaultsByType[basics.websiteType] || defaultsByType["service-business"];
}

function buildCardCopy(index, features) {
  const defaults = [
    "Turn this message into a focused homepage section that explains your value clearly.",
    "Use this message to build confidence through trust signals and differentiated copy.",
    "Support this message with a direct CTA that moves visitors to the next step."
  ];

  if (features.includes("booking") && index === 2) {
    return "Pair this message with booking or appointment actions so visitors can convert immediately.";
  }

  if (features.includes("ecommerce") && index === 1) {
    return "Support this message with product proof, buying reassurance, and conversion cues.";
  }

  return defaults[index] || defaults[0];
}

function getProofCards() {
  const cards = [];
  const pages = state.data.siteStructure.pages;
  const features = state.data.siteStructure.features;

  if (features.includes("testimonials") || pages.includes("testimonials")) {
    cards.push({
      type: "standard",
      title: "Testimonials block",
      copy: "Add review quotes or testimonials to reduce hesitation and strengthen trust."
    });
  }

  if (features.includes("gallery") || pages.includes("portfolio")) {
    cards.push({
      type: "gallery",
      title: "Gallery highlight",
      copy: "Use a visual strip to create desire and show the quality of your offer."
    });
  }

  if (features.includes("blog") || pages.includes("blog")) {
    cards.push({
      type: "standard",
      title: "Insights and content",
      copy: "Feature recent articles or resources to support authority and SEO."
    });
  }

  if (features.includes("booking")) {
    cards.push({
      type: "standard",
      title: "Booking call-to-action",
      copy: "Make appointments or reservations accessible from the homepage hero and footer."
    });
  }

  if (features.includes("contact-form") || pages.includes("contact")) {
    cards.push({
      type: "standard",
      title: "Enquiry capture",
      copy: "Use a clear form or enquiry block to capture high-intent visitors."
    });
  }

  if (!cards.length) {
    cards.push(
      {
        type: "standard",
        title: "Trust section",
        copy: "Even a simple homepage should use social proof, credentials, or process clarity."
      },
      {
        type: "standard",
        title: "Conversion section",
        copy: "Place your strongest CTA again lower on the page to capture ready visitors."
      },
      {
        type: "standard",
        title: "Planning reminder",
        copy: "Select more features in step 7 to see additional modules appear here."
      }
    );
  }

  return cards.slice(0, 3);
}

function getPlannedPages(siteStructure) {
  const presetPages = siteStructure.pages.map((page) => PAGE_LABELS[page] || capitalize(page));
  const customPages = siteStructure.customPages.map((page) => page.name).filter(Boolean);
  return [...presetPages, ...customPages];
}

function renderReview() {
  const { basics, identity, colors, typography, style, content, siteStructure, references, review } = state.data;
  const palette = colors.palette;

  byId("reviewContent").innerHTML = `
    <section class="review-section">
      <h3>Website Basics</h3>
      <p><strong>Website type:</strong> ${escapeHtml(WEBSITE_TYPE_LABELS[basics.websiteType] || "Not set")}</p>
      <p><strong>Industry:</strong> ${escapeHtml(basics.industry || "Not set")}</p>
      <p><strong>Target audience:</strong> ${escapeHtml(basics.targetAudience || "Not set")}</p>
      <p><strong>Primary goal:</strong> ${escapeHtml(basics.primaryGoal || "Not set")}</p>
    </section>

    <section class="review-section">
      <h3>Brand Identity</h3>
      <p><strong>Business name:</strong> ${escapeHtml(identity.businessName || "Not set")}</p>
      <p><strong>Tagline:</strong> ${escapeHtml(identity.tagline || "Not set")}</p>
      <p><strong>Mission:</strong> ${escapeHtml(identity.mission || "Not set")}</p>
      <div class="review-pill-group">
        ${identity.values.filter(Boolean).map((value) => `<span class="review-pill">${escapeHtml(value)}</span>`).join("") || '<span class="empty-review">No values added yet.</span>'}
      </div>
      ${identity.uniqueness ? `<p><strong>Differentiator:</strong> ${escapeHtml(identity.uniqueness)}</p>` : ""}
    </section>

    <section class="review-section">
      <h3>Visual System</h3>
      <p><strong>Heading font:</strong> ${escapeHtml(typography.headingFont)}</p>
      <p><strong>Body font:</strong> ${escapeHtml(typography.bodyFont)}</p>
      <p><strong>Style:</strong> ${escapeHtml(capitalize(style.selectedStyle))}</p>
      <p><strong>Layout:</strong> ${escapeHtml(capitalize(style.layout))}</p>
      ${colors.paletteInstructions ? `<p><strong>Palette instructions:</strong> ${escapeHtml(colors.paletteInstructions)}</p>` : ""}
      ${colors.preferredColors ? `<p><strong>Preferred colors:</strong> ${escapeHtml(colors.preferredColors)}</p>` : ""}
      <div class="review-pill-group">
        ${style.visualElements.map((item) => `<span class="review-pill">${escapeHtml(capitalize(item.replace(/-/g, " ")))}</span>`).join("") || '<span class="empty-review">No visual elements selected.</span>'}
      </div>
      <ul>
        ${palette.map((color) => `<li><strong>${escapeHtml(color.label)}:</strong> ${escapeHtml(color.name || color.hex)} (${escapeHtml(color.hex)})</li>`).join("")}
      </ul>
    </section>

    <section class="review-section">
      <h3>Content & CTAs</h3>
      <p><strong>Tone:</strong> ${escapeHtml(TONE_LABELS[content.tone] || "Not set")}</p>
      <p><strong>CTA text:</strong> ${escapeHtml(content.ctaText || "Not set")}</p>
      <ul>
        ${content.messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("") || "<li>No key messages added yet.</li>"}
      </ul>
    </section>

    <section class="review-section">
      <h3>Pages & Features</h3>
      <div class="review-pill-group">
        ${getPlannedPages(siteStructure).map((page) => `<span class="review-pill">${escapeHtml(page)}</span>`).join("")}
      </div>
      <div class="review-pill-group">
        ${siteStructure.features.map((feature) => `<span class="review-pill">${escapeHtml(FEATURE_LABELS[feature] || feature)}</span>`).join("") || '<span class="empty-review">No features selected yet.</span>'}
      </div>
      ${siteStructure.integrations.length ? `<p><strong>Integrations:</strong> ${escapeHtml(siteStructure.integrations.join(", "))}</p>` : ""}
    </section>

    <section class="review-section">
      <h3>References</h3>
      ${references.referenceSites.length ? `<p><strong>Reference sites:</strong> ${escapeHtml(references.referenceSites.map((item) => item.url).join(", "))}</p>` : "<p>No reference sites added.</p>"}
      ${references.competitors.length ? `<p><strong>Competitors:</strong> ${escapeHtml(references.competitors.map((item) => item.url).join(", "))}</p>` : "<p>No competitor sites added.</p>"}
      ${references.designDonts ? `<p><strong>Design don'ts:</strong> ${escapeHtml(references.designDonts)}</p>` : ""}
    </section>

    <section class="review-section">
      <h3>AI Executive Summary</h3>
      <p>${escapeHtml(review.aiSummary || "No AI summary applied yet.")}</p>
    </section>
  `;
}

async function runAiAction(action) {
  syncStateFromForm();

  try {
    switch (action) {
      case "positioning":
        await suggestPositioning();
        break;
      case "tagline":
        await suggestTagline();
        break;
      case "mission":
        await suggestMission();
        break;
      case "palette":
        await suggestPalette();
        break;
      case "fonts":
        await suggestFonts();
        break;
      case "content":
        await suggestContent();
        break;
      case "pages":
        await suggestPages();
        break;
      case "features":
        await suggestFeatures();
        break;
      case "summary":
        await suggestSummary();
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("AI action failed:", error);
    showToast("AI generation failed. You can still continue manually.");
  }
}

async function callAi(task, context = {}, options = {}) {
  const config = getAiPromptConfig(task, context);
  const showLoading = options.showLoading !== false;

  if (!config) {
    throw new Error(`Unknown AI task: ${task}`);
  }

  if (showLoading) {
    byId("loadingOverlay").classList.remove("hidden");
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: config.prompt }] }],
        generationConfig: {
          temperature: typeof config.temperature === "number" ? config.temperature : 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`AI request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const text = extractAiText(payload);

    if (!text) {
      throw new Error("AI response was empty.");
    }

    if (config.responseType === "json") {
      return safeParseJson(text);
    }

    return text.trim();
  } catch (error) {
    console.warn(`AI request failed for ${task}. Falling back to local suggestion.`, error);
    const fallback = getLocalSuggestion(task, context);
    if (fallback !== null && fallback !== undefined) {
      if (options.silentFallback !== true) {
        showToast(`AI unavailable. Used a local suggestion for ${task}.`);
      }
      return fallback;
    }
    throw error;
  } finally {
    if (showLoading) {
      byId("loadingOverlay").classList.add("hidden");
    }
  }
}

function getAiPromptConfig(task, context) {
  const data = context.data || state.data;
  const brand = data.identity.businessName || "the brand";
  const industry = data.basics.industry || "the chosen industry";
  const type = WEBSITE_TYPE_LABELS[data.basics.websiteType] || "website";
  const audience = data.basics.targetAudience || "the target audience";
  const goal = data.basics.primaryGoal || "the primary goal";
  const tone = TONE_LABELS[data.content.tone] || "friendly";

  switch (task) {
    case "positioning":
      return {
        responseType: "json",
        prompt: `You are helping a beginner define a website brief. Brand: ${brand}. Website type: ${type}. Industry: ${industry}. Existing target audience: ${audience}. Existing goal: ${goal}. Return strict JSON only with keys "targetAudience", "primaryGoal", and "insight". Keep it concise and practical.`
      };
    case "tagline":
      return {
        responseType: "text",
        prompt: `Write one concise tagline for ${brand}, a ${type} in ${industry}. It should match the brand's tone and feel memorable and distinct. Keep it under 9 words. Return only the tagline with no quotation marks.`
      };
    case "mission":
      return {
        responseType: "text",
        prompt: `Refine this mission for ${brand}, a ${type} in ${industry}. Keep it to 2 or 3 polished sentences, no bullets, no quotation marks. Existing mission: ${data.identity.mission || "None yet."}`
      };
    case "palette":
      return {
        responseType: "json",
        prompt: `Create a 5-color website palette for ${brand}, a ${type} in ${industry}. Desired moods: ${(data.colors.moods || []).join(", ") || "professional"}. Optional palette instructions: ${data.colors.paletteInstructions || "None provided."} Preferred colors or hex codes: ${data.colors.preferredColors || "None provided."} Return strict JSON only:
{"moods":["mood1","mood2"],"reason":"short rationale","palette":[
{"role":"primary","hex":"#112233","name":"Color Name","usage":"usage guidance"},
{"role":"secondary","hex":"#112233","name":"Color Name","usage":"usage guidance"},
{"role":"accent","hex":"#112233","name":"Color Name","usage":"usage guidance"},
{"role":"bg","hex":"#112233","name":"Color Name","usage":"usage guidance"},
{"role":"text","hex":"#112233","name":"Color Name","usage":"usage guidance"}
]}
Do not include markdown fences.`
      };
    case "colorName":
      return {
        responseType: "text",
        temperature: 0.5,
        prompt: `You are naming a website brand color. Brand: ${brand}. Industry: ${industry}. Color role: ${context.role}. Hex: ${context.hex}. Return only a 1 to 3 word color name with no punctuation.`
      };
    case "fonts":
      return {
        responseType: "json",
        prompt: `Suggest one heading font and one body font for ${brand}, a ${type} in ${industry}. Tone: ${tone}. Design style: ${data.style.selectedStyle}. You must choose from this list only: ${ALLOWED_FONTS.join(", ")}. Return strict JSON only with keys "headingFont", "bodyFont", and "reason".`
      };
    case "content":
      return {
        responseType: "json",
        prompt: `You are helping with homepage messaging for ${brand}, a ${type} in ${industry}. Audience: ${audience}. Goal: ${goal}. Current tone: ${tone}. Return strict JSON only with keys "tone", "messages", "ctaText", and "reason". "tone" must be one of: formal, friendly, authoritative, casual, inspiring. "messages" must contain exactly 3 short homepage messages.`
      };
    case "pages":
      return {
        responseType: "json",
        prompt: `Recommend website pages for ${brand}, a ${type} in ${industry}. Goal: ${goal}. Allowed page ids only: home, about, services, portfolio, blog, contact, faq, testimonials, team, pricing. Return strict JSON only with keys "pages" and "reason". Include "home".`
      };
    case "features":
      return {
        responseType: "json",
        prompt: `Recommend website features for ${brand}, a ${type} in ${industry}. Selected pages: ${data.siteStructure.pages.join(", ")}. Goal: ${goal}. Allowed feature ids only: contact-form, newsletter, search, social-media, blog, ecommerce, booking, user-accounts, live-chat, gallery, testimonials, multi-language, analytics, seo. Return strict JSON only with keys "features", "integrations", and "reason".`
      };
    case "summary":
      return {
        responseType: "text",
        prompt: `Write a concise executive summary for a website brief. Brand: ${brand}. Website type: ${type}. Industry: ${industry}. Audience: ${audience}. Goal: ${goal}. Tagline: ${data.identity.tagline || "None"}. Mission: ${data.identity.mission || "None"}. Style: ${data.style.selectedStyle}. Tone: ${tone}. Planned pages: ${getPlannedPages(data.siteStructure).join(", ")}. Features: ${data.siteStructure.features.map((feature) => FEATURE_LABELS[feature] || feature).join(", ")}. Write 2 short paragraphs in plain text with no markdown.`
      };
    default:
      return null;
  }
}

function getLocalSuggestion(task, context = {}) {
  const data = context.data || state.data;
  const brand = data.identity.businessName || "Your Brand";
  const industry = data.basics.industry || "your industry";
  const goal = data.basics.primaryGoal || "grow the business";
  const audience = data.basics.targetAudience || "your target audience";
  const tone = data.content.tone || "friendly";
  const pages = data.siteStructure.pages || ["home"];

  switch (task) {
    case "positioning":
      return {
        targetAudience: audience,
        primaryGoal: goal,
        insight: `${brand} should communicate its unique value clearly, build trust with its audience, and guide visitors toward a strong call to action.`
      };
    case "tagline":
      return buildFallbackTagline(data);
    case "mission":
      return `${brand} is dedicated to delivering exceptional value for ${audience} in the ${industry} space. The website should feel trustworthy, clear, and purposeful while making it easy for visitors to take the next step.`;
    case "palette":
      return {
        moods: data.colors.moods.length ? data.colors.moods : ["professional"],
        reason: buildPaletteFallbackReason(data.colors.paletteInstructions, data.colors.preferredColors),
        palette: applyPreferredColorsToPalette(PALETTE_META, data.colors.preferredColors).map((item) => ({
          role: item.role,
          hex: item.hex,
          name: item.name,
          usage: item.usage
        }))
      };
    case "colorName":
      return buildFallbackColorName(context.role, context.hex);
    case "fonts":
      return {
        headingFont: "Inter",
        bodyFont: "Inter",
        reason: "Inter is a clean, versatile font that works well for a wide range of industries and tones."
      };
    case "content":
      return {
        tone: tone,
        messages: [
          `${brand} delivers quality solutions for ${audience}`,
          "Trusted service, clear communication, and real results",
          "Get started today and see the difference"
        ],
        ctaText: data.content.ctaText || "Get Started",
        reason: "Generic messaging focused on trust and clarity — refine once you add more brand details."
      };
    case "pages":
      return {
        pages: ["home", "about", "services", "contact"],
        reason: `A focused set of pages covering who ${brand} is, what they offer, and how to get in touch.`
      };
    case "features":
      return {
        features: ["contact-form", "analytics", "seo"],
        integrations: ["Google Analytics"],
        reason: "A minimal, practical feature set suitable for most business websites."
      };
    case "summary":
      return `${brand} is a ${data.basics.websiteType || "business"} in ${industry}, built to serve ${audience} and achieve ${goal}.\n\nThe website should reflect the brand's chosen style and tone, with clear navigation, purposeful content, and a direct path to conversion.`;
    default:
      return null;
  }
}

function buildFallbackTagline(data) {
  const brand = data.identity.businessName || "Your Brand";
  const type = WEBSITE_TYPE_LABELS[data.basics.websiteType] || "business";
  return `${brand} — ${type} Built With Purpose`;
}

function buildFallbackColorName(role, hex) {
  const normalizedRole = String(role || "").toLowerCase();
  const map = {
    primary: "Brand Blue",
    secondary: "Deep Navy",
    accent: "Warm Amber",
    background: "Soft White",
    bg: "Soft White",
    text: "Rich Black"
  };

  return map[normalizedRole] || `Color ${String(hex || "").replace("#", "").slice(0, 3).toUpperCase()}`;
}

function buildPaletteFallbackReason(instructions, preferredColors) {
  const parts = ["This palette is designed to match your brand's chosen mood and color preferences."];

  if (instructions) {
    parts.push(`It also follows the requested direction: ${instructions}`);
  }

  if (preferredColors) {
    parts.push(`Preferred colors were considered: ${preferredColors}`);
  }

  return parts.join(" ");
}

function applyPreferredColorsToPalette(basePalette, preferredColors) {
  const hexes = extractHexColors(preferredColors);

  return basePalette.map((item, index) => {
    if (!hexes[index]) {
      return item;
    }

    return {
      ...item,
      hex: hexes[index]
    };
  });
}

function extractHexColors(value) {
  return String(value || "").match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) || [];
}

function extractAiText(payload) {
  const parts = payload && payload.candidates && payload.candidates[0] && payload.candidates[0].content ? payload.candidates[0].content.parts : null;
  if (!parts || !parts.length) {
    return "";
  }

  return parts.map((part) => part.text || "").join("").trim();
}

function safeParseJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

async function suggestPositioning() {
  const result = await callAi("positioning");
  renderSuggestion("basicsAiResult", {
    title: "Suggested positioning",
    bodyHtml: `
      <p><strong>Audience:</strong> ${escapeHtml(result.targetAudience || "")}</p>
      <p><strong>Primary goal:</strong> ${escapeHtml(result.primaryGoal || "")}</p>
      <p>${escapeHtml(result.insight || "")}</p>
    `,
    actions: [
      {
        label: "Apply Suggestions",
        kind: "primary",
        handler: () => {
          byId("targetAudience").value = result.targetAudience || byId("targetAudience").value;
          byId("primaryGoal").value = result.primaryGoal || byId("primaryGoal").value;
          syncStateFromForm();
          showToast("Positioning suggestions applied.");
        }
      }
    ]
  });
}

async function suggestTagline() {
  const result = await callAi("tagline");
  const tagline = firstLine(result) || buildFallbackTagline(state.data);
  byId("tagline").value = tagline;
  syncStateFromForm();
  renderSuggestion("identityAiResult", {
    title: "Tagline generated",
    bodyHtml: `<p>${escapeHtml(tagline)}</p><p>The tagline field has been filled so you can keep editing it if needed.</p>`,
    actions: [
      {
        label: "Use This As Is",
        kind: "ghost",
        handler: () => {
          byId("tagline").value = tagline;
          syncStateFromForm();
          showToast("Tagline applied.");
        }
      }
    ]
  });
  showToast("Tagline generated.");
}

async function suggestMission() {
  const result = await callAi("mission");
  renderSuggestion("identityAiResult", {
    title: "Refined mission",
    bodyHtml: `<p>${escapeHtml(result)}</p>`,
    actions: [
      {
        label: "Apply Mission",
        kind: "primary",
        handler: () => {
          byId("mission").value = result;
          syncStateFromForm();
          showToast("Mission applied.");
        }
      }
    ]
  });
}

async function suggestPalette() {
  const result = await callAi("palette");
  const normalizedPalette = normalizePaletteSuggestion(result);

  renderSuggestion("colorsAiResult", {
    title: "Suggested palette",
    bodyHtml: `
      <p>${escapeHtml(result.reason || "AI generated a palette based on your current brand direction.")}</p>
      ${state.data.colors.paletteInstructions ? `<p><strong>Instructions:</strong> ${escapeHtml(state.data.colors.paletteInstructions)}</p>` : ""}
      ${state.data.colors.preferredColors ? `<p><strong>Preferred colors:</strong> ${escapeHtml(state.data.colors.preferredColors)}</p>` : ""}
      <ul>
        ${normalizedPalette.map((item) => `<li><strong>${escapeHtml(capitalize(item.role))}:</strong> ${escapeHtml(item.name)} (${escapeHtml(item.hex)})</li>`).join("")}
      </ul>
    `,
    actions: [
      {
        label: "Apply Palette",
        kind: "primary",
        handler: () => {
          normalizedPalette.forEach((item, index) => {
            byId(`color${index}Hex`).value = item.hex;
            byId(`color${index}HexText`).textContent = item.hex.toUpperCase();
            byId(`color${index}Name`).value = item.name;
            byId(`color${index}Usage`).value = item.usage;
            state.data.colors.palette[index].suggestedName = "";
            renderColorSuggestion(index);
          });

          if (Array.isArray(result.moods) && result.moods.length) {
            document.querySelectorAll("[data-mood]").forEach((chip) => {
              chip.classList.toggle("active", result.moods.includes(chip.dataset.mood));
            });
          }

          syncStateFromForm();
          showToast("Palette applied.");
        }
      }
    ]
  });
}

function normalizePaletteSuggestion(result) {
  const source = Array.isArray(result.palette) ? result.palette : [];
  return PALETTE_META.map((meta, index) => {
    const match = source.find((item) => item.role === meta.role) || source[index] || {};
    return {
      role: meta.role,
      hex: match.hex || meta.hex,
      name: match.name || meta.name,
      usage: match.usage || meta.usage
    };
  });
}

async function suggestFonts() {
  const result = await callAi("fonts");
  const headingFont = ALLOWED_FONTS.includes(result.headingFont) ? result.headingFont : state.data.typography.headingFont;
  const bodyFont = ALLOWED_FONTS.includes(result.bodyFont) ? result.bodyFont : state.data.typography.bodyFont;

  renderSuggestion("typographyAiResult", {
    title: "Suggested font pairing",
    bodyHtml: `
      <p><strong>Headings:</strong> ${escapeHtml(headingFont)}</p>
      <p><strong>Body text:</strong> ${escapeHtml(bodyFont)}</p>
      <p>${escapeHtml(result.reason || "")}</p>
    `,
    actions: [
      {
        label: "Apply Fonts",
        kind: "primary",
        handler: () => {
          byId("headingFont").value = headingFont;
          byId("bodyFont").value = bodyFont;
          syncStateFromForm();
          showToast("Font pairing applied.");
        }
      }
    ]
  });
}

async function suggestContent() {
  const result = await callAi("content");
  const tone = TONE_LABELS[result.tone] ? result.tone : state.data.content.tone;
  const messages = Array.isArray(result.messages) ? result.messages.slice(0, 3) : [];

  renderSuggestion("contentAiResult", {
    title: "Suggested homepage messaging",
    bodyHtml: `
      <p><strong>Tone:</strong> ${escapeHtml(TONE_LABELS[tone] || tone)}</p>
      <ul>${messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}</ul>
      <p><strong>CTA:</strong> ${escapeHtml(result.ctaText || "")}</p>
      <p>${escapeHtml(result.reason || "")}</p>
    `,
    actions: [
      {
        label: "Apply Messaging",
        kind: "primary",
        handler: () => {
          const toneInput = document.querySelector(`input[name='tone'][value="${tone}"]`);
          if (toneInput) {
            toneInput.click();
          }
          state.data.content.messages = messages.length ? messages : state.data.content.messages;
          renderMessages();
          byId("ctaText").value = result.ctaText || byId("ctaText").value;
          syncStateFromForm();
          showToast("Messaging applied.");
        }
      }
    ]
  });
}

async function suggestPages() {
  const result = await callAi("pages");
  const recommended = normalizePages(result.pages || [], state.data.siteStructure.pages);

  renderSuggestion("pagesAiResult", {
    title: "Suggested page structure",
    bodyHtml: `
      <p>${escapeHtml(result.reason || "")}</p>
      <div class="review-pill-group">
        ${recommended.map((page) => `<span class="review-pill">${escapeHtml(PAGE_LABELS[page] || page)}</span>`).join("")}
      </div>
    `,
    actions: [
      {
        label: "Apply Pages",
        kind: "primary",
        handler: () => {
          document.querySelectorAll("#pagesCheckboxes input[type='checkbox']").forEach((checkbox) => {
            if (checkbox.value === "home") {
              checkbox.checked = true;
              return;
            }
            checkbox.checked = recommended.includes(checkbox.value);
          });
          syncStateFromForm();
          showToast("Page suggestions applied.");
        }
      }
    ]
  });
}

async function suggestFeatures() {
  const result = await callAi("features");
  const features = Array.isArray(result.features) ? result.features.filter((item) => FEATURE_LABELS[item]) : [];
  const integrations = Array.isArray(result.integrations) ? result.integrations.filter(Boolean) : [];

  renderSuggestion("featuresAiResult", {
    title: "Suggested functionality",
    bodyHtml: `
      <p>${escapeHtml(result.reason || "")}</p>
      <div class="review-pill-group">
        ${features.map((feature) => `<span class="review-pill">${escapeHtml(FEATURE_LABELS[feature])}</span>`).join("")}
      </div>
      ${integrations.length ? `<p><strong>Suggested integrations:</strong> ${escapeHtml(integrations.join(", "))}</p>` : ""}
    `,
    actions: [
      {
        label: "Apply Features",
        kind: "primary",
        handler: () => {
          document.querySelectorAll("#featuresCheckboxes input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = features.includes(checkbox.value);
          });
          state.data.siteStructure.integrations = integrations.length ? integrations : state.data.siteStructure.integrations;
          renderIntegrations();
          syncStateFromForm();
          showToast("Feature suggestions applied.");
        }
      }
    ]
  });
}

async function suggestSummary() {
  const result = await callAi("summary");
  renderSuggestion("summaryAiResult", {
    title: "Executive summary",
    bodyHtml: result
      .split(/\n+/)
      .filter(Boolean)
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join(""),
    actions: [
      {
        label: "Use In Export",
        kind: "primary",
        handler: () => {
          state.data.review.aiSummary = result;
          state.data.review.generatedAt = new Date().toISOString();
          renderReview();
          saveDraft();
          showToast("Executive summary saved into the brief.");
        }
      }
    ]
  });
}

function scheduleColorNaming(index, hex) {
  const existing = colorNameDebouncers.get(index);
  if (existing) {
    clearTimeout(existing);
  }

  const timeout = setTimeout(async () => {
    try {
      const suggestion = await callAi(
        "colorName",
        {
          role: PALETTE_META[index].label,
          hex,
          data: state.data
        },
        { showLoading: false, silentFallback: true }
      );

      state.data.colors.palette[index].suggestedName = firstLine(suggestion);
      renderColorSuggestion(index);
    } catch (error) {
      console.error("Color naming failed:", error);
    }
  }, 700);

  colorNameDebouncers.set(index, timeout);
}

function renderColorSuggestion(index) {
  const container = byId(`color${index}Suggestion`);
  const suggestion = state.data.colors.palette[index].suggestedName;
  const currentValue = byId(`color${index}Name`).value.trim();

  if (!suggestion || suggestion === currentValue) {
    container.classList.add("hidden");
    container.innerHTML = "";
    return;
  }

  const actionId = registerSuggestionHandler(() => {
    byId(`color${index}Name`).value = suggestion;
    state.data.colors.palette[index].suggestedName = "";
    syncStateFromForm();
    showToast("Color name applied.");
  });

  container.classList.remove("hidden");
  container.innerHTML = `
    <div><strong>AI name suggestion:</strong> ${escapeHtml(suggestion)}</div>
    <button type="button" class="ghost-btn" data-suggestion-action="${actionId}">Apply Name</button>
  `;
}

function renderSuggestion(targetId, config) {
  const target = byId(targetId);
  const actionMarkup = (config.actions || [])
    .map((action) => {
      const id = registerSuggestionHandler(action.handler);
      const buttonClass = action.kind === "ghost" ? "ghost-btn" : "primary-btn";
      return `<button type="button" class="${buttonClass}" data-suggestion-action="${id}">${escapeHtml(action.label)}</button>`;
    })
    .join("");

  target.classList.remove("suggestion-panel--placeholder");
  target.innerHTML = `
    <h4>${escapeHtml(config.title)}</h4>
    ${config.bodyHtml}
    ${actionMarkup ? `<div class="suggestion-actions">${actionMarkup}</div>` : ""}
  `;
}

function setPlaceholder(targetId, text) {
  const target = byId(targetId);
  target.classList.add("suggestion-panel--placeholder");
  target.innerHTML = escapeHtml(text);
}

function registerSuggestionHandler(handler) {
  const id = `suggestion-${++suggestionActionCounter}`;
  suggestionHandlers.set(id, handler);
  return id;
}

async function exportToWord() {
  if (!window.docx) {
    showToast("Word export library could not be loaded.");
    return;
  }

  syncStateFromForm();

  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, ShadingType, WidthType } = window.docx;
  const data = state.data;

  const createParagraph = (text, options = {}) =>
    new Paragraph({
      children: [
        new TextRun({
          text,
          bold: Boolean(options.bold),
          size: options.size || 24
        })
      ],
      spacing: { after: options.after || 180 }
    });

  const createHeading = (text) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 180 }
    });

  const colorRows = data.colors.palette.map((color) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          children: [createParagraph(color.label, { bold: true, size: 22 })]
        }),
        new TableCell({
          width: { size: 34, type: WidthType.PERCENTAGE },
          children: [createParagraph(color.name || color.hex, { size: 22 })]
        }),
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          children: [createParagraph(color.hex, { size: 22 })]
        }),
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: color.hex.replace("#", "") },
          children: [new Paragraph("")]
        })
      ]
    });
  });

  const doc = new Document({
    creator: "AI Website Builder Studio",
    title: `${data.identity.businessName || "Website"} Brief`,
    sections: [
      {
        children: [
          new Paragraph({
            text: `${data.identity.businessName || "Website Project"} Brief`,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 240 }
          }),
          createParagraph(`Website Type: ${WEBSITE_TYPE_LABELS[data.basics.websiteType] || "Not set"}`),
          createParagraph(`Industry: ${data.basics.industry || "Not set"}`),
          createParagraph(`Target Audience: ${data.basics.targetAudience || "Not set"}`),
          createParagraph(`Primary Goal: ${data.basics.primaryGoal || "Not set"}`),

          createHeading("Brand Identity"),
          createParagraph(`Tagline: ${data.identity.tagline || "Not set"}`),
          createParagraph(`Mission: ${data.identity.mission || "Not set"}`),
          createParagraph(`Core Values: ${data.identity.values.join(", ") || "Not set"}`),
          createParagraph(`Differentiator: ${data.identity.uniqueness || "Not set"}`),

          createHeading("Typography"),
          createParagraph(`Heading Font: ${data.typography.headingFont}`),
          createParagraph(`Body Font: ${data.typography.bodyFont}`),

          createHeading("Color System"),
          ...(data.colors.paletteInstructions ? [createParagraph(`Palette Instructions: ${data.colors.paletteInstructions}`, { size: 22 })] : []),
          ...(data.colors.preferredColors ? [createParagraph(`Preferred Colors: ${data.colors.preferredColors}`, { size: 22 })] : []),
          new Table({
            width: { size: 100, type: "pct" },
            rows: colorRows
          }),

          createHeading("Content & CTA"),
          createParagraph(`Tone: ${TONE_LABELS[data.content.tone] || "Not set"}`),
          createParagraph(`CTA Text: ${data.content.ctaText || "Not set"}`),
          ...data.content.messages.map((message) => createParagraph(`• ${message}`, { size: 22, after: 120 })),

          createHeading("Pages"),
          ...getPlannedPages(data.siteStructure).map((page) => createParagraph(`• ${page}`, { size: 22, after: 120 })),

          createHeading("Features"),
          ...(data.siteStructure.features.length
            ? data.siteStructure.features.map((feature) => createParagraph(`• ${FEATURE_LABELS[feature] || feature}`, { size: 22, after: 120 }))
            : [createParagraph("No features selected.", { size: 22 })]),

          createHeading("Integrations"),
          ...(data.siteStructure.integrations.length
            ? data.siteStructure.integrations.map((integration) => createParagraph(`• ${integration}`, { size: 22, after: 120 }))
            : [createParagraph("No integrations selected.", { size: 22 })]),

          createHeading("References"),
          ...(data.references.referenceSites.length
            ? data.references.referenceSites.map((item) => createParagraph(`• ${item.url} — ${item.notes}`, { size: 22, after: 120 }))
            : [createParagraph("No reference sites added.", { size: 22 })]),
          ...(data.references.competitors.length
            ? [
                createHeading("Competitors"),
                ...data.references.competitors.map((item) => createParagraph(`• ${item.url} — ${item.notes}`, { size: 22, after: 120 }))
              ]
            : []),

          createHeading("AI Executive Summary"),
          createParagraph(data.review.aiSummary || "No AI summary saved.", { size: 22 })
        ]
      }
    ]
  });

  try {
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(data.identity.businessName || "website-brief").replace(/\s+/g, "-").toLowerCase()}.docx`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Word brief downloaded.");
  } catch (error) {
    console.error("Export failed:", error);
    showToast("Export failed. Please try again.");
  }
}

function firstLine(text) {
  const line = String(text || "").split("\n").find(Boolean);
  return line ? line.trim() : "";
}

function paletteMap(palette) {
  return palette.reduce((accumulator, item) => {
    accumulator[item.role] = item;
    return accumulator;
  }, {});
}

function capitalize(value) {
  const text = String(value || "").replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function byId(id) {
  return document.getElementById(id);
}

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2600);
}
