"use client";

import { useEffect, useRef, useState } from "react";
import { dictionaries } from "@/lib/i18n";

/** App chrome stays Spanish in both EN and ES page languages. */
const es = dictionaries.es;

const SIGNALS = [
  "Señal · Copa América en tendencia",
  "Señal · Inflación AR en debate",
  "Señal · Política MX 2030 activa",
] as const;

type Option = { label: string; mult: string; pct: string };

const CARDS: {
  cat: string;
  question: string;
  vol: string;
  count: string;
  options: Option[];
  icon: "sports" | "macro" | "politics";
}[] = [
  {
    cat: es["markets.catSports"],
    question: es["markets.m1q"],
    vol: es["markets.m1vol"],
    count: es["markets.m1count"],
    icon: "sports",
    options: [
      { label: es["markets.m1o1"], mult: "2.38x", pct: "42%" },
      { label: es["markets.m1o2"], mult: "3.23x", pct: "31%" },
      { label: es["markets.m1o3"], mult: "3.70x", pct: "27%" },
    ],
  },
  {
    cat: es["markets.catMacro"],
    question: es["markets.m2q"],
    vol: es["markets.m2vol"],
    count: es["markets.m2count"],
    icon: "macro",
    options: [
      { label: es["markets.yes"], mult: "1.82x", pct: "55%" },
      { label: es["markets.no"], mult: "2.22x", pct: "45%" },
    ],
  },
  {
    cat: es["markets.catPolitics"],
    question: es["markets.m3q"],
    vol: es["markets.m3vol"],
    count: es["markets.m3count"],
    icon: "politics",
    options: [
      { label: es["markets.yes"], mult: "2.08x", pct: "48%" },
      { label: es["markets.no"], mult: "1.92x", pct: "52%" },
    ],
  },
];

export function PhoneMock() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (!root || reduce) return;

    let timer: number | null = null;
    let fadeTimer: number | null = null;
    let inView = true;
    let current = 0;

    const tick = () => {
      current = (current + 1) % CARDS.length;
      setFading(true);
      fadeTimer = window.setTimeout(() => {
        setIndex(current);
        setFading(false);
      }, 280);
    };

    const sync = () => {
      const shouldRun = inView && !document.hidden;
      if (shouldRun && timer == null) {
        timer = window.setInterval(tick, 3500);
      } else if (!shouldRun && timer != null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    sync();

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          inView = entries.some((entry) => entry.isIntersecting);
          sync();
        },
        { threshold: 0.1 },
      );
      observer.observe(root);
    }

    return () => {
      if (timer != null) window.clearInterval(timer);
      if (fadeTimer != null) window.clearTimeout(fadeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, []);

  return (
    <figure className="device" aria-label="Merlat app mockup">
      <div className="device__chrome" aria-hidden="true">
        <span className="device__speaker" />
        <span className="device__camera" />
      </div>
      <div
        ref={rootRef}
        className="app-mock"
        role="img"
        aria-label="Merlat prediction markets app UI"
      >
        <header className="app-mock__bar">
          <span className="app-mock__brand">Merlat</span>
          <div className="app-mock__actions">
            <span className="app-mock__btn app-mock__btn--ghost">{es["markets.login"]}</span>
            <span className="app-mock__btn app-mock__btn--solid">{es["markets.signup"]}</span>
          </div>
        </header>
        <nav className="app-mock__tabs" aria-hidden="true">
          <span className="app-mock__tab is-active">{es["markets.tabTrending"]}</span>
          <span className="app-mock__tab">{es["markets.tabSports"]}</span>
          <span className="app-mock__tab">{es["markets.tabMacro"]}</span>
          <span className="app-mock__tab">{es["markets.tabPolitics"]}</span>
        </nav>
        <div className="app-mock__signal" aria-hidden="true">
          <span className="app-mock__signal-dot" />
          <span className={`app-mock__signal-text${fading ? " is-fading" : ""}`}>
            {SIGNALS[index]}
          </span>
        </div>
        <div className="app-mock__feed">
          {CARDS.map((card, cardIndex) => (
            <article
              key={card.question}
              className={`app-card${cardIndex === index ? " is-highlight" : ""}`}
            >
              <div className="app-card__cat">
                <span className="app-card__icon" aria-hidden="true">
                  <CardIcon name={card.icon} />
                </span>
                <span className="app-card__cat-label">{card.cat}</span>
              </div>
              <h3 className="app-card__q">{card.question}</h3>
              <ul className="app-card__opts">
                {card.options.map((option) => (
                  <li className="app-opt" key={option.label}>
                    <div className="app-opt__row">
                      <span className="app-opt__label">{option.label}</span>
                      <span className="app-opt__mult">{option.mult}</span>
                      <span className="app-opt__pill">{option.pct}</span>
                    </div>
                    <div className="app-opt__bar" aria-hidden="true">
                      <i style={{ width: option.pct }} />
                    </div>
                  </li>
                ))}
              </ul>
              <footer className="app-card__foot">
                <span>{card.vol}</span>
                <span>{card.count}</span>
              </footer>
            </article>
          ))}
        </div>
        <nav className="app-mock__dock" aria-hidden="true">
          <span className="app-dock__item is-active">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M4 19V5h2v14H4zm5-8v8h2v-8H9zm5-4v12h2V7h-2zm5 6v6h2v-6h-2z" />
            </svg>
            <span>{es["markets.navPredict"]}</span>
          </span>
          <span className="app-dock__item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v4l3 2" />
            </svg>
            <span>{es["markets.navLive"]}</span>
          </span>
          <span className="app-dock__item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="6" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span>{es["markets.navSearch"]}</span>
          </span>
          <span className="app-dock__item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            <span>{es["markets.navSocial"]}</span>
          </span>
        </nav>
      </div>
      <div className="device__home" aria-hidden="true" />
    </figure>
  );
}

function CardIcon({ name }: { name: "sports" | "macro" | "politics" }) {
  if (name === "sports") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3c2.5 2.5 2.5 15.5 0 18M3 12h18M5.5 6.5c3 2 10 2 13 0M5.5 17.5c3-2 10-2 13 0" />
      </svg>
    );
  }
  if (name === "macro") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19V5M4 19h16" />
        <path d="M8 15v-4M12 15V8M16 15v-7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20h16M6 20V10l6-4 6 4v10" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}
