"use strict";

/* ================= PROJECT DATA ================= */
const CATEGORY_LABELS = { web: "Web & Interface", visual: "Motion & Visual" };

const PROJECTS = [
  {
    id: "laboratorio-criativo",
    category: "web",
    eyebrow: "E-commerce · UX/UI & Code",
    title: "Laboratório Criativo",
    description:
      "Full e-commerce experience designed and built end to end — from brand-aligned interface design in Photoshop to a responsive, performance-focused front-end running on WordPress. Clear product hierarchy, fast navigation and a frictionless checkout flow.",
    images: ["./assets/creative-art-8.webp"],
    tools: ["devicon-photoshop-plain", "devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain", "devicon-wordpress-plain"],
    date: "2025",
    role: "Design & Development",
    link: "https://www.laboratoriocriativo.com",
  },
  {
    id: "colonial",
    category: "visual",
    eyebrow: "Social Media Design",
    title: "Colonial",
    description:
      "Ongoing visual production for social media: campaign artwork, product highlights and AI-assisted digital manipulation. A consistent visual system built to keep the feed cohesive while every piece stays individually striking.",
    images: ["./assets/creative-art-1.webp", "./assets/creative-art-2.webp", "./assets/creative-art-3.webp", "./assets/creative-art-7.webp"],
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: "Art Direction & Design",
    link: "https://www.behance.net/gallery/245339401/AI-Art-Digital-Manipulation",
  },
  {
    id: "mister-burguer",
    category: "visual",
    eyebrow: "Concept Artwork",
    title: "Mister Burguer",
    description:
      "Personal concept artwork exploring appetite-driven composition, dramatic lighting and bold typography for a fictional burger brand — a study in making food photography feel cinematic.",
    images: ["./assets/creative-art-5.webp"],
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: "Concept & Design",
    link: "https://www.behance.net/gallery/242726891/Mister-Burguer-Concept-Artwork",
  },
  {
    id: "smart-fit",
    category: "visual",
    eyebrow: "Concept Study",
    title: "Smart Fit",
    description:
      "Unofficial concept study reimagining fitness-brand communication: high-energy composition, strong contrast and motion-inspired treatment applied to static social pieces.",
    images: ["./assets/creative-art-4.webp"],
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: "Concept & Design",
    link: "https://www.behance.net/gallery/242391919/Personal-Concept-Study",
  },
  {
    id: "food-and-drinks",
    category: "visual",
    eyebrow: "Concept Study",
    title: "Food & Drinks",
    description:
      "A visual exploration of food and beverage art direction — texture, color grading and layout studies designed to translate flavor into imagery.",
    images: ["./assets/creative-art-6.webp"],
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: "Concept & Design",
    link: "https://www.behance.net/gallery/242391919/Personal-Concept-Study",
  },
];

/* ================= DOM ================= */
const panels = Array.from(document.querySelectorAll(".panel"));
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
const track = document.getElementById("workTrack");
const modal = document.getElementById("caseModal");
const video = document.getElementById("bgVideo");
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const WORK_INDEX = panels.findIndex((p) => p.id === "work");
const CONTACT_INDEX = panels.findIndex((p) => p.id === "contact");

/* ================= RENDER CARDS ================= */
track.innerHTML = PROJECTS.map(
  (p) => `
  <button class="card" data-category="${p.category}" data-id="${p.id}" aria-haspopup="dialog" aria-label="Open case study: ${p.title}">
    <span class="card-thumb"><img src="${p.images[0]}" alt="${p.title} — project preview" loading="lazy" decoding="async" width="370" height="278" /></span>
    <span class="card-body">
      <span class="card-eyebrow">${p.eyebrow}</span>
      <span class="card-title">${p.title}</span>
      <span class="card-tools">${p.tools.map((t) => `<i class="${t}" aria-hidden="true"></i>`).join("")}</span>
      <span class="card-cta">View case <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
    </span>
  </button>`
).join("");

