"use client";

import dynamic from "next/dynamic";
import { useI18n } from "@/components/ui/language-provider";
import type { MessageKey } from "@/lib/i18n";
import { site } from "@/lib/site";

const TokenCoins = dynamic(() => import("@/components/token-coins"), { ssr: false });

const UTILITIES: { title: MessageKey; body: MessageKey; badge: MessageKey; muted?: boolean }[] = [
  { title: "token.u1t", body: "token.u1d", badge: "token.planned" },
  { title: "token.u2t", body: "token.u2d", badge: "token.planned" },
  { title: "token.u3t", body: "token.u3d", badge: "token.roadmap", muted: true },
];

export function Token() {
  const { t } = useI18n();

  return (
    <section className="section section--token" id="token">
      <TokenCoins />
      <div className="container token-content">
        <header className="section-head section-head--center section-head--on-dark" data-reveal>
          <span className="eyebrow eyebrow--on-dark">{t("token.eyebrow")}</span>
          <h2>{t("token.title")}</h2>
          <p>{t("token.sub")}</p>
        </header>
        <div className="feature-grid" data-reveal-stagger>
          {UTILITIES.map((item) => (
            <article className="card" key={item.title}>
              <div className="card__topline">
                <h3>{t(item.title)}</h3>
                <span className={`badge${item.muted ? " badge--muted" : ""}`}>{t(item.badge)}</span>
              </div>
              <p>{t(item.body)}</p>
            </article>
          ))}
        </div>
        <div className="contract-panel card" data-reveal>
          <p className="contract">
            <span className="eyebrow">{t("token.contract")}</span>
            <code>{site.contractAddress}</code>
          </p>
        </div>
      </div>
    </section>
  );
}
