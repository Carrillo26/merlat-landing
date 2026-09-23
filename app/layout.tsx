import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Merlat — LATAM Prediction Markets | $MERLAT",
  description:
    "Merlat — LATAM-first prediction markets. Community raise for a real product thesis, not just another memecoin.",
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F4F3ED",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className={jakarta.className}>
        <Script id="merlat-js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        {children}
      </body>
    </html>
  );
}