/* ================= PANEL CONTROLLER (element swap) ================= */
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
    if (i === 0) video.play().catch(() => {});
    else video.pause();
  }
}

function goTo(i) {
  i = Math.max(0, Math.min(panels.length - 1, i));
  if (i === index || animating) return;

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

/* ================= WORK TRACK (horizontal, rAF lerp) ================= */
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

/* ================= INPUT: WHEEL ================= */
let edgeAccum = 0;
let edgeTimer = null;
const cooling = () => animating || performance.now() - lastNavTime < 450;

window.addEventListener(
  "wheel",
  (e) => {
    if (!modal.hidden) return;
    if (animating) { e.preventDefault(); return; }
    const dir = e.deltaY > 0 ? 1 : -1;
    const panel = panels[index];

    if (index === WORK_INDEX) {
      e.preventDefault();
      const atEnd = trackTarget >= trackMax() - 1;
      const atStart = trackTarget <= 1;
      if ((dir > 0 && !atEnd) || (dir < 0 && !atStart)) {
        edgeAccum = 0;
        nudgeTrack(e.deltaY * 1.6);
        return;
      }
      if (cooling()) return;
      edgeAccum += Math.abs(e.deltaY);
      clearTimeout(edgeTimer);
      edgeTimer = setTimeout(() => (edgeAccum = 0), 300);
      if (edgeAccum > 140) {
        edgeAccum = 0;
        goTo(index + dir);
      }
      return;
    }

    const scrollable = panel.scrollHeight - panel.clientHeight > 4;
    if (scrollable) {
      const atTop = panel.scrollTop <= 1;
      const atBottom = panel.scrollTop >= panel.scrollHeight - panel.clientHeight - 1;
      if ((dir > 0 && !atBottom) || (dir < 0 && !atTop)) return;
    }
    e.preventDefault();
    if (cooling() || Math.abs(e.deltaY) < 12) return;
    goTo(index + dir);
  },
  { passive: false }
);

/* ================= INPUT: TOUCH ================= */
/* On mobile the user always drags vertically; inside Work that vertical
   gesture is converted into horizontal movement of the cases. */
let startY = 0;
let startX = 0;
let lastY = 0;
let lastX = 0;

window.addEventListener("touchstart", (e) => {
  startY = lastY = e.touches[0].clientY;
  startX = lastX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener("touchmove", (e) => {
  if (!modal.hidden) return;
  if (index !== WORK_INDEX) return;
  e.preventDefault(); // we drive the track ourselves
  const t = e.touches[0];
  const dy = lastY - t.clientY;
  const dx = lastX - t.clientX;
  lastY = t.clientY;
  lastX = t.clientX;
  nudgeTrack((dy + dx) * 2.1); // vertical drag (and any horizontal) moves the cases sideways
}, { passive: false });

window.addEventListener("touchend", (e) => {
  if (!modal.hidden || animating || cooling()) return;
  const dy = startY - e.changedTouches[0].clientY;
  const dx = startX - e.changedTouches[0].clientX;
  const dir = dy > 0 ? 1 : -1;
  const panel = panels[index];

  if (index === WORK_INDEX) {
    if (Math.abs(dy) < 60) return;
    const atEnd = trackTarget >= trackMax() - 2;
    const atStart = trackTarget <= 2;
    if ((dir > 0 && atEnd) || (dir < 0 && atStart)) goTo(index + dir);
    return;
  }

  if (Math.abs(dy) < 60 || Math.abs(dx) > Math.abs(dy)) return;
  const scrollable = panel.scrollHeight - panel.clientHeight > 4;
  if (scrollable) {
    const atTop = panel.scrollTop <= 1;
    const atBottom = panel.scrollTop >= panel.scrollHeight - panel.clientHeight - 2;
    if ((dir > 0 && !atBottom) || (dir < 0 && !atTop)) return;
  }
  goTo(index + dir);
}, { passive: true });

/* ================= INPUT: KEYBOARD & NAV ================= */
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

/* ================= FILTERS ================= */
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    const f = btn.dataset.filter;
    track.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("hide", f !== "all" && card.dataset.category !== f);
    });
    track.scrollLeft = 0;
    trackTarget = 0;
  });
});

