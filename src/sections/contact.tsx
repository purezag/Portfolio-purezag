"use client";

import type { ReactNode } from "react";
import { ArrowUp, ArrowUpRight } from "@/components/icons";
import { FadeIn, SectionTag } from "@/components/reveal";
import { useLocalTime } from "@/hooks/use-local-time";
import { email, socials } from "@/lib/projects";
import { useApp } from "@/providers/app-provider";

function RollLine({ front, back, delay }: { front: ReactNode; back: ReactNode; delay: string }) {
  return (
    <span className="relative -mb-[0.2em] -mt-[0.14em] block overflow-hidden">
      <span
        className="block pb-[0.2em] pt-[0.14em] transition-transform duration-700 ease-expo group-hover:-translate-y-full group-focus-visible:-translate-y-full"
        style={{ transitionDelay: delay }}
      >
        {front}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block pb-[0.2em] pt-[0.14em] translate-y-full transition-transform duration-700 ease-expo group-hover:translate-y-0 group-focus-visible:translate-y-0"
        style={{ transitionDelay: delay }}
      >
        {back}
      </span>
    </span>
  );
}

const soft = "text-faint";

export function Contact() {
  const { t, scrollTo } = useApp();
  const time = useLocalTime();
  const [first, word, accent] = t.contact.ctaFront;

  return (
    <div className="relative flex min-h-[100svh] flex-col px-5 pb-24 pt-24 md:px-8 md:pb-24 md:pt-28">
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 [--cell:72px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,black,transparent)]"
      />

      <FadeIn inView className="relative">
        <SectionTag index="04">{t.contact.eyebrow}</SectionTag>
      </FadeIn>

      <FadeIn inView delay={0.08} className="relative mt-10 pb-12 md:mt-14 md:pb-16">
        <a
          href={`mailto:${email}`}
          className="group inline-flex flex-col text-[clamp(3.1rem,13vw,10rem)] font-medium leading-[0.92] tracking-[-0.06em] outline-none"
          aria-label={`${first} ${word} ${accent} — ${email}`}
        >
          <RollLine front={first} back={<span className={soft}>{first}</span>} delay="0ms" />
          <span className="flex items-end gap-[0.18em]">
            <RollLine
              front={
                <>
                  {word} <span className={soft}>{accent}</span>
                </>
              }
              back={
                <>
                  <span className={soft}>{word}</span> {accent}
                </>
              }
              delay="70ms"
            />
            <span className="mb-[0.1em] grid size-[0.62em] shrink-0 place-items-center rounded-full border border-line-strong transition-colors duration-500 group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
              <ArrowUpRight className="size-[0.32em] transition-transform duration-700 ease-expo group-hover:rotate-45" />
            </span>
          </span>
        </a>
      </FadeIn>

      <FadeIn inView delay={0.2} className="relative grid gap-px overflow-hidden rounded-[22px] border border-line bg-line md:grid-cols-2 lg:mt-auto">
        <div className="flex flex-col gap-6 bg-bg p-5 md:p-7">
          <span className="mono-label text-faint">{t.contact.social}</span>
          <ul className="flex flex-col">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between border-b border-line py-3 last:border-0"
                >
                  <span className="text-[15px] font-medium">{social.label}</span>
                  <span className="flex items-center gap-2 font-mono text-[12px] text-muted transition-colors group-hover:text-fg">
                    {social.handle}
                    <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-expo group-hover:rotate-45" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-6 bg-bg p-5 md:p-7">
          <span className="mono-label text-faint">{t.contact.time}</span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[clamp(1.6rem,3vw,2.25rem)] tabular-nums tracking-[-0.04em]">{time}</span>
            <span className="mono-label text-muted">Pelotas, RS · GMT-3</span>
          </div>
          <span className="flex items-center gap-2 text-[13px] text-muted">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-signal [animation:pulse-ring_2s_ease-out_infinite]" />
              <span className="relative size-1.5 rounded-full bg-signal" />
            </span>
            {t.contact.status}
          </span>
        </div>
      </FadeIn>

      <footer className="relative mt-10 flex flex-col gap-4 border-t border-line pt-5 md:flex-row md:items-center md:justify-between">
        <span className="mono-label text-muted normal-case">© 2026 Guilherme Pureza</span>
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="mono-label group flex items-center gap-2 self-start text-muted normal-case transition-colors hover:text-fg md:self-auto"
        >
          {t.contact.top}
          <ArrowUp className="size-3.5 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
        </button>
      </footer>
    </div>
  );
}
