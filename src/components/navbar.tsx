"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { ArrowUpRight } from "@/components/icons";
import { useLocalTime } from "@/hooks/use-local-time";
import { cn } from "@/lib/cn";
import { email, socials } from "@/lib/projects";
import { useApp } from "@/providers/app-provider";

const EXPO = [0.16, 1, 0.3, 1] as const;

export const SECTIONS = ["home", "work", "about", "contact"] as const;
export type SectionId = (typeof SECTIONS)[number];

export function Navbar() {
  const { t, ready, landed, scrollTo, lockScroll } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [inverted, setInverted] = useState(false);
  const { scrollY } = useScroll();
  const time = useLocalTime();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 12);
    const contact = document.querySelector<HTMLElement>('[data-anchor="contact"]');
    setInverted(Boolean(contact && contact.getBoundingClientRect().top <= 28));
  });

  useEffect(() => {
    if (!ready) return;
    lockScroll(open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, ready, lockScroll]);

  const go = (id: SectionId) => {
    setOpen(false);
    lockScroll(false);
    window.setTimeout(() => (id === "home" ? scrollTo(0) : scrollTo(id)), 60);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-[rgb(var(--shade)/0.28)] backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <header data-vt="site-nav" className="fixed inset-x-0 top-0 z-50 [view-transition-name:site-nav]" data-tone={inverted && !open ? "invert" : undefined}>
        <motion.nav
          aria-label="Principal"
          className={cn(
            "relative overflow-hidden border-b bg-bg/75 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500",
            scrolled || open ? "border-line" : "border-transparent",
          )}
          initial={false}
          animate={{ height: open ? "auto" : 56 }}
          transition={{ duration: 0.7, ease: EXPO }}
        >
          <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-5 md:px-8">
            <button
              type="button"
              onClick={() => go("home")}
              className="-m-2 flex items-center gap-3 p-2"
              aria-label="Guilherme Pureza"
            >
              <span
                data-nav-logo
                className="block size-[26px] text-fg"
                style={{ opacity: landed ? 1 : 0 }}
              >
                <Logo className="size-full" />
              </span>
              <span className="mono-label text-muted normal-case">purezag.dev</span>
            </button>

            <div className="mono-label absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 text-muted normal-case md:flex">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 rounded-full bg-signal [animation:pulse-ring_2s_ease-out_infinite]" />
                <span className="relative size-1.5 rounded-full bg-signal" />
              </span>
              {t.nav.status}
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t.nav.close : t.nav.open}
              className="-mr-2 flex h-10 items-center gap-3 rounded-full px-2"
            >
              <span aria-hidden="true" className="mono-label relative hidden h-[1.2em] w-14 overflow-hidden text-right text-muted normal-case md:block">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 leading-[1.2em] transition-[transform,opacity] duration-500 ease-expo",
                    open ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100",
                  )}
                >
                  {t.nav.menuLabel}
                </span>
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 leading-[1.2em] transition-[transform,opacity] duration-500 ease-expo",
                    open ? "translate-y-0 opacity-100 delay-75" : "translate-y-full opacity-0",
                  )}
                >
                  {t.nav.closeLabel}
                </span>
              </span>
              <span className="relative block h-3 w-[22px]">
                <span
                  className={cn(
                    "absolute left-0 top-0.5 h-[1.5px] w-full rounded-full bg-fg transition-transform duration-500 ease-expo",
                    open && "translate-y-[3.25px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0.5 left-0 h-[1.5px] w-full rounded-full bg-fg transition-transform duration-500 ease-expo",
                    open && "-translate-y-[3.25px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>

          <div
            id="site-menu"
            data-lenis-prevent
            className="mx-auto grid max-h-[calc(100svh-56px)] min-h-[calc(100svh-56px)] max-w-[1440px] grid-rows-[1fr_auto] gap-10 overflow-y-auto px-5 pb-8 pt-6 md:min-h-0 md:grid-cols-12 md:grid-rows-1 md:px-8 md:pb-12 md:pt-10"
            inert={!open}
          >
            <ul className="flex flex-col justify-center md:col-span-7 md:justify-start">
              {SECTIONS.map((id, index) => (
                <motion.li
                  key={id}
                  initial={false}
                  animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{ duration: 0.6, ease: EXPO, delay: open ? 0.12 + index * 0.05 : 0 }}
                >
                  <button
                    type="button"
                    onClick={() => go(id)}
                    className="group flex w-full items-baseline gap-4 border-b border-line py-3 text-left md:py-2"
                  >
                    <span className="mono-label w-6 text-faint">0{index + 1}</span>
                    <span className="text-[clamp(2.4rem,9vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.045em] transition-transform duration-500 ease-expo group-hover:translate-x-2">
                      {t.nav[id]}
                    </span>
                    <ArrowUpRight className="ml-auto size-5 -translate-x-2 self-center text-muted opacity-0 transition-all duration-500 ease-expo group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="grid grid-cols-2 gap-6 self-end md:col-span-4 md:col-start-9 md:grid-cols-1 md:self-start"
              initial={false}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, ease: EXPO, delay: open ? 0.32 : 0 }}
            >
              <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
                <span className="mono-label text-faint">{t.nav.reach}</span>
                <a href={`mailto:${email}`} className="text-[15px] underline-offset-4 hover:underline">
                  {email}
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="mono-label text-faint">{t.nav.social}</span>
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-muted transition-colors hover:text-fg"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <span className="mono-label text-faint">{t.nav.localTime}</span>
                <span className="font-mono text-[15px] tabular-nums">{time}</span>
                <span className="mono-label text-muted">GMT-3</span>
              </div>
            </motion.div>
          </div>
        </motion.nav>
      </header>
    </>
  );
}
