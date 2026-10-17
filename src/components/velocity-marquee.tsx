"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotionPref } from "@/hooks/use-media";

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

export function VelocityMarquee({ children, speed = 2.2 }: { children: ReactNode; speed?: number }) {
  const reduced = useReducedMotionPref();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2500, 2500], [6, -6]);
  const x = useTransform(base, (value) => `${wrap(-50, 0, value)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const extra = boost.get();
    if (extra < 0) direction.current = -1;
    else if (extra > 0) direction.current = 1;
    base.set(base.get() - direction.current * speed * (delta / 1000) * (1 + Math.abs(extra)));
  });

  return (
    <div className="overflow-hidden">
      <motion.div className="flex w-max whitespace-nowrap will-change-transform" style={{ x, skewX: reduced ? 0 : skew }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
