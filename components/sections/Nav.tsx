"use client";

import { useEffect, useState } from "react";
import { LangToggle } from "@/components/ui/lang-toggle";
import { useI18n } from "@/components/ui/language-provider";
import type { MessageKey } from "@/lib/i18n";
import { site } from "@/lib/site";

const LINKS: { href: string; key: MessageKey }[] = [
  { href: "#product", key: "nav.markets" },
  { href: "#latam", key: "nav.latam" },
  { href: "#raise", key: "nav.raise" },
  { href: "#token", key: "nav.token" },
  { href: "#faq", key: "nav.faq" },
];

export function Nav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = LINKS.map((link) => {
      const id = link.href.slice(1);
      const el = document.getElementById(id);
      return el ? { id, el } : null;
    }).filter((section): section is { id: string; el: HTMLElement } => section !== null);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let bestId: string | null = null;
        let bestRatio = 0;
        sections.forEach((section) => {
          const ratio = visible.get(section.id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = section.id;
          }
        });
        if (bestId) setActive(bestId);
      },
      {
        root: null,
        rootMargin: "-28% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section.el));

    if (window.location.hash) {
      const hashId = window.location.hash.slice(1);
      if (sections.some((section) => section.id === hashId)) setActive(hashId);
    }

    return () => observer.disconnect();
  }, []);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {t("a11y.skip")}
      </a>
      <header className="nav" id="top">
        <div className="container nav__inner">
          <a className="nav__brand" href="#top" aria-label="Merlat home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={32} height={32} />
            <span>Merlat</span>
          </a>
          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((link) => {
              const on = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={on ? "is-active" : undefined}
                  aria-current={on ? "true" : undefined}
                >
                  {t(link.key)}
                </a>
              );
            })}
          </nav>
          <div className="nav__actions">
            <LangToggle />
            <a className="btn btn--primary btn--sm" href={site.pumpfunUrl}>
              {t("nav.cta")}
            </a>
            <button
              type="button"
              className="nav__burger"
              aria-expanded={open}
              aria-controls="mobileNav"
              aria-label="Menu"
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        <nav className="mobile-nav" id="mobileNav" hidden={!open} aria-label="Mobile">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {t(link.key)}
            </a>
          ))}
          <a className="btn btn--primary" href={site.pumpfunUrl} onClick={close}>
            {t("nav.cta")}
          </a>
        </nav>
      </header>
    </>
  );
}
