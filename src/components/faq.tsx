import { Icon } from "@/components/icon";

const QUESTIONS = [
  {
    icon: "help",
    title: "How do I calculate a tip?",
    body: "Multiply your pre-tax bill amount by your desired tip percentage (expressed as a decimal). For instance, for a $100 bill with a 15% tip, multiply $100 × 0.15 = $15 tip, totaling $115.",
  },
  {
    icon: "payments",
    title: "How much should I tip?",
    body: "In the United States and Canada, 15% is the recognized standard for baseline service, 18% to 20% represents good or attentive service, and 22% or higher is customary for exceptional hospitality.",
  },
  {
    icon: "group_work",
    title: "Can I split the bill between multiple people?",
    body: 'Yes! Simply increase or decrease the "Split Between" party size control. The calculator automatically divides both the baseline bill and the calculated gratuity equally down to the cent.',
  },
  {
    icon: "lock_open",
    title: "Is this tip calculator really 100% free?",
    body: "Yes, completely and permanently free. There are no registration forms, credit cards, paywalls, or commercial advertisements. All scripts execute in your web browser.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto my-space-lg w-full max-w-5xl scroll-mt-24 px-gutter-mobile md:px-0">
      <div className="mx-auto mb-space-lg max-w-2xl text-center">
        <span className="font-label-sm text-label-sm font-semibold text-primary uppercase">Frequently Asked Questions</span>
        <h2 className="mt-1 font-headline-lg text-headline-lg text-on-surface">Everything you need to know about tipping</h2>
      </div>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        {QUESTIONS.map((item) => (
          <div key={item.title} className="space-y-space-xs rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
            <h3 className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
              <Icon name={item.icon} className="text-[20px] text-primary" />
              {item.title}
            </h3>
            <p className="font-body-md text-body-md text-secondary">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
