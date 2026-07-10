"use strict";

/* ================= PROJECT DATA ================= */
const CATEGORY_LABELS = { web: "Web & Interface", design: "Design", motion: "Motion" };
const C = "./assets/cases";
const img = (s) => ({ t: "img", src: s });
const vid = (s) => ({ t: "vid", src: s });
const seq = (dir, n) => Array.from({ length: n }, (_, i) => img(`${C}/${dir}/${String(i + 1).padStart(2, "0")}.webp`));

const PROJECTS = [
  /* ---------- WEB ---------- */
  {
    id: "laboratorio-criativo",
    category: "web",
    eyebrow: "E-commerce · UX/UI & Code",
    title: "Laboratório Criativo",
    description:
      "Full e-commerce experience designed and built end to end — from brand-aligned interface design in Photoshop to a responsive, performance-focused front-end running on WordPress. Clear product hierarchy, fast navigation and a frictionless checkout flow.",
    thumb: "./assets/creative-art-8.webp",
    media: [img("./assets/creative-art-8.webp"), ...seq("laboratorio-criativo", 3)],
    tools: ["devicon-photoshop-plain", "devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain", "devicon-wordpress-plain"],
    date: "2025",
    role: "Design & Development",
    link: "https://www.laboratoriocriativo.com",
  },
  {
    id: "euvatar-landing",
    category: "web",
    eyebrow: "Landing Page · Real Estate & Events",
    title: "Euvatar — Landing Page",
    description:
      "Conversion-focused landing page for Euvatar's real estate and events vertical: clear value proposition above the fold, fast loading, and a layout engineered to guide visitors straight to contact.",
    thumb: `${C}/euvatar-landing/01.webp`,
    media: seq("euvatar-landing", 6),
    tools: ["devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain"],
    date: "2025",
    role: "Design & Development",
  },
  {
    id: "euvatar-institucional",
    category: "web",
    eyebrow: "Institutional Website",
    title: "Euvatar — Institutional",
    description:
      "Euvatar's institutional website, built with a modern Tailwind + Vite stack. Brand imagery produced in Photoshop and Premiere, enhanced with AI-generated visuals via OpenAI and Kling AI for a distinctive presence.",
    thumb: `${C}/euvatar-institucional/01.webp`,
    media: seq("euvatar-institucional", 6),
    tools: ["devicon-tailwindcss-original", "devicon-vitejs-plain", "devicon-photoshop-plain", "devicon-premierepro-plain", "OpenAI", "Kling AI"],
    date: "2025",
    role: "Design & Development",
  },
  {
    id: "super-tratores-site",
    category: "web",
    eyebrow: "Institutional Website · Unofficial Study",
    title: "Super Tratores New Holland",
    description:
      "Unofficial concept study for a New Holland dealership website: heavy-machinery product showcase, bold hero treatment and motion-enhanced media produced in Photoshop and Premiere.",
    thumb: `${C}/super-tratores-site/01.webp`,
    media: seq("super-tratores-site", 4),
    tools: ["devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain", "devicon-photoshop-plain", "devicon-premierepro-plain"],
    date: "2025",
    role: "Concept, Design & Development",
  },
  {
    id: "qual-a-boa",
    category: "web",
    eyebrow: "Mobile App · UX/UI & Code",
    title: "Qual a Boa?",
    description:
      "App for discovering what's happening around you — events, bars and experiences in one place. Designed and built as a lightweight, responsive web app with a fast, mobile-first interface.",
    thumb: `${C}/qual-a-boa/01.webp`,
    media: seq("qual-a-boa", 10),
    tools: ["devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain"],
    date: "2025",
    role: "Design & Development",
  },
  {
    id: "euvatar-360",
    category: "web",
    eyebrow: "Interactive App · Immersive 360",
    title: "Euvatar — 360 Around Europe",
    description:
      "Immersive 360° experience taking users on a virtual trip through Europe. Web front-end paired with Lens Studio interactions, with visual assets refined in Photoshop and Premiere.",
    thumb: `${C}/euvatar-360/01.webp`,
    media: seq("euvatar-360", 6),
    tools: ["devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain", "Lens Studio", "devicon-photoshop-plain", "devicon-premierepro-plain"],
    date: "2025",
    role: "Design & Development",
  },

  /* ---------- DESIGN ---------- */
  {
    id: "colonial",
    category: "design",
    eyebrow: "Social Media Design",
    title: "Colonial",
    description:
      "Ongoing visual production for social media: campaign artwork, product highlights and AI-assisted digital manipulation. A consistent visual system built to keep the feed cohesive while every piece stays individually striking.",
    thumb: "./assets/creative-art-1.webp",
    media: [img("./assets/creative-art-1.webp"), img("./assets/creative-art-2.webp"), img("./assets/creative-art-3.webp"), img("./assets/creative-art-7.webp")],
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: "Art Direction & Design",
    link: "https://www.behance.net/gallery/245339401/AI-Art-Digital-Manipulation",
  },
  {
    id: "super-tratores-social",
    category: "design",
    eyebrow: "Social Media · Study Content",
    title: "Super Tratores",
    description:
      "Social media study content for the agricultural machinery segment: strong product presence, bold typography and a feed system designed to feel premium in a traditionally functional market.",
    thumb: `${C}/super-tratores-social/01.webp`,
    media: seq("super-tratores-social", 3),
    tools: ["devicon-canva-original", "devicon-photoshop-plain"],
    date: "2025",
    role: "Design",
  },
  {
    id: "euvatar-social",
    category: "design",
    eyebrow: "Social Media Design",
    title: "Euvatar — Social Media",
    description:
      "Continuous social media production for Euvatar: campaign pieces, product communication and brand-consistent visual assets across the whole feed.",
    thumb: `${C}/euvatar-social/01.webp`,
    media: seq("euvatar-social", 10),
    tools: ["devicon-canva-original", "devicon-photoshop-plain"],
    date: "2025",
    role: "Design",
  },
  {
    id: "mister-burguer",
    category: "design",
    eyebrow: "Concept Artwork",
    title: "Mister Burguer",
    description:
      "Personal concept artwork exploring appetite-driven composition, dramatic lighting and bold typography for a fictional burger brand — a study in making food photography feel cinematic.",
    thumb: "./assets/creative-art-5.webp",
    media: [img("./assets/creative-art-5.webp")],
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: "Concept & Design",
    link: "https://www.behance.net/gallery/242726891/Mister-Burguer-Concept-Artwork",
  },
  {
    id: "smart-fit",
    category: "design",
    eyebrow: "Concept Study",
    title: "Smart Fit",
    description:
      "Unofficial concept study reimagining fitness-brand communication: high-energy composition, strong contrast and motion-inspired treatment applied to static social pieces.",
    thumb: "./assets/creative-art-4.webp",
    media: [img("./assets/creative-art-4.webp")],
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: "Concept & Design",
    link: "https://www.behance.net/gallery/242391919/Personal-Concept-Study",
  },
  {
    id: "food-and-drinks",
    category: "design",
    eyebrow: "Concept Study",
    title: "Food & Drinks",
    description:
      "A visual exploration of food and beverage art direction — texture, color grading and layout studies designed to translate flavor into imagery.",
    thumb: "./assets/creative-art-6.webp",
    media: [img("./assets/creative-art-6.webp")],
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: "Concept & Design",
    link: "https://www.behance.net/gallery/242391919/Personal-Concept-Study",
  },

  /* ---------- MOTION ---------- */
  {
    id: "personal-luan",
    category: "motion",
    eyebrow: "Reels · Social Media",
    title: "Personal Luan",
    description:
      "Short-form reels produced for social media: dynamic cuts, rhythm-driven editing and clean motion graphics built to hold attention in the feed.",
    thumb: `${C}/personal-luan/cover.webp`,
    media: [vid(`${C}/personal-luan/video-01.mp4`), vid(`${C}/personal-luan/video-02.mp4`)],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut"],
    date: "2025",
    role: "Edit & Motion",
  },
  {
    id: "melnick",
    category: "motion",
    eyebrow: "Reels · Social Media",
    title: "Melnick",
    description:
      "Social media reel combining live footage with AI-generated sequences via OpenAI and Kling AI — a hybrid pipeline for premium real estate storytelling.",
    thumb: `${C}/melnick/cover.webp`,
    media: [vid(`${C}/melnick/video-01.mp4`)],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "OpenAI", "Kling AI"],
    date: "2025",
    role: "Edit & Motion",
  },
  {
    id: "psj",
    category: "motion",
    eyebrow: "Promo Reels · Social Media",
    title: "PSJ",
    description:
      "Promotional reel for social media, blending edited footage with AI-assisted visuals to amplify reach and impact.",
    thumb: `${C}/psj/cover.webp`,
    media: [vid(`${C}/psj/video-01.mp4`)],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "OpenAI", "Kling AI"],
    date: "2025",
    role: "Edit & Motion",
  },
  {
    id: "rughor",
    category: "motion",
    eyebrow: "Character Brought to Life · Study",
    title: "Rughor",
    description:
      "Study project bringing an original character to life: concept stills developed in Photoshop, animated and refined through FlowLabs, cut in Premiere and CapCut.",
    thumb: `${C}/rughor/01.webp`,
    media: [vid(`${C}/rughor/video-01.mp4`), ...seq("rughor", 2)],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "FlowLabs"],
    date: "2025",
    role: "Concept, Design & Motion",
  },
  {
    id: "mister-burguer-motion",
    category: "motion",
    eyebrow: "Character Brought to Life · Study",
    title: "Mister Burguer — Motion",
    description:
      "The Mister Burguer character stepping out of the still frame: a study in character animation, from concept art to a finished motion piece.",
    thumb: `${C}/mister-burguer-motion/01.webp`,
    media: [vid(`${C}/mister-burguer-motion/video-01.mp4`), ...seq("mister-burguer-motion", 5)],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "FlowLabs"],
    date: "2025",
    role: "Concept, Design & Motion",
  },
  {
    id: "et-euvatar",
    category: "motion",
    eyebrow: "Mascot Study · Character in Motion",
    title: "ET — Euvatar Mascot",
    description:
      "Creation study for Euvatar's mascot: character design brought to life with an AI-assisted pipeline combining OpenAI, Kling AI and traditional editing.",
    thumb: `${C}/et-euvatar/01.webp`,
    media: [vid(`${C}/et-euvatar/video-01.mp4`), ...seq("et-euvatar", 2)],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "OpenAI", "Kling AI"],
    date: "2025",
    role: "Concept, Design & Motion",
  },
  {
    id: "capi-do-agro",
    category: "motion",
    eyebrow: "Creation Collab with @Euvatar",
    title: "Capi do Agro",
    description:
      "Collaborative character creation with @Euvatar: editing and refinement of the character across a series of motion pieces and supporting stills.",
    thumb: `${C}/capi-do-agro/01.webp`,
    media: [vid(`${C}/capi-do-agro/video-01.mp4`), vid(`${C}/capi-do-agro/video-02.mp4`), vid(`${C}/capi-do-agro/video-03.mp4`), ...seq("capi-do-agro", 5)],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut"],
    date: "2025",
    role: "Edit & Character Refinement",
  },
];

