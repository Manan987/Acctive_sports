import Link from "next/link";
import { DISCOUNTS } from "@/lib/site";
import { Icon, type IconName } from "@/components/ui/Icon";

const STEPS: { n: string; t: string; d: string; icon: IconName }[] = [
  {
    n: "01",
    t: "Choose a design",
    d: "Pick from the catalogue or send your own artwork — we match it exactly.",
    icon: "layers",
  },
  {
    n: "02",
    t: "Free digital mockup",
    d: "See your kit with names, numbers and logo placed before you commit a rupee.",
    icon: "pen",
  },
  {
    n: "03",
    t: "We manufacture",
    d: "Made in-house at our Meerut factory, with QC on every piece before packing.",
    icon: "factory",
  },
  {
    n: "04",
    t: "Delivered to your door",
    d: "Packed and dispatched pan-India, with tracking from our floor to yours.",
    icon: "truck",
  },
];

/**
 * Process explainer. Previously each step was labelled with an emoji — one of
 * which was 🏥 (hospital) standing in for "we manufacture" — over an animated
 * gradient headline and a pulsing CTA. Icons, static type, one CTA hierarchy.
 */
export function CustomizeBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/95 to-flame-950/60" />
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-flame-500/15 blur-[110px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame-500/50 to-transparent" />

      <div className="relative px-6 py-14 sm:px-10 md:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/30 bg-flame-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-flame-400">
            <Icon name="ruler" size={13} />
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Fully custom, start to finish.
          </h2>
          <p className="section-sub text-ink-300">
            Tell us your colours, logo, names and numbers. We design, print, manufacture and
            deliver — four steps, no back-and-forth, no surprises.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, idx) => (
            <li
              key={s.n}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-flame-500/40 hover:bg-white/[0.08]"
            >
              {idx < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-2 top-9 hidden h-px w-4 bg-gradient-to-r from-white/20 to-transparent lg:block"
                />
              )}
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-flame-500/15 text-flame-400">
                  <Icon name={s.icon} size={19} />
                </span>
                <span className="nums text-sm font-bold text-white/25">{s.n}</span>
              </div>
              <p className="mt-4 font-bold text-white">{s.t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href="/catalogue" className="btn-primary btn-lg">
            Start your order
            <Icon name="arrowRight" size={17} />
          </Link>
          <Link href="/contact" className="btn-on-dark btn-lg">
            Request a free mockup
          </Link>
        </div>
        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="tag" size={13} className="text-flame-500" />
            {DISCOUNTS.single.pct}% off single pieces
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="percent" size={13} className="text-flame-500" />
            {DISCOUNTS.bulk.pct}% off {DISCOUNTS.bulk.minQty}+ pieces
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="check" size={13} className="text-flame-500" />
            No payment for the mockup
          </span>
        </p>
      </div>
    </div>
  );
}
