"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  createContext,
  createRef,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useReducedMotionPref } from "@/hooks/use-media";
import { cn } from "@/lib/cn";

type PanelSpec = {
  id: string;
  label: string;
  tone?: "invert";
  node: ReactNode;
};

const CoverContext = createContext<MotionValue<number> | null>(null);

export function usePanelCover() {
  return useContext(CoverContext);
}

export function Deck({ panels }: { panels: PanelSpec[] }) {
  const refs = useMemo(() => panels.map(() => createRef<HTMLDivElement>()), [panels.length]);

  return (
    <main className="relative">
      {panels.map((panel, index) => (
        <Panel
          key={panel.id}
          spec={panel}
          index={index}
          self={refs[index]!}
          cover={refs[index + 1] ?? null}
        />
      ))}
    </main>
  );
}

function Panel({
  spec,
  index,
  self,
  cover,
}: {
  spec: PanelSpec;
  index: number;
  self: RefObject<HTMLDivElement | null>;
  cover: RefObject<HTMLDivElement | null> | null;
}) {
  const reduced = useReducedMotionPref();
  const [height, setHeight] = useState(0);
  const idle = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: cover ?? self,
    offset: ["start end", "start start"],
  });
  const progress = cover ? scrollYProgress : idle;
  const still = reduced || !cover;

  const scale = useTransform(progress, [0, 1], still ? [1, 1] : [1, 0.9]);
  const shade = useTransform(progress, [0, 1], still ? [0, 0] : [0, 0.62]);
  const lift = useTransform(progress, [0, 1], still ? [0, 0] : [0, -36]);

  useLayoutEffect(() => {
    const node = self.current;
    if (!node) return;
    const measure = () => setHeight(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [self]);

  return (
    <>
      <div data-anchor={spec.id} data-label={spec.label} aria-hidden="true" />
      <section
        id={spec.id}
        ref={self}
        aria-label={spec.label}
        data-tone={spec.tone}
        className="sticky min-h-[100svh]"
        style={{ top: `min(0px, calc(100svh - ${height}px))`, zIndex: index + 1 }}
      >
        <motion.div
          className={cn(
            "relative min-h-[100svh] overflow-hidden bg-bg text-fg [backface-visibility:hidden] will-change-transform",
            cover && "rounded-b-[28px] md:rounded-b-[36px]",
            (index > 0 || (cover && !still)) && "rounded-t-[28px] md:rounded-t-[36px]",
            index > 0 && "shadow-[0_-24px_60px_-28px_rgb(var(--shade)/0.4)]",
          )}
          style={{
            scale,
            y: lift,
            transformOrigin: "50% calc(100% - 50svh)",
          }}
        >
          <CoverContext.Provider value={progress}>{spec.node}</CoverContext.Provider>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 bg-[rgb(var(--shade))] will-change-[opacity]"
            style={{ opacity: shade }}
          />
        </motion.div>
      </section>
    </>
  );
}
