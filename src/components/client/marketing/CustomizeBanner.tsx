import Link from "next/link";

const STEPS = [
  { n: "1", t: "Pick a design", d: "Choose from 145+ styles or send your own artwork." },
  { n: "2", t: "We mock it up", d: "Free digital proof with your name, numbers & logo." },
  { n: "3", t: "Approve & produce", d: "We manufacture in-house with full QC." },
  { n: "4", t: "Delivered", d: "Dispatched pan-India from our Meerut unit." },
];

export function CustomizeBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-950 bg-grid px-6 py-12 text-white sm:px-10 md:py-14">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-flame-500/30 blur-[100px]" />
      <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-electric-500/20 blur-[100px]" />
      <div className="relative">
        <div className="max-w-2xl">
          <span className="eyebrow text-flame-400">Personalize your gear</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Your team. Your colours. Your name on every jersey.
          </h2>
          <p className="mt-3 text-ink-200">
            Every ACCTIVE product is fully customizable — send us a brief and we&apos;ll
            handle the rest, from design to doorstep.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-flame-500 font-display font-bold text-white">
                {s.n}
              </span>
              <p className="mt-3 font-semibold">{s.t}</p>
              <p className="mt-1 text-sm text-ink-300">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/quote" className="btn-primary btn-lg">Start your order</Link>
          <Link href="/catalogue" className="btn-lg btn border border-white/25 bg-white/10 text-white hover:bg-white/20">
            Browse designs
          </Link>
        </div>
      </div>
    </div>
  );
}
