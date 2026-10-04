export function SiteFooter() {
  return (
    <footer className="mt-auto w-full bg-surface-container-low py-space-xl">
      <div className="mx-auto max-w-7xl px-gutter-mobile md:px-margin">
        <div className="flex flex-col items-center justify-between gap-space-md pb-space-lg md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">Tip Calculator</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">— Free, simple and private.</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              No cookies, no trackers, 100% client-side privacy.
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-space-md" aria-label="Footer">
            <a className="font-bold text-primary transition-colors" href="#calculator" aria-current="page">
              Instant Calculator
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
              href="#quick-tip-guide"
            >
              Bill Splitting Guide
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
              href="#faq"
            >
              FAQ
            </a>
          </nav>
        </div>
        <div className="flex flex-col items-center justify-between gap-space-sm pt-space-md font-label-sm text-label-sm text-on-surface-variant sm:flex-row">
          <p>© 2025 Tip Calculator. Crafted for mathematical precision and clarity.</p>
          <p className="flex items-center gap-1">
            <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-primary">
              lock
            </span>
            Client-Side Verified
          </p>
        </div>
      </div>
    </footer>
  );
}