/* ================= DOM ================= */
const panels = Array.from(document.querySelectorAll(".panel"));
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
const track = document.getElementById("workTrack");
const modal = document.getElementById("caseModal");
const video = document.getElementById("bgVideo");
const meter = document.getElementById("edgeMeter");
const meterFill = meter.querySelector("i");
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HERO_INDEX = 0;
const WORK_INDEX = panels.findIndex((p) => p.id === "work");
const CONTACT_INDEX = panels.findIndex((p) => p.id === "contact");

/* ================= RENDER ================= */
const toolHTML = (t) =>
  t.startsWith("devicon-") || t.startsWith("fa-")
    ? `<i class="${t}" aria-hidden="true"></i>`
    : `<span class="tool-tag">${t}</span>`;

track.innerHTML = PROJECTS.map(
  (p) => `
  <button class="card" data-category="${p.category}" data-id="${p.id}" aria-haspopup="dialog" aria-label="Open case study: ${p.title}">
    <span class="card-thumb"><img src="${p.thumb}" alt="${p.title} — project preview" loading="lazy" decoding="async" width="370" height="278" /></span>
    <span class="card-body">
      <span class="card-eyebrow">${p.eyebrow}</span>
      <span class="card-title">${p.title}</span>
      <span class="card-tools">${p.tools.map(toolHTML).join("")}</span>
      <span class="card-cta">View case <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
    </span>
  </button>`
).join("");

