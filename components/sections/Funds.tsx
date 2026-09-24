"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/ui/language-provider";
import type { MessageKey } from "@/lib/i18n";

const SEGMENTS: { key: string; label: MessageKey; pct: string }[] = [
  { key: "product", label: "funds.product", pct: "35%" },
  { key: "legal", label: "funds.legal", pct: "25%" },
  { key: "marketing", label: "funds.marketing", pct: "20%" },
  { key: "liquidity", label: "funds.liquidity", pct: "15%" },
  { key: "ops", label: "funds.ops", pct: "5%" },
];

export function Funds() {
  const { t } = useI18n();
  const [drawn, setDrawn] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const root = document.querySelector("[data-fund-pie]");
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (!root || reduce || !("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }

    const trigger = root.closest(".raise-funds") ?? root;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setDrawn(true);
        observer.disconnect();
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.2 },
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section section--dark" id="raise">
      <div className="container">
        <div className="raise-funds" data-reveal>
          <header className="section-head section-head--on-dark section-head--center raise-funds__head">
            <span className="eyebrow eyebrow--on-dark">{t("funds.eyebrow")}</span>
            <h2>{t("funds.title")}</h2>
            <p>{t("funds.sub")}</p>
          </header>
          <div
            className={`fund-pie${drawn ? " is-drawn" : ""}${active ? " is-dimming" : ""}`}
            data-fund-pie
          >
            <div className="fund-pie__chart" aria-hidden="true">
              <svg className="fund-pie__svg" viewBox="0 0 120 120" focusable="false">
                <circle className="fund-pie__track" cx="60" cy="60" r="42" />
                <g className="fund-pie__rings" transform="rotate(-90 60 60)">
                  {SEGMENTS.map((segment) => (
                    <circle
                      key={segment.key}
                      className={`fund-pie__seg${active === segment.key ? " is-emphasis" : ""}`}
                      data-seg={segment.key}
                      cx="60"
                      cy="60"
                      r="42"
                      pathLength={100}
                    />
                  ))}
                </g>
              </svg>
              <div className="fund-pie__center">
                <span className="fund-pie__center-val">100%</span>
              </div>
            </div>
            <ul className="fund-pie__legend" role="list">
              {SEGMENTS.map((segment) => (
                <li
                  key={segment.key}
                  className={`fund-pie__item${active === segment.key ? " is-active" : ""}`}
                  tabIndex={0}
                  data-seg={segment.key}
                  onMouseEnter={() => setActive(segment.key)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(segment.key)}
                  onBlur={() => setActive(null)}
                >
                  <span className="fund-pie__dot" aria-hidden="true" />
                  <span className="fund-pie__label">{t(segment.label)}</span>
                  <strong className="fund-pie__pct">{segment.pct}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
