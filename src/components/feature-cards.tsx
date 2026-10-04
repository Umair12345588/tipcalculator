import { Icon } from "@/components/icon";

const FEATURES = [
  {
    icon: "bolt",
    title: "Instant Calculations",
    body: "Real-time mathematical precision without lag, latency, or page refreshes. Results render smoothly as you type.",
  },
  {
    icon: "pie_chart",
    title: "Split Bills Easily",
    body: "Divide dining tabs, bar checks, and group outings down to the exact penny with automated fractional cent distribution.",
  },
  {
    icon: "lock",
    title: "Always Free & Private",
    body: "No user profiles, zero email gates, and no invasive analytic telemetry. 100% computed entirely on your device.",
  },
];

export function FeatureCards() {
  return (
    <section id="how-it-works" className="mx-auto my-space-lg w-full max-w-5xl scroll-mt-24 px-gutter-mobile md:px-0">
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-start gap-space-sm rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low text-primary">
              <Icon name={feature.icon} className="text-[24px]" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{feature.title}</h3>
            <p className="font-body-md text-body-md text-secondary">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
