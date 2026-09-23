"use client";

import { useI18n } from "@/components/ui/language-provider";
import { site } from "@/lib/site";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__copy" data-reveal>
            <span className="eyebrow">{t("hero.eyebrow")}</span>
            <h1>{t("hero.title")}</h1>
            <p className="hero__lead">{t("hero.lead")}</p>
            <div className="hero__ctas">
              <a className="btn btn--primary btn--lg" href={site.pumpfunUrl}>
                {t("hero.ctaBuy")}
              </a>
              <a className="btn btn--ghost btn--lg" href="#product">
                {t("hero.ctaHow")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