/* ================= PANEL CONTROLLER ================= */
let index = 0;
let animating = false;
let lastNavTime = 0;
const SWAP_MS = 980;

function syncChrome(i) {
  navLinks.forEach((a) => {
    const active = Number(a.dataset.goto) === i;
    a.classList.toggle("is-active", active);
    if (active) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  document.body.classList.toggle("theme-dark", i === CONTACT_INDEX);
  if (video) {
    if (i === HERO_INDEX) video.play().catch(() => {});
    else video.pause();
  }
}

function goTo(i) {
  i = Math.max(0, Math.min(panels.length - 1, i));
  if (i === index || animating) return;

  hideMeter();
  const outgoing = panels[index];
  const incoming = panels[i];
  index = i;
  syncChrome(i);
  if (i === WORK_INDEX) resetTrack();

  if (REDUCED) {
    outgoing.classList.remove("is-active", "is-leaving");
    incoming.classList.add("is-active");
    lastNavTime = performance.now();
    return;
  }

  animating = true;
  outgoing.classList.remove("is-active");
  outgoing.classList.add("is-leaving");
  incoming.classList.add("is-active");

  setTimeout(() => {
    outgoing.classList.remove("is-leaving");
    animating = false;
    lastNavTime = performance.now();
  }, SWAP_MS);
}

/* ================= WORK TRACK ================= */
let trackTarget = 0;
let trackRAF = null;

const trackMax = () => Math.max(0, track.scrollWidth - track.clientWidth);
const resetTrack = () => { trackTarget = track.scrollLeft; };

function trackLoop() {
  const diff = trackTarget - track.scrollLeft;
  if (Math.abs(diff) < 0.5) {
    track.scrollLeft = trackTarget;
    trackRAF = null;
    return;
  }
  track.scrollLeft += diff * 0.14;
  trackRAF = requestAnimationFrame(trackLoop);
}
function nudgeTrack(delta) {
  trackTarget = Math.max(0, Math.min(trackMax(), trackTarget + delta));
  if (!trackRAF) trackRAF = requestAnimationFrame(trackLoop);
}

/* ================= EDGE METER ================= */
let meterHideTimer = null;
function showMeter(progress) {
  meter.classList.add("show");
  meterFill.style.setProperty("--p", Math.min(1, progress).toFixed(3));
  clearTimeout(meterHideTimer);
  meterHideTimer = setTimeout(hideMeter, 500);
}
function hideMeter() {
  meter.classList.remove("show");
  meterFill.style.setProperty("--p", 0);
}

/* ================= GESTURE-INTENT NAVIGATION =================
   Safety lock: a gesture can only change section if it STARTED while the
   panel was already resting at that boundary. The flick that carries you
   to the edge never navigates — a second, deliberate gesture does. The
   hero is exempt (any downward gesture advances). */

const GESTURE_GAP = 280; // ms of silence = new wheel gesture
const NAV_ACCUM = 170;   // deliberate push needed at an edge

let lastWheelTime = 0;
let gestureDir = 0;
let gestureAccum = 0;
let gestureEligible = false; // started at the boundary?
let gestureConsumed = false;

function atBoundary(dir) {
  const panel = panels[index];
  if (index === WORK_INDEX) {
    return dir > 0 ? trackTarget >= trackMax() - 1 : trackTarget <= 1;
  }
  const scrollable = panel.scrollHeight - panel.clientHeight > 4;
  if (!scrollable) return true;
  return dir > 0
    ? panel.scrollTop >= panel.scrollHeight - panel.clientHeight - 1
    : panel.scrollTop <= 1;
}

const cooling = () => animating || performance.now() - lastNavTime < 450;

window.addEventListener(
  "wheel",
  (e) => {
    if (!modal.hidden) return;
    if (animating) { e.preventDefault(); return; }

    const now = performance.now();
    const dir = e.deltaY > 0 ? 1 : -1;
    const fresh = now - lastWheelTime > GESTURE_GAP || dir !== gestureDir;
    lastWheelTime = now;
    if (fresh) {
      gestureDir = dir;
      gestureAccum = 0;
      gestureConsumed = false;
      gestureEligible = atBoundary(dir) && !cooling();
    }
    gestureAccum += Math.abs(e.deltaY);

    /* HERO: simple, no locks going down */
    if (index === HERO_INDEX) {
      e.preventDefault();
      if (dir > 0 && !cooling() && Math.abs(e.deltaY) >= 12) goTo(index + 1);
      return;
    }

    /* WORK: drive the horizontal track */
    if (index === WORK_INDEX) {
      e.preventDefault();
      const atEdge = atBoundary(dir);
      if (!atEdge) {
        gestureEligible = false; // this gesture brought us to the edge — it can't navigate
        nudgeTrack(e.deltaY * 1.6);
        return;
      }
      if (gestureConsumed || cooling()) return;
      if (!gestureEligible) { showMeter(0); return; } // hint: one more deliberate scroll
      showMeter(gestureAccum / NAV_ACCUM);
      if (gestureAccum >= NAV_ACCUM) {
        gestureConsumed = true;
        goTo(index + dir);
      }
      return;
    }

    /* OTHER PANELS: allow inner scroll, guard the section change */
    const panel = panels[index];
    const scrollable = panel.scrollHeight - panel.clientHeight > 4;
    if (scrollable && !atBoundary(dir)) {
      gestureEligible = false;
      return; // native inner scroll
    }
    e.preventDefault();
    if (gestureConsumed || cooling() || !gestureEligible) return;
    if (gestureAccum >= 90) {
      gestureConsumed = true;
      goTo(index + dir);
    }
  },
  { passive: false }
);

/* ================= TOUCH ================= */
let startY = 0;
let startX = 0;
let lastY = 0;
let lastX = 0;
let touchEligibleDown = false;
let touchEligibleUp = false;

window.addEventListener("touchstart", (e) => {
  startY = lastY = e.touches[0].clientY;
  startX = lastX = e.touches[0].clientX;
  touchEligibleDown = atBoundary(1);
  touchEligibleUp = atBoundary(-1);
}, { passive: true });

window.addEventListener("touchmove", (e) => {
  if (!modal.hidden) return;
  if (index !== WORK_INDEX) return;
  e.preventDefault();
  const t = e.touches[0];
  const dy = lastY - t.clientY;
  const dx = lastX - t.clientX;
  lastY = t.clientY;
  lastX = t.clientX;
  nudgeTrack((dy + dx) * 2.1);
}, { passive: false });

window.addEventListener("touchend", (e) => {
  if (!modal.hidden || animating || cooling()) return;
  const dy = startY - e.changedTouches[0].clientY;
  const dx = startX - e.changedTouches[0].clientX;
  const dir = dy > 0 ? 1 : -1;
  const panel = panels[index];

  /* HERO: a simple swipe up advances */
  if (index === HERO_INDEX) {
    if (dir > 0 && dy > 60) goTo(index + 1);
    return;
  }

  if (Math.abs(dy) < 70) return;

  /* WORK: only a swipe that STARTED at the edge navigates */
  if (index === WORK_INDEX) {
    if ((dir > 0 && touchEligibleDown) || (dir < 0 && touchEligibleUp)) goTo(index + dir);
    else showMeter(0);
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) return;
  const scrollable = panel.scrollHeight - panel.clientHeight > 4;
  if (scrollable) {
    if ((dir > 0 && !touchEligibleDown) || (dir < 0 && !touchEligibleUp)) return;
  }
  if ((dir > 0 && touchEligibleDown) || (dir < 0 && touchEligibleUp)) goTo(index + dir);
}, { passive: true });

/* ================= KEYBOARD & NAV ================= */
document.addEventListener("keydown", (e) => {
  if (!modal.hidden) {
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") trapFocus(e);
    return;
  }
  if (["ArrowDown", "PageDown"].includes(e.key)) { e.preventDefault(); goTo(index + 1); }
  if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(index - 1); }
});

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-goto]");
  if (trigger) {
    e.preventDefault();
    goTo(Number(trigger.dataset.goto));
  }
});

