export function Etiquette() {
  return (
    <section id="quick-tip-guide" className="mx-auto my-space-lg w-full max-w-5xl scroll-mt-24 px-gutter-mobile md:px-0">
      <div className="grid grid-cols-1 items-center gap-space-lg rounded-2xl bg-surface-container-low p-space-lg md:grid-cols-12 md:p-space-xl">
        <div className="space-y-space-sm md:col-span-6">
          <span className="font-label-sm text-label-sm font-semibold text-primary uppercase">
            Dining Etiquette Blueprint
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Transparent math for frictionless dining.</h2>
          <p className="font-body-md text-body-md text-secondary">
            Tipping doesn&apos;t have to be a guessing game at the end of a memorable evening. With clear percentage
            benchmarks and granular individual breakdown ledgers, you can effortlessly settle tabs with your companions
            in moments.
          </p>
          <div className="flex flex-wrap items-center gap-space-md pt-space-xs font-label-md text-label-md text-on-surface">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-primary" /> 15% Standard
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-primary-container" /> 20% Great Service
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-tertiary" /> 25% Exceptional
            </div>
          </div>
        </div>
        <div className="flex justify-center md:col-span-6">
          <div className="w-full max-w-sm rounded-xl bg-surface-container-lowest p-space-md shadow-md">
            <div className="mb-space-sm flex items-center justify-between pb-space-xs font-label-sm text-label-sm text-secondary">
              <span>GRATUITY ALLOCATION</span>
              <span className="font-bold text-primary">100% LOCAL</span>
            </div>
            <svg aria-label="Tip distribution chart" className="h-auto w-full overflow-visible text-on-surface" viewBox="0 0 320 160">
              <rect fill="#eff4ff" height="24" rx="12" width="320" x="0" y="20" />
              <rect fill="#006948" height="24" rx="12" width="240" x="0" y="20" />
              <rect fill="#2170e4" height="24" rx="12" width="80" x="240" y="20" />
              <text fill="#ffffff" fontFamily="var(--font-inter), sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle" x="120" y="36">
                Base Bill: 75%
              </text>
              <text fill="#ffffff" fontFamily="var(--font-inter), sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle" x="280" y="36">
                Tip: 25%
              </text>
              <circle cx="40" cy="90" fill="#006948" fillOpacity="0.1" r="16" />
              <text fill="#006948" fontFamily="var(--font-inter), sans-serif" fontSize="12" fontWeight="bold" textAnchor="middle" x="40" y="94">
                1
              </text>
              <text fill="#0b1c30" fontFamily="var(--font-inter), sans-serif" fontSize="12" fontWeight="500" x="68" y="94">
                Guest 1: $57.50
              </text>
              <circle cx="40" cy="130" fill="#006948" fillOpacity="0.1" r="16" />
              <text fill="#006948" fontFamily="var(--font-inter), sans-serif" fontSize="12" fontWeight="bold" textAnchor="middle" x="40" y="134">
                2
              </text>
              <text fill="#0b1c30" fontFamily="var(--font-inter), sans-serif" fontSize="12" fontWeight="500" x="68" y="134">
                Guest 2: $57.50
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
