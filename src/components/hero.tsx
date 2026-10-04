import { Icon } from "@/components/icon";

const TRUST = [
  { icon: "verified", label: "Free forever" },
  { icon: "lock", label: "No sign-up or email" },
  { icon: "money_off", label: "No hidden fees or ads" },
  { icon: "shield", label: "100% Private (Runs locally)" },
];

export function Hero() {
  return (
    <section className="relative mx-auto max-w-4xl px-space-md pt-space-md pb-space-lg text-center">
      <div className="mb-space-md inline-flex items-center gap-2 rounded-full bg-surface-container px-3 py-1.5 font-label-sm text-label-sm text-on-surface-variant shadow-sm">
        <span className="flex h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span>100% Free Forever • No Sign-up Needed • Instant Calculations</span>
      </div>
      <h1 className="mx-auto max-w-3xl font-headline-lg text-headline-lg tracking-tight text-on-surface md:font-display-lg md:text-display-lg">
        Calculate the perfect tip in seconds.
      </h1>
      <p className="mx-auto mt-space-sm mb-space-lg max-w-2xl font-body-lg text-body-lg text-secondary">
        Quickly calculate tips, split bills, and see exactly what everyone owes with real-time accuracy and zero
        clutter.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-space-md gap-y-space-xs font-label-md text-label-md text-on-surface-variant">
        {TRUST.map((item, index) => (
          <span key={item.label} className="contents">
            {index > 0 ? <span className="text-outline-variant">•</span> : null}
            <span className="flex items-center gap-1.5">
              <Icon name={item.icon} className="text-[18px] text-primary" />
              {item.label}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
