"use client";

import { useI18n } from "@/components/ui/language-provider";
import type { MessageKey } from "@/lib/i18n";

const ITEMS: { q: MessageKey; a: MessageKey }[] = [
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q5", a: "faq.a5" },
];

export function Faq() {
  const { t } = useI18n();

  return (
    <section className="section section--muted" id="faq">
      <div className="container container--narrow">
        <header className="section-head section-head--center" data-reveal>
          <span className="eyebrow">{t("faq.eyebrow")}</span>
          <h2>{t("faq.title")}</h2>
        </header>
        <div className="faq" data-reveal-stagger>
          {ITEMS.map((item) => (
            <details className="faq__item card" key={item.q}>
              <summary>{t(item.q)}</summary>
              <p>{t(item.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