/* ================= FILTERS (same transition language as pages) ================= */
let filtering = false;

function stagger(cards) {
  cards.filter((c) => !c.classList.contains("hide")).forEach((c, i) => c.style.setProperty("--i", i % 7));
}

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (filtering || btn.classList.contains("is-active")) return;
    filtering = true;
    document.querySelectorAll(".filter").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    const f = btn.dataset.filter;
    const cards = Array.from(track.querySelectorAll(".card"));

    if (REDUCED) {
      cards.forEach((c) => c.classList.toggle("hide", f !== "all" && c.dataset.category !== f));
      track.scrollLeft = 0;
      trackTarget = 0;
      filtering = false;
      return;
    }

    stagger(cards);
    track.classList.add("leaving"); // current cards exit right
    setTimeout(() => {
      cards.forEach((c) => c.classList.toggle("hide", f !== "all" && c.dataset.category !== f));
      track.scrollLeft = 0;
      trackTarget = 0;
      stagger(cards);
      track.classList.remove("leaving");
      track.classList.add("pre");
      void track.offsetWidth;
      track.classList.add("entering"); // new cards enter from the left
      track.classList.remove("pre");
      setTimeout(() => {
        track.classList.remove("entering");
        filtering = false;
      }, 950);
    }, 380);
  });
});

