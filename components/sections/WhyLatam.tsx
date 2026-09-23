"use client";

import { useI18n } from "@/components/ui/language-provider";
import type { MessageKey } from "@/lib/i18n";

const STATS: { value: MessageKey; label: MessageKey; meta: MessageKey; accent?: boolean }[] = [
  { value: "latam.s1v", label: "latam.s1l", meta: "latam.s1m", accent: true },
  { value: "latam.s2v", label: "latam.s2l", meta: "latam.s2m" },
  { value: "latam.s3v", label: "latam.s3l", meta: "latam.s3m" },
  { value: "latam.s4v", label: "latam.s4l", meta: "latam.s4m" },
];

const WEDGES: MessageKey[] = ["latam.w1", "latam.w2", "latam.w3", "latam.w4"];

export function WhyLatam() {
  const { t } = useI18n();

  return (
    <section className="section" id="latam">
      <div className="container">
        <header className="section-head section-head--center" data-reveal>
          <span className="eyebrow">{t("latam.eyebrow")}</span>
          <h2>{t("latam.title")}</h2>
          <p>{t("latam.sub")}</p>
        </header>

        <div className="latam-stats" data-reveal-stagger aria-label="LATAM market signals">
          {STATS.map((stat) => (
            <article
              key={stat.label}
              className={`latam-stat${stat.accent ? " latam-stat--accent" : ""}`}
            >
              <span className="latam-stat__value">{t(stat.value)}</span>
              <span className="latam-stat__label">{t(stat.label)}</span>
              <span className="latam-stat__meta">{t(stat.meta)}</span>
            </article>
          ))}
        </div>

        <article className="card card--accent latam-wedge" data-reveal>
          <h3>{t("latam.wedgeTitle")}</h3>
          <p className="latam-wedge__lead">{t("latam.wedgeLead")}</p>
          <ul className="bullet-list">
            {WEDGES.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </article>

        <p className="latam-disclaimer" data-reveal>
          {t("latam.disclaimer")}
        </p>
        <p className="latam-sources" data-reveal>
          {t("latam.sources")}
        </p>
      </div>
    </section>
  );
}
