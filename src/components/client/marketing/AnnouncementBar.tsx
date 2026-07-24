"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "🎨 Free digital design mockups on every order",
  "🚚 Pan-India delivery from our Meerut factory",
  "🏭 Factory-direct bulk pricing — no middlemen",
  "⚡ Vibrant sublimation that never fades",
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-ink-950 text-white">
      <div className="container-x flex h-9 items-center justify-center overflow-hidden text-center text-xs font-medium">
        <span key={i} className="animate-fade-up">{MESSAGES[i]}</span>
      </div>
    </div>
  );
}
