import { flushSync } from "react-dom";

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export function circleReveal(update: () => void) {
  const doc = document as TransitionDocument;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!doc.startViewTransition || reduced) {
    update();
    return;
  }

  const root = document.documentElement;
  root.dataset.transition = "circle";

  const transition = doc.startViewTransition(() => flushSync(update));

  transition.ready.then(() => {
    const { innerWidth: w, innerHeight: h } = window;
    const radius = Math.hypot(w / 2, h);
    root.animate(
      { clipPath: [`circle(0px at 50% 100%)`, `circle(${radius}px at 50% 100%)`] },
      { duration: 950, easing: EASE, pseudoElement: "::view-transition-new(root)" },
    );
  });

  transition.finished.finally(() => {
    delete root.dataset.transition;
  });
}
