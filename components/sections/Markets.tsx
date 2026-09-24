"use client";

import dynamic from "next/dynamic";
import { PhoneMock } from "@/components/ui/phone-mock";
import { useI18n } from "@/components/ui/language-provider";

const Globe = dynamic(() => import("@/components/originkit/globe"), { ssr: false });

/** Stable props so the supplied Globe effect does not restart on every render. */
const GLOBE_MARKERS = {
  markers: [
    { lat: 19.43, lng: -99.13 },
    { lat: 4.71, lng: -74.07 },
    { lat: -23.55, lng: -46.63 },
    { lat: -34.6, lng: -58.38 },
    { lat: -12.05, lng: -77.04 },
    { lat: -33.45, lng: -70.67 },
  ],
  color: "#E10600",
  size: 40,
};

/**
 * Markets = copy + Spanish phone mock, with the supplied OriginKit Globe behind them.
 * LATAM dots are colored inside the globe (#E10600). Not installed via `npx originkit add`.
 */
export function Markets() {
  const { t } = useI18n();

  return (
    <section className="section section--muted" id="product">
      <div className="markets-globe">
        <Globe
          fill="dots"
          oceanColor="#000000"
          showOutline
          showGrid
          speed={2}
          stopOnHover
          scale={8}
          initialLatitude={-5}
          initialLongitude={-60}
          markerConfig={GLOBE_MARKERS}
        />
      </div>
      <div className="container product-layout">
        <div className="product-layout__copy" data-reveal>
          <span className="eyebrow">{t("markets.eyebrow")}</span>
          <h2>{t("markets.title")}</h2>
          <p>{t("markets.sub")}</p>
        </div>
        <div className="markets-stage" data-reveal>
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}
