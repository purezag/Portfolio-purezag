gsap.registerPlugin(ScrollTrigger);

// --------- 0. SMOOTH SCROLL (LENIS) & NAV SCROLL ---------
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false, // Deixa a rolagem do celular 100% nativa e solta
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 500); });
gsap.ticker.lagSmoothing(0);

// Navegação Macia - Como o scroll está solto, a matemática não falha
document.querySelectorAll('.bottom-nav a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#hero') {
      lenis.scrollTo(0, { duration: 1.5 }); 
    } else {
      lenis.scrollTo(targetId, { duration: 1.5 });
    }
  });
});

// --------- 1. CURSOR HYBRID ---------
const blobs = document.querySelectorAll(".cursor-blob");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let isIdle = false;
let idleTimer = null;
const positions = [];
const wanderTargets = [];
const speeds = [0.15, 0.2, 0.3];

blobs.forEach(() => {
  positions.push({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  wanderTargets.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
});

function resetIdleTimer() {
  isIdle = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { isIdle = true; updateWanderTargets(); }, 2000);
}
function onInputMove(x, y) { mouseX = x; mouseY = y; resetIdleTimer(); }

window.addEventListener("mousemove", (e) => onInputMove(e.clientX, e.clientY));
window.addEventListener("touchstart", (e) => onInputMove(e.touches[0].clientX, e.touches[0].clientY));
window.addEventListener("touchmove", (e) => onInputMove(e.touches[0].clientX, e.touches[0].clientY));
window.addEventListener("scroll", resetIdleTimer);
resetIdleTimer();

function updateWanderTargets() {
  blobs.forEach((_, i) => {
    const dx = wanderTargets[i].x - positions[i].x;
    const dy = wanderTargets[i].y - positions[i].y;
    if (Math.sqrt(dx * dx + dy * dy) < 100 || !isIdle) {
      const marginX = window.innerWidth * 0.1;
      const marginY = window.innerHeight * 0.1;
      wanderTargets[i].x = marginX + Math.random() * (window.innerWidth - marginX * 2);
      wanderTargets[i].y = marginY + Math.random() * (window.innerHeight - marginY * 2);
    }
  });
}

gsap.ticker.add(() => {
  if (isIdle) updateWanderTargets();
  blobs.forEach((blob, i) => {
    let targetX, targetY, speedFactor;
    if (isIdle) {
      targetX = wanderTargets[i].x; targetY = wanderTargets[i].y;
      speedFactor = 0.005 + i * 0.002;
    } else {
      if (i === 0) { targetX = mouseX; targetY = mouseY; } 
      else { targetX = positions[i - 1].x; targetY = positions[i - 1].y; }
      const dt = 1.0 - Math.pow(1.0 - speeds[i], gsap.ticker.deltaRatio());
      speedFactor = i === 0 ? 0.25 : 0.15;
    }
    positions[i].x += (targetX - positions[i].x) * speedFactor;
    positions[i].y += (targetY - positions[i].y) * speedFactor;
    gsap.set(blob, { x: positions[i].x, y: positions[i].y });
  });
});

const links = document.querySelectorAll("a, button, .float-img, .work-item");
links.forEach((link) => {
  link.addEventListener("mouseenter", () => gsap.to(blobs, { opacity: 0, ease: "back.out(1.7)" }));
  link.addEventListener("mouseleave", () => gsap.to(blobs, { opacity: 1 }));
});

// --------- 2. ABOUT SECTION: FLOATING GALLERY ---------
const floatImages = document.querySelectorAll(".float-img");
floatImages.forEach((img) => {
  let isExpanded = false;
  const openImg = () => { isExpanded = true; gsap.to(img, { scale: 1.2, height: 250, zIndex: 50, opacity: 1, filter: "grayscale(0%)", duration: 0.6, ease: "power3.out" }); };
  const closeImg = () => { isExpanded = false; gsap.to(img, { scale: 1, height: 50, zIndex: 1, opacity: 0.5, filter: "grayscale(100%)", duration: 0.6, ease: "power3.out" }); };

  img.addEventListener("mouseenter", () => { if (!window.matchMedia("(pointer: coarse)").matches) openImg(); });
  img.addEventListener("mouseleave", () => { if (!window.matchMedia("(pointer: coarse)").matches) closeImg(); });
  img.addEventListener("click", (e) => {
    e.stopPropagation();
    if (window.matchMedia("(pointer: coarse)").matches) { isExpanded ? closeImg() : openImg(); }
  });
});

document.addEventListener("click", () => {
  if (window.matchMedia("(pointer: coarse)").matches) {
    floatImages.forEach((img) => gsap.to(img, { scale: 1, height: 50, zIndex: 1, opacity: 0.5, filter: "grayscale(100%)", duration: 0.6, ease: "power3.out" }));
  }
});

// --------- 3. WORKSTATION SECTION: TILT 3D ---------
const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
  const thumb = card.querySelector(".work-thumb");
  const info = card.querySelector(".work-info");
  if (!thumb || !info) return;

  gsap.set([thumb, info], { transformPerspective: 1000 });
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const centerX = rect.width / 2; const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -2; const rotateY = ((x - centerX) / centerX) * 2;

    gsap.to(thumb, { rotateX: rotateX, rotateY: rotateY, z: 5, scale: 1.02, boxShadow: `${-rotateY}px ${rotateX + 15}px 20px rgba(0,0,0,0.2)`, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    gsap.to(info, { rotateX: rotateX, rotateY: rotateY, z: 10, scale: 1.02, duration: 0.4, ease: "power2.out", overwrite: "auto" });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(thumb, { rotateX: 0, rotateY: 0, z: 0, scale: 1, boxShadow: "0 5px 15px rgba(0,0,0,0.3)", duration: 1.5, ease: "power3.out" });
    gsap.to(info, { rotateX: 0, rotateY: 0, z: 0, scale: 1, duration: 0.8, ease: "power3.out" });
  });
});

// --------- 4. STACKING CARDS (CSS PURO + BLUR) ---------
const sections = gsap.utils.toArray("section");

sections.forEach((section, i) => {
  // Garante que a próxima seção passe por cima
  section.style.zIndex = i;

  const nextSection = sections[i + 1];
  if (nextSection) {
    // Apenas escurece e borra a seção que está congelada atrás
    gsap.fromTo(section, 
      { filter: "brightness(1) blur(0px)" },
      { filter: "brightness(0.3) blur(5px)", ease: "none",
        scrollTrigger: { 
          trigger: nextSection, 
          start: "top bottom", 
          end: "top top", 
          scrub: true 
        }
      });
  }
});

// --------- 5. PRELOADER & INIT ---------
document.body.classList.add('loading-active');

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  
  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    document.body.classList.remove('loading-active'); 
    
    ScrollTrigger.refresh(); 
    
    const video = document.getElementById("bgVideo");
    if (video) video.play().catch((e) => console.log("Autoplay bloqueado:", e));
  }, 500);
});