"use client";

import { Deck } from "@/components/deck";
import { useApp } from "@/providers/app-provider";
import { About } from "@/sections/about";
import { Contact } from "@/sections/contact";
import { Hero } from "@/sections/hero";
import { Work } from "@/sections/work";

export default function Home() {
  const { t } = useApp();

  return (
    <Deck
      panels={[
        { id: "home", label: t.nav.home, node: <Hero /> },
        { id: "work", label: t.nav.work, node: <Work /> },
        { id: "about", label: t.nav.about, node: <About /> },
        { id: "contact", label: t.nav.contact, tone: "invert", node: <Contact /> },
      ]}
    />
  );
}
