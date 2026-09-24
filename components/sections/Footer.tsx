"use client";

import { useI18n } from "@/components/ui/language-provider";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merlat-mark.png" alt="" width={28} height={28} />
          <span>Merlat</span>
        </div>
        <p className="footer__copy">
          © <span suppressHydrationWarning>{year}</span> Merlat. {t("footer.rights")} · v2 FintechX
          fusion
        </p>
      </div>
    </footer>
  );
}
