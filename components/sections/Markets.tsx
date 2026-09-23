"use client";

import { PhoneMock } from "@/components/ui/phone-mock";
import { useI18n } from "@/components/ui/language-provider";

/**
 * Markets = section copy + a Spanish phone mock.
 *
 * TODO(originkit): When an OriginKit API key is available, add the Globe here:
 *   npx originkit add globe
 * Do not call OriginKit yet, and do not restore the removed three.js globe.
 */
export function Markets() {
  const { t } = useI18n();

  return (
    <section className="section section--muted" id="product">
      <div className="container product-layout">
        <div className="product-layout__copy" data-reveal>
          <span className="eyebrow">{t("markets.eyebrow")}</span>
          <h2>{t("markets.title")}</h2>
          <p>{t("markets.sub")}</p>
        </div>
        {/* TODO(originkit): npx originkit add globe — phone mock only until then. */}
        <div className="markets-stage" data-reveal>
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}
