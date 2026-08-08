"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Stat = { value: number; suffix?: string; prefix?: string; label: string; desc: string; img: string };

const STATS: Stat[] = [
  {
    value: 300,
    suffix: "+",
    label: "Product Designs",
    desc: "Jerseys, shorts, tracksuits & more",
    img: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png",
  },
  {
    value: 10000,
    suffix: "+",
    label: "Kits Delivered",
    desc: "To teams & brands across India",
    img: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png",
  },
  {
    value: 8,
    label: "Sports Covered",
    desc: "Cricket to Boxing — we've got it",
    img: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png",
  },
  {
    value: 100,
    suffix: "%",
    label: "Customizable",
    desc: "Your name, number, logo, colours",
    img: "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png",
  },
];

function useCountUp(target: number, run: boolean, ms = 1400) {
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
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STATS.map((s) => (
        <StatCard key={s.label} stat={s} run={run} />
      ))}
    </div>
  );
}

function StatCard({ stat, run }: { stat: Stat; run: boolean }) {
  const n = useCountUp(stat.value, run);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-flame-500/30 hover:bg-white/10">
      {/* Background image */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20">
        <Image
          src={stat.img}
          alt=""
          fill
          className="object-cover object-center"
          sizes="300px"
        />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="font-display text-4xl font-extrabold text-flame-400 drop-shadow sm:text-5xl">
          {stat.prefix}{n}{stat.suffix}
        </div>
        <div className="mt-2 font-semibold text-white">{stat.label}</div>
        <div className="mt-1 text-xs text-ink-400">{stat.desc}</div>
      </div>

      {/* Bottom flame line on hover */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-flame-500/0 via-flame-500 to-flame-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
