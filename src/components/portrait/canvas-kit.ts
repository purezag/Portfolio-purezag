export type Pointer = {
  x: number;
  y: number;
  inside: boolean;
  lastMove: number;
};

export type Fit = { x: number; y: number; w: number; h: number };

export const DPR_CAP = 2;

export function containBottom(width: number, height: number, image: HTMLImageElement, zoom = 1): Fit {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight) * zoom;
  const w = image.naturalWidth * scale;
  const h = image.naturalHeight * scale;
  return { x: (width - w) / 2, y: height - h, w, h };
}

export function coverCenter(width: number, height: number, image: HTMLImageElement): Fit {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const w = image.naturalWidth * scale;
  const h = image.naturalHeight * scale;
  return { x: (width - w) / 2, y: (height - h) / 2, w, h };
}

export function trackPointer(element: HTMLElement, pointer: Pointer) {
  const update = (clientX: number, clientY: number) => {
    const rect = element.getBoundingClientRect();
    const scaleX = element.clientWidth / rect.width;
    const scaleY = element.clientHeight / rect.height;
    pointer.x = (clientX - rect.left) * scaleX;
    pointer.y = (clientY - rect.top) * scaleY;
    pointer.inside =
      pointer.x >= 0 && pointer.y >= 0 && pointer.x <= element.clientWidth && pointer.y <= element.clientHeight;
    pointer.lastMove = performance.now();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") update(event.clientX, event.clientY);
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "touch") pointer.inside = false;
  };
  const onTouch = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (touch) update(touch.clientX, touch.clientY);
  };
  const onTouchEnd = () => {
    pointer.inside = false;
  };

  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerleave", onPointerLeave);
  element.addEventListener("touchstart", onTouch, { passive: true });
  element.addEventListener("touchmove", onTouch, { passive: true });
  element.addEventListener("touchend", onTouchEnd);
  element.addEventListener("touchcancel", onTouchEnd);

  return () => {
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerleave", onPointerLeave);
    element.removeEventListener("touchstart", onTouch);
    element.removeEventListener("touchmove", onTouch);
    element.removeEventListener("touchend", onTouchEnd);
    element.removeEventListener("touchcancel", onTouchEnd);
  };
}

export function readInk(element: HTMLElement) {
  const styles = getComputedStyle(element);
  return {
    fg: styles.getPropertyValue("--fg").trim() || "#1c1d20",
    muted: styles.getPropertyValue("--muted").trim() || "#66686e",
    mono: styles.fontFamily,
    dark: document.documentElement.classList.contains("dark"),
  };
}

export function observeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function observeVisibility(element: HTMLElement, onChange: (visible: boolean) => void) {
  const observer = new IntersectionObserver(([entry]) => onChange(Boolean(entry?.isIntersecting)), {
    rootMargin: "80px",
  });
  observer.observe(element);
  return () => observer.disconnect();
}

export function drawReticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  font: string,
  label: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 5]);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x + 5, y);
  ctx.moveTo(x, y - 5);
  ctx.lineTo(x, y + 5);
  ctx.stroke();
  ctx.font = `500 10px ${font}`;
  ctx.textBaseline = "top";
  ctx.fillText(label, x + radius * 0.72 + 6, y + radius * 0.72 + 4);
  ctx.restore();
}

export const coord = (value: number) => String(Math.max(0, Math.round(value))).padStart(4, "0");
