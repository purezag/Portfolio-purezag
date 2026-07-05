/* ================= PROJECT DATA ================= */
const CATEGORY_LABELS = {
  web: "Web & Interface",
  visual: "Motion & Visual",
};

const PROJECTS = [
  {
    id: "laboratorio-criativo",
    category: "web",
    eyebrow: "E-commerce · UX/UI & Code",
    title: "Laboratório Criativo",
    description:
      "Full e-commerce experience designed and built end to end — from brand-aligned interface design in Photoshop to a responsive, performance-focused front-end running on WordPress. Clear product hierarchy, fast navigation and a checkout flow with zero friction.",
    images: ["./assets/creative-art-8.webp"],
    tools: [
      "devicon-photoshop-plain",
      "devicon-html5-plain",
      "devicon-css3-plain",
      "devicon-javascript-plain",
      "devicon-wordpress-plain",
    ],
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
    images: [
      "./assets/creative-art-1.webp",
      "./assets/creative-art-2.webp",
      "./assets/creative-art-3.webp",
      "./assets/creative-art-7.webp",
    ],
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

/* ================= RENDER CARDS ================= */
const grid = document.getElementById("workGrid");

function renderCards() {
  grid.innerHTML = PROJECTS.map(
    (p, i) => `
    <button class="card reveal" style="--d:${(i % 3) * 0.08}s" data-category="${p.category}" data-id="${p.id}" aria-haspopup="dialog" aria-label="Open case study: ${p.title}">
      <span class="card-thumb"><img src="${p.images[0]}" alt="${p.title} — project preview" loading="lazy" /></span>
      <span class="card-body">
        <span class="card-eyebrow">${p.eyebrow}</span>
        <span class="card-title">${p.title}</span>
        <span class="card-tools">${p.tools.map((t) => `<i class="${t}" aria-hidden="true"></i>`).join("")}</span>
        <span class="card-cta">View case <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
      </span>
    </button>`
  ).join("");
}
renderCards();

/* ================= FILTERS ================= */
const filterBtns = document.querySelectorAll(".filter");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    const f = btn.dataset.filter;
    grid.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("hide", f !== "all" && card.dataset.category !== f);
    });
  });
});

/* ================= SCROLL REVEAL (replays on re-entry) ================= */
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("in", entry.isIntersecting);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

function observeReveals() {
  document.querySelectorAll(".reveal").forEach((el) => {
    if (prefersReduced) el.classList.add("in");
    else revealObserver.observe(el);
  });
}
observeReveals();

/* ================= NAV ACTIVE STATE ================= */
const navLinks = document.querySelectorAll("[data-nav]");
const sections = document.querySelectorAll("main section");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach((a) => {
        const active = a.getAttribute("href") === id;
        a.classList.toggle("is-active", active);
        if (active) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  },
  { threshold: 0.45 }
);
sections.forEach((s) => navObserver.observe(s));

/* ================= CASE MODAL ================= */
const modal = document.getElementById("caseModal");
const modalTitle = document.getElementById("modalTitle");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalDesc = document.getElementById("modalDesc");
const modalGallery = document.getElementById("modalGallery");
const modalTools = document.getElementById("modalTools");
const modalDate = document.getElementById("modalDate");
const modalRole = document.getElementById("modalRole");
const modalLink = document.getElementById("modalLink");

let lastFocused = null;

function openModal(project) {
  modalEyebrow.textContent = `${CATEGORY_LABELS[project.category]} — ${project.eyebrow}`;
  modalTitle.textContent = project.title;
  modalDesc.textContent = project.description;
  modalGallery.innerHTML = project.images
    .map((src) => `<img src="${src}" alt="${project.title} — project image" loading="lazy" />`)
    .join("");
  modalTools.innerHTML = project.tools
    .map((t) => `<i class="${t}" aria-hidden="true"></i>`)
    .join("");
  modalDate.textContent = project.date;
  modalRole.textContent = project.role;
  modalLink.href = project.link;

  lastFocused = document.activeElement;
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add("open"));
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.classList.remove("open");
  document.body.classList.remove("modal-open");
  setTimeout(() => {
    modal.hidden = true;
    if (lastFocused) lastFocused.focus();
  }, prefersReduced ? 0 : 350);
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const project = PROJECTS.find((p) => p.id === card.dataset.id);
  if (project) openModal(project);
});

modal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (modal.hidden) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "Tab") {
    const focusables = modal.querySelectorAll("button, a[href]");
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

/* ================= PRELOADER ================= */
document.body.classList.add("loading");

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("done");
    document.body.classList.remove("loading");
    const video = document.getElementById("bgVideo");
    if (video) video.play().catch(() => {});
  }, 400);
});