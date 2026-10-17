"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const EXPO = [0.16, 1, 0.3, 1] as const;

export function MaskLine({
  children,
  show,
  delay = 0,
  className,
}: {
  children: ReactNode;
  show: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("block overflow-hidden pb-[0.08em] -mb-[0.08em]", className)}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        animate={{ y: show ? "0%" : "110%" }}
        transition={{ duration: 1.1, ease: EXPO, delay: show ? delay : 0 }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function FadeIn({
  children,
  show = true,
  delay = 0,
  className,
  inView = false,
}: {
  children: ReactNode;
  show?: boolean;
  delay?: number;
  className?: string;
  inView?: boolean;
}) {
  const visible = { opacity: 1, y: 0, filter: "blur(0px)" };
  const hidden = { opacity: 0, y: 18, filter: "blur(6px)" };
  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(inView
        ? { whileInView: visible, viewport: { once: true, margin: "-10% 0px" } }
        : { animate: show ? visible : hidden })}
      transition={{ duration: 0.9, ease: EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTag({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="mono-label flex items-center gap-2 text-muted">
      <span className="text-faint">[{index}]</span>
      <span>{children}</span>
      <span className="h-px w-8 bg-line-strong" />
    </p>
  );
}
