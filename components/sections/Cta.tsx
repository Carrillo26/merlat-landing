"use client";

import { useI18n } from "@/components/ui/language-provider";
import { emailHref, site } from "@/lib/site";

export function Cta() {
  const { t } = useI18n();

  return (
    <section className="section section--dark cta-final" id="buy">
      <div className="container">
        <div className="cta-final__inner" data-reveal>
          <div>
            <span className="eyebrow eyebrow--on-dark">{t("cta.eyebrow")}</span>
            <h2>{t("cta.title")}</h2>
            <p>{t("cta.sub")}</p>
          </div>
          <div className="cta-final__actions">
            <a className="btn btn--primary btn--lg" href={site.pumpfunUrl}>
              {t("cta.buy")}
            </a>
            <div className="socials">
              <a href={site.twitterUrl}>{t("cta.twitter")}</a>
              <a href={site.telegramUrl}>{t("cta.telegram")}</a>
              <a href={emailHref}>{t("cta.email")}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