/* ================= MODAL (gallery) ================= */
const refs = {
  eyebrow: document.getElementById("modalEyebrow"),
  title: document.getElementById("modalTitle"),
  desc: document.getElementById("modalDesc"),
  gallery: document.querySelector(".gallery"),
  main: document.getElementById("galleryMain"),
  thumbs: document.getElementById("galleryThumbs"),
  tools: document.getElementById("modalTools"),
  date: document.getElementById("modalDate"),
  role: document.getElementById("modalRole"),
  link: document.getElementById("modalLink"),
};
let lastFocused = null;
let swapTimer = null;

function setMainImage(src, alt) {
  if (refs.main.src.endsWith(src.replace("./", "/"))) return;
  clearTimeout(swapTimer);
  refs.main.classList.add("swapping");
  swapTimer = setTimeout(() => {
    refs.main.src = src;
    refs.main.alt = alt;
    if (refs.main.complete) refs.main.classList.remove("swapping");
    else refs.main.onload = () => refs.main.classList.remove("swapping");
  }, 220);
}

function openModal(p) {
  refs.eyebrow.textContent = `${CATEGORY_LABELS[p.category]} — ${p.eyebrow}`;
  refs.title.textContent = p.title;
  refs.desc.textContent = p.description;
  refs.tools.innerHTML = p.tools.map((t) => `<i class="${t}" aria-hidden="true"></i>`).join("");
  refs.date.textContent = p.date;
  refs.role.textContent = p.role;
  refs.link.href = p.link;

  refs.main.classList.remove("swapping");
  refs.main.src = p.images[0];
  refs.main.alt = `${p.title} — project image`;
  refs.gallery.classList.toggle("single", p.images.length < 2);
  refs.thumbs.innerHTML = p.images
    .map(
      (src, i) => `
      <button class="g-thumb${i === 0 ? " is-active" : ""}" data-src="${src}" role="option" aria-selected="${i === 0}" aria-label="Image ${i + 1} of ${p.images.length}">
        <img src="${src}" alt="" loading="lazy" decoding="async" />
      </button>`
    )
    .join("");

  lastFocused = document.activeElement;
  modal.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("open")));
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.classList.remove("open");
  const panel = modal.querySelector(".modal-panel");
  const done = () => {
    modal.hidden = true;
    if (lastFocused) lastFocused.focus();
  };
  if (REDUCED) done();
  else panel.addEventListener("transitionend", done, { once: true });
}

function trapFocus(e) {
  const focusables = modal.querySelectorAll("button, a[href]");
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

refs.thumbs.addEventListener("click", (e) => {
  const thumb = e.target.closest(".g-thumb");
  if (!thumb) return;
  refs.thumbs.querySelectorAll(".g-thumb").forEach((t) => {
    const active = t === thumb;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  setMainImage(thumb.dataset.src, refs.main.alt);
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
    curtain.classList.add("up"); // curtain rises, bottom radius grows toward the logo
  }, 1800);

  setTimeout(() => {
    panels[0].classList.add("is-active"); // hero revealed underneath
    syncChrome(0);
  }, 2350);

  setTimeout(() => {
    // the curtain's bottom edge reaches the logo — they rise together
    const from = introLogo.getBoundingClientRect();
    const to = brandImg.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = to.width / from.width;
    introLogo.classList.add("fly");
    introLogo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    introLogo.addEventListener("transitionend", finishIntro, { once: true });
    setTimeout(finishIntro, 1300); // safety fallback
  }, 2550);
}

window.addEventListener("load", () => {
  if (video) video.play().catch(() => {});
  runIntro();
});

/* ================= RESIZE (debounced) ================= */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    trackTarget = Math.min(trackTarget, trackMax());
  }, 150);
});