/* ================= MODAL (image + video gallery) ================= */
const refs = {
  eyebrow: document.getElementById("modalEyebrow"),
  title: document.getElementById("modalTitle"),
  desc: document.getElementById("modalDesc"),
  gallery: document.querySelector(".gallery"),
  main: document.querySelector(".g-main"),
  thumbs: document.getElementById("galleryThumbs"),
  tools: document.getElementById("modalTools"),
  date: document.getElementById("modalDate"),
  role: document.getElementById("modalRole"),
  link: document.getElementById("modalLink"),
};
let lastFocused = null;
let swapTimer = null;
let currentTitle = "";

function mediaHTML(item, title) {
  return item.t === "vid"
    ? `<video class="g-media" src="${item.src}" controls playsinline preload="metadata"></video>`
    : `<img class="g-media" src="${item.src}" alt="${title} — project image" decoding="async" />`;
}

function setMainMedia(item) {
  clearTimeout(swapTimer);
  const old = refs.main.querySelector("video");
  if (old) old.pause();
  refs.main.classList.add("swapping");
  swapTimer = setTimeout(() => {
    refs.main.innerHTML = mediaHTML(item, currentTitle);
    requestAnimationFrame(() => refs.main.classList.remove("swapping"));
  }, 220);
}

function openModal(p) {
  currentTitle = p.title;
  refs.eyebrow.textContent = `${CATEGORY_LABELS[p.category]} — ${p.eyebrow}`;
  refs.title.textContent = p.title;
  refs.desc.textContent = p.description;
  refs.tools.innerHTML = p.tools.map(toolHTML).join("");
  refs.date.textContent = p.date;
  refs.role.textContent = p.role;
  if (p.link) {
    refs.link.href = p.link;
    refs.link.style.display = "";
  } else {
    refs.link.style.display = "none";
  }

  refs.main.classList.remove("swapping");
  refs.main.innerHTML = mediaHTML(p.media[0], p.title);
  refs.gallery.classList.toggle("single", p.media.length < 2);
  refs.thumbs.innerHTML = p.media
    .map((m, i) => {
      const inner =
        m.t === "vid"
          ? `<video src="${m.src}" muted playsinline preload="metadata"></video><span class="play-badge"><i class="fa-solid fa-play" aria-hidden="true"></i></span>`
          : `<img src="${m.src}" alt="" loading="lazy" decoding="async" />`;
      return `<button class="g-thumb${i === 0 ? " is-active" : ""}" data-i="${i}" role="option" aria-selected="${i === 0}" aria-label="Media ${i + 1} of ${p.media.length}">${inner}</button>`;
    })
    .join("");
  refs.thumbs.dataset.project = p.id;

  lastFocused = document.activeElement;
  modal.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("open")));
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  const playing = refs.main.querySelector("video");
  if (playing) playing.pause();
  modal.classList.remove("open");
  const panel = modal.querySelector(".modal-panel");
  const done = () => {
    modal.hidden = true;
    refs.main.innerHTML = "";
    refs.thumbs.innerHTML = "";
    if (lastFocused) lastFocused.focus();
  };
  if (REDUCED) done();
  else panel.addEventListener("transitionend", done, { once: true });
}

