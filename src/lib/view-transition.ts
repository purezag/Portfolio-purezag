import { flushSync } from "react-dom";

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const DURATION = 950;
const LAYERS = ["site-nav", "site-dock"];

function createRing(radius: number) {
  const ring = document.createElement("div");
  ring.className = "vt-ring";
  ring.style.width = `${radius * 2}px`;
  ring.style.height = `${radius * 2}px`;
  document.body.appendChild(ring);
  return ring;
}

export function circleReveal(update: () => void, { ring = false } = {}) {
  const doc = document as TransitionDocument;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!doc.startViewTransition || reduced) {
    update();
    return;
  }

  const root = document.documentElement;
  const { innerWidth: w, innerHeight: h } = window;
  const radius = Math.hypot(w / 2, h);
  let ringNode: HTMLDivElement | null = null;
  root.dataset.transition = "circle";

  const transition = doc.startViewTransition(() => {
    flushSync(update);
    if (ring) ringNode = createRing(radius);
  });

  transition.ready.then(() => {
    const timing = { duration: DURATION, easing: EASE };
    root.animate(
      { clipPath: [`circle(0px at 50% 100%)`, `circle(${radius}px at 50% 100%)`] },
      { ...timing, pseudoElement: "::view-transition-new(root)" },
    );
    LAYERS.forEach((name) => {
      const node = document.querySelector<HTMLElement>(`[data-vt="${name}"]`);
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const at = `${w / 2 - rect.left}px ${h - rect.top}px`;
      root.animate(
        { clipPath: [`circle(0px at ${at})`, `circle(${radius}px at ${at})`] },
        { ...timing, pseudoElement: `::view-transition-new(${name})` },
      );
    });
    if (ringNode) {
      root.animate(
        { transform: ["scale(0)", "scale(1)"], opacity: [1, 1, 0] },
        { ...timing, pseudoElement: "::view-transition-new(vt-ring)" },
      );
    }
  });

  transition.finished.finally(() => {
    delete root.dataset.transition;
    ringNode?.remove();
  });
}
