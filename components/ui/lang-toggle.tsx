"use client";

import { useI18n } from "@/components/ui/language-provider";
import type { Lang } from "@/lib/i18n";

const OPTIONS: Lang[] = ["en", "es"];

export function LangToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {OPTIONS.map((option) => {
        const active = lang === option;
        return (
          <button
            key={option}
            type="button"
            className={`lang-toggle__btn${active ? " is-active" : ""}`}
            aria-pressed={active}
            onClick={() => setLang(option)}
          >
            {option.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