function trapFocus(e) {
  const focusables = modal.querySelectorAll("button, a[href], video");
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

refs.thumbs.addEventListener("click", (e) => {
  const thumb = e.target.closest(".g-thumb");
  if (!thumb) return;
  const p = PROJECTS.find((x) => x.id === refs.thumbs.dataset.project);
  if (!p) return;
  refs.thumbs.querySelectorAll(".g-thumb").forEach((t) => {
    const active = t === thumb;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  setMainMedia(p.media[Number(thumb.dataset.i)]);
});

track.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const project = PROJECTS.find((p) => p.id === card.dataset.id);
  if (project) openModal(project);
});

modal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeModal();
});

/* ================= CONTACT TITLE FONT SWAP (touch/keyboard) ================= */
const swapTitle = document.querySelector(".swap-font");
if (swapTitle) {
  swapTitle.addEventListener("click", () => swapTitle.classList.toggle("flip"));
  swapTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      swapTitle.classList.toggle("flip");
    }
  });
}

/* ================= INTRO (rising curtain) ================= */
const curtain = document.getElementById("curtain");
const introLogo = document.getElementById("introLogo");
const brandImg = document.getElementById("brandImg");

function finishIntro() {
  curtain.classList.add("gone");
  introLogo.classList.add("gone");
  document.body.classList.remove("intro");
  document.body.classList.add("ready");
}

function runIntro() {
  if (REDUCED) {
    panels[0].classList.add("is-active");
    syncChrome(0);
    finishIntro();
    return;
  }

  introLogo.classList.add("pulsing");

  setTimeout(() => {
    introLogo.classList.remove("pulsing");
    curtain.classList.add("up");
  }, 1800);

  setTimeout(() => {
    panels[0].classList.add("is-active");
    syncChrome(0);
  }, 2350);

  setTimeout(() => {
    const from = introLogo.getBoundingClientRect();
    const to = brandImg.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = to.width / from.width;
    introLogo.classList.add("fly");
    introLogo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    introLogo.addEventListener("transitionend", finishIntro, { once: true });
    setTimeout(finishIntro, 1300);
  }, 2550);
}

window.addEventListener("load", () => {
  if (video) video.play().catch(() => {});
  runIntro();
});

/* ================= RESIZE ================= */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    trackTarget = Math.min(trackTarget, trackMax());
  }, 150);
});