"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix?: string; prefix?: string; label: string; plain?: string };

const STATS: Stat[] = [
  { value: 145, suffix: "+", label: "Product designs" },
  { value: 8, label: "Sports covered" },
  { value: 6, label: "Premium fabrics" },
  { value: 100, suffix: "%", label: "Customizable" },
];

function useCountUp(target: number, run: boolean, ms = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let startTs = 0;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return n;
}

export function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {STATS.map((s) => (
        <Stat key={s.label} stat={s} run={run} />
      ))}
    </div>
  );
}

function Stat({ stat, run }: { stat: Stat; run: boolean }) {
  const n = useCountUp(stat.value, run);
  return (
    <div className="text-center">
      <div className="font-display text-4xl font-extrabold text-flame-400 sm:text-5xl">
        {stat.prefix}
        {n}
        {stat.suffix}
      </div>
      <div className="mt-2 text-sm uppercase tracking-wide text-ink-300">{stat.label}</div>
    </div>
  );
}
