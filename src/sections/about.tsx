"use client";

import type { ReactNode } from "react";
import { PixelPortrait } from "@/components/portrait/portraits";
import { FadeIn, SectionTag } from "@/components/reveal";
import { VelocityMarquee } from "@/components/velocity-marquee";
import { stack } from "@/lib/projects";
import { useApp } from "@/providers/app-provider";

function Corner({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute size-3 border-fg/40 ${className}`} />;
}

export function About() {
  const { t } = useApp();
  const profile = t.about.profile;

  const lines: [string, string][] = [
    ["role", profile.role],
    ["focus", profile.focus],
    ["base", profile.base],
  ];

  return (
    <div className="relative flex min-h-[100svh] flex-col pb-28 pt-24 md:pb-24 md:pt-28">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 px-5 lg:grid-cols-12 lg:gap-8 md:px-8 [&>*]:min-w-0">
        <FadeIn inView className="flex flex-col gap-5 lg:col-span-12">
          <SectionTag index="03">{t.about.eyebrow}</SectionTag>
        </FadeIn>

        <FadeIn inView delay={0.05} className="w-full md:mx-auto md:max-w-[520px] lg:col-span-5 lg:row-span-2 lg:mx-0 lg:max-w-none">
          <figure className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-line bg-surface">
              <div
                aria-hidden="true"
                className="grid-backdrop absolute inset-0 opacity-80 [--cell:32px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
              />
              <div className="absolute inset-0 touch-pan-y">
                <PixelPortrait label="Guilherme Pureza" />
              </div>
              <Corner className="left-3 top-3 border-l border-t" />
              <Corner className="right-3 top-3 border-r border-t" />
              <Corner className="bottom-3 left-3 border-b border-l" />
              <Corner className="bottom-3 right-3 border-b border-r" />
              <span className="mono-label pointer-events-none absolute left-6 top-6 text-muted normal-case">gp_portrait.webp</span>
              <span className="mono-label pointer-events-none absolute right-6 top-6 text-muted">1122×1402</span>
            </div>
            <figcaption className="mono-label mt-3 flex items-center justify-between text-muted normal-case">
              <span className="text-faint">canvas 2d</span>
              <span className="text-faint">web · ios · android</span>
            </figcaption>
          </figure>
        </FadeIn>

        <div className="flex min-w-0 flex-col gap-10 lg:col-span-6 lg:col-start-7">
          <FadeIn inView delay={0.1}>
            <p className="text-[clamp(1.75rem,4.6vw,3.25rem)] font-medium leading-[1.04] tracking-[-0.045em]">
              {t.about.statement}
            </p>
          </FadeIn>
          <FadeIn inView delay={0.15} className="flex max-w-[64ch] flex-col gap-4 text-[15px] leading-relaxed text-muted md:text-base">
            {t.about.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </FadeIn>
          <FadeIn inView delay={0.18} className="flex flex-col gap-4">
            <span className="mono-label text-faint">{t.about.servicesLabel}</span>
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {t.about.services.map((service, index) => (
                <li key={service} className="flex items-center gap-3 bg-bg px-4 py-4 text-[15px] font-medium tracking-[-0.02em]">
                  <span className="mono-label text-faint">0{index + 1}</span>
                  {service}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn inView delay={0.2}>
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="size-2 rounded-full bg-line-strong" />
                <span className="mono-label ml-3 text-faint normal-case">about.ts</span>
              </div>
              <pre className="no-scrollbar overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.75] md:p-5 md:text-[13px]">
                <code>
                  <Line n={1}>
                    <span className="text-muted">export const</span> gui <span className="text-muted">=</span> {"{"}
                  </Line>
                  {lines.map(([key, value], i) => (
                    <Line key={key} n={i + 2}>
                      {"  "}
                      <span className="text-muted">{key}:</span> <span>&quot;{value}&quot;</span>,
                    </Line>
                  ))}
                  <Line n={lines.length + 2}>
                    {"  "}
                    <span className="text-muted">stack:</span> [&quot;React&quot;, &quot;React Native&quot;, &quot;Next.js&quot;, &quot;TypeScript&quot;],
                  </Line>
                  <Line n={lines.length + 3}>
                    {"  "}
                    <span className="text-muted">languages:</span> [
                  </Line>
                  {profile.languages.map((language, i) => (
                    <Line key={language} n={lines.length + 4 + i}>
                      {"    "}&quot;{language}&quot;,
                    </Line>
                  ))}
                  <Line n={lines.length + 4 + profile.languages.length}>{"  ],"}</Line>
                  <Line n={lines.length + 5 + profile.languages.length}>
                    {"  "}
                    <span className="text-muted">available:</span> <span className="text-signal">true</span>,
                  </Line>
                  <Line n={lines.length + 6 + profile.languages.length}>{"};"}</Line>
                </code>
              </pre>
            </div>
          </FadeIn>
        </div>
      </div>

      <FadeIn inView delay={0.1} className="mt-16 border-y border-line py-5 md:mt-20 md:py-6">
        <p className="mono-label mb-4 px-5 text-faint md:px-8">{t.about.stack}</p>
        <VelocityMarquee>
          {stack.map((item) => (
            <span
              key={item}
              className="flex items-center text-[clamp(1.75rem,5vw,3.5rem)] font-medium tracking-[-0.045em]"
            >
              <span className="px-5 md:px-8">{item}</span>
              <span className="font-mono text-[0.5em] text-faint">/</span>
            </span>
          ))}
        </VelocityMarquee>
      </FadeIn>
    </div>
  );
}

function Line({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className="block">
      <span className="mr-4 inline-block w-4 select-none text-right text-faint">{n}</span>
      {children}
    </span>
  );
}
