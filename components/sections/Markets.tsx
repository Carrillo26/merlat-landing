"use client";

import dynamic from "next/dynamic";
import { PhoneMock } from "@/components/ui/phone-mock";
import { useI18n } from "@/components/ui/language-provider";
import type { GlobeMarker } from "@/components/originkit/globe";

const Globe = dynamic(() => import("@/components/originkit/globe"), { ssr: false });

const LATAM_MARKERS: GlobeMarker[] = [
  { lat: 19.43, lng: -99.13 },
  { lat: 4.71, lng: -74.07 },
  { lat: -23.55, lng: -46.63 },
  { lat: -34.6, lng: -58.38 },
  { lat: -12.05, lng: -77.04 },
  { lat: -33.45, lng: -70.67 },
];

/**
 * Markets = copy + Spanish phone mock, with the OriginKit Globe behind them.
 * The globe file is the base preset (three + d3-geo). It was not fetched with
 * `npx originkit add`. LATAM dots are colored inside the globe component.
 */
export function Markets() {
  const { t } = useI18n();

  return (
    <section className="section section--muted" id="product">
      <div className="markets-globe">
        <Globe
          fill="dots"
          fillColor="#FFFFFF"
          oceanColor="#000000"
          showOutline
          showGrid
          speed={2}
          stopOnHover
          scale={8}
          initialLatitude={-5}
          initialLongitude={-60}
          markers={LATAM_MARKERS}
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
