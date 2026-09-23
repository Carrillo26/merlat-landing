"use client";

import { useI18n } from "@/components/ui/language-provider";
import type { MessageKey } from "@/lib/i18n";

const DISCLAIMERS: MessageKey[] = [
  "footer.d1",
  "footer.d2",
  "footer.d3",
  "footer.d4",
  "footer.d5",
];

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={28} height={28} />
          <span>Merlat</span>
        </div>
        <div className="footer__disclaimers">
          {DISCLAIMERS.map((key) => (
            <Disclaimer key={key} text={t(key)} />
          ))}
        </div>
        <p className="footer__copy">
          © <span suppressHydrationWarning>{year}</span> Merlat. {t("footer.rights")} · v2 FintechX
          fusion
        </p>
      </div>
    </footer>
  );
}

function Disclaimer({ text }: { text: string }) {
  const splitAt = text.indexOf(": ");
  if (splitAt === -1) return <p>{text}</p>;
  return (
    <p>
      <strong>{text.slice(0, splitAt)}:</strong> {text.slice(splitAt + 2)}
    </p>
  );
}
