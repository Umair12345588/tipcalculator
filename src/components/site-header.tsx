"use client";

import { Icon } from "@/components/icon";
import { copyText, useToast } from "@/components/toast";

export function SiteHeader() {
  const showToast = useToast();

  async function sharePage() {
    const url = window.location.href.split("#")[0];
    await copyText(url);
    showToast("Page link copied to clipboard!");
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-surface/85 shadow-[0_1px_8px_rgba(11,28,48,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-space-sm px-gutter-mobile md:px-margin">
        <a href="#calculator" className="flex min-w-0 items-center gap-space-sm">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-[0_4px_12px_rgba(0,105,72,0.20)]">
            <Icon name="percent" className="text-[20px]" />
          </span>
          <span className="flex min-w-0 items-center gap-space-xs">
            <span className="truncate font-headline-sm text-headline-sm tracking-tight text-on-surface">
              Tip Calculator
            </span>
            <span className="inline-flex shrink-0 items-center rounded-full bg-primary-fixed px-space-xs py-0.5 font-label-sm text-label-sm font-semibold text-on-primary-fixed-variant uppercase">
              100% Free
            </span>
          </span>
        </a>
        <div className="flex items-center gap-space-sm lg:gap-space-lg">
          <nav className="hidden items-center gap-space-md whitespace-nowrap md:flex lg:gap-space-lg" aria-label="Primary">
            <a aria-current="page" className="font-bold text-primary transition-colors" href="#calculator">
              Calculator
            </a>
            <a
              className="font-label-lg text-label-lg text-on-surface-variant transition-colors hover:text-on-surface"
              href="#how-it-works"
            >
              How It Works
            </a>
            <a
              className="font-label-lg text-label-lg text-on-surface-variant transition-colors hover:text-on-surface"
              href="#faq"
            >
              FAQ
            </a>
            <button
              type="button"
              className="font-label-lg text-label-lg text-on-surface-variant transition-colors hover:text-on-surface"
              onClick={sharePage}
            >
              Share
            </button>
          </nav>
          <div className="flex items-center gap-space-sm">
            <a
              className="hidden items-center gap-space-xs whitespace-nowrap rounded-xl bg-surface-container-low px-space-md py-1.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container sm:inline-flex md:hidden lg:inline-flex"
              href="#quick-tip-guide"
            >
              <Icon name="menu_book" className="text-[16px] text-primary" />
              Quick Tip Guide
            </a>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary" aria-hidden="true">
              <Icon name="person" className="text-[18px] text-on-primary" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
