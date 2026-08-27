import Link from "next/link";
import { FABRICS, SIZES, SPORTS, ORDER, DISCOUNTS, site } from "@/lib/site";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * The spec sheet, shown just before the testimonials.
 *
 * A wholesale buyer weighing up a manufacturer wants checkable facts — what you
 * can make, in what fabric, in what sizes, in what quantities — and those build
 * trust in a way praise cannot, because the buyer can verify them against the
 * sample they receive. Every value is read from the same config the catalogue
 * filters and the pricing engine use, so this panel cannot drift out of date.
 */

const SPECS: { icon: IconName; label: string; value: string }[] = [
  {
    icon: "printer",
    label: "Print method",
    value: "Full sublimation, edge-to-edge — the dye bonds into the fibre, so it cannot crack or peel",
  },
  {
    icon: "layers",
    label: "Fabrics",
    value: FABRICS.join(" · "),
  },
  {
    icon: "ruler",
    label: "Sizes",
    value: `${SIZES.join(", ")} — custom sizing available on bulk orders`,
  },
  {
    icon: "package",
    label: "Order range",
    value: `From ${ORDER.minQty} piece to 5,000+ — ${DISCOUNTS.bulk.pct}% off at ${DISCOUNTS.bulk.minQty}+ pieces`,
  },
  {
    icon: "palette",
    label: "Customization",
    value: "Team name, player names and numbers, club crest, sponsor patches, any colourway",
  },
  {
    icon: "truck",
    label: "Dispatch",
    value: `Pan-India from ${site.address.city}, ${site.address.state} — timelines confirmed with your quote`,
  },
];

export function Capabilities() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      {/* Left — framing + CTA */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow">What We Manufacture</p>
        <h2 className="section-heading mt-2">Built to spec, not to a catalogue</h2>
        <p className="section-sub">
          Everything is cut, printed and stitched in our own facility, so a change to a fabric,
          a colourway or a size run is a production decision rather than a supplier negotiation.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/catalogue" className="btn-primary">
            Browse the catalogue
            <Icon name="arrowRight" size={16} />
          </Link>
          <Link href="/contact" className="btn-secondary">
            Request a quote
          </Link>
        </div>

        <p className="mt-6 flex items-start gap-2 text-sm text-ink-500 dark:text-ink-400">
          <span className="mt-0.5 shrink-0 text-flame-500">
            <Icon name="info" size={15} />
          </span>
          Covering {SPORTS.length} sports — from cricket and football through to boxing and
          athletics.
        </p>
      </div>

      {/* Right — the spec sheet */}
      <dl className="divide-y divide-ink-100 dark:divide-ink-800">
        {SPECS.map((s) => (
          <div key={s.label} className="flex gap-4 py-5 first:pt-0">
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-flame-500/10 text-flame-500">
              <Icon name={s.icon} size={18} />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-bold uppercase tracking-widest text-ink-400">
                {s.label}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
                {s.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
