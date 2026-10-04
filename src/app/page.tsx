import { Calculator } from "@/components/calculator";
import { Etiquette } from "@/components/etiquette";
import { Faq } from "@/components/faq";
import { FeatureCards } from "@/components/feature-cards";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/toast";

export default function Home() {
  return (
    <ToastProvider>
      <a
        href="#calculator"
        className="sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-4 focus:z-[60] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        Skip to calculator
      </a>
      <SiteHeader />
      <main className="relative w-full flex-1 bg-surface pt-16">
        <div className="pointer-events-none absolute top-16 left-1/2 -z-10 h-48 w-full max-w-4xl -translate-x-1/2 bg-gradient-to-b from-primary-fixed-dim/15 via-surface-container-low/20 to-transparent blur-2xl" />
        <div className="mx-auto w-full max-w-7xl px-gutter-mobile py-space-lg md:px-margin">
          <Hero />
          <Calculator />
          <FeatureCards />
          <Etiquette />
          <Faq />
        </div>
      </main>
      <SiteFooter />
    </ToastProvider>
  );
}
