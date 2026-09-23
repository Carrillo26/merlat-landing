import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Funds } from "@/components/sections/Funds";
import { Hero } from "@/components/sections/Hero";
import { Markets } from "@/components/sections/Markets";
import { Nav } from "@/components/sections/Nav";
import { Token } from "@/components/sections/Token";
import { WhyLatam } from "@/components/sections/WhyLatam";
import { LanguageProvider } from "@/components/ui/language-provider";
import { ScrollEffects } from "@/components/ui/scroll-effects";

export default function HomePage() {
  return (
    <LanguageProvider>
      <Nav />
      <main id="main">
        <Hero />
        <Markets />
        <WhyLatam />
        <Funds />
        <Token />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <ScrollEffects />
    </LanguageProvider>
  );
}
