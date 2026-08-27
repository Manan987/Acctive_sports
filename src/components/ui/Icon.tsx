import type { SVGProps } from "react";

/**
 * One stroke-based icon set for the whole site.
 *
 * The UI previously used emoji as chrome (🔥 in buttons, 🏭 in trust badges,
 * 🚚 in process steps). Emoji render as a different typeface on every OS, sit
 * on their own baseline, ignore `currentColor`, and read as consumer-app
 * decoration rather than as a manufacturer's brand — so every one of them is
 * replaced by a path here.
 *
 * All glyphs are drawn on a 24x24 grid, inherit `currentColor`, and share a
 * 1.75 stroke so they sit consistently next to Inter/Sora text.
 */

const STROKE: Record<string, string> = {
  // — Manufacturing & fulfilment —
  factory: "M2 20h20M4 20V9l5 3V9l5 3V9l5 3v8M8 20v-4h3v4",
  truck: "M3 16V6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10M15 9h3.5a1 1 0 0 1 .8.4l2.5 3.3a1 1 0 0 1 .2.6V16M3 16h1.2M10.8 16h4.4M21 16h-1M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  package: "M21 8.5v7a2 2 0 0 1-1 1.73l-6 3.46a2 2 0 0 1-2 0l-6-3.46a2 2 0 0 1-1-1.73v-7a2 2 0 0 1 1-1.73l6-3.46a2 2 0 0 1 2 0l6 3.46A2 2 0 0 1 21 8.5ZM3.6 7.4 12 12.2l8.4-4.8M12 12.2V21",
  layers: "m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5",

  // — Design & customisation —
  palette:
    "M12 21a9 9 0 1 1 0-18c4.97 0 9 3.58 9 8 0 2.21-1.79 4-4 4h-1.8a1.7 1.7 0 0 0-1.2 2.9 1.7 1.7 0 0 1-1.2 2.9ZM7.5 10.5h.01M10.5 7h.01M15 7.5h.01",
  pen: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",
  ruler:
    "M15.7 2.9 21.1 8.3a1 1 0 0 1 0 1.4L9.7 21.1a1 1 0 0 1-1.4 0L2.9 15.7a1 1 0 0 1 0-1.4L14.3 2.9a1 1 0 0 1 1.4 0ZM7 12l2 2M10 9l2 2M13 6l2 2",
  printer:
    "M6 9V3h12v6M6 18H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1M6 14h12v7H6z",

  // — Trust & quality —
  shieldCheck: "M12 3 4 6v5.5c0 4.6 3.2 8.5 8 9.5 4.8-1 8-4.9 8-9.5V6l-8-3ZM9 12l2 2 4-4",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM8.2 13.8 7 22l5-2.5L17 22l-1.2-8.2",
  check: "M20 6 9 17l-5-5",
  checkCircle: "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20Z",

  // — Commerce —
  cart: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0",
  tag: "M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8ZM7.5 7.5h.01",
  percent: "m19 5-14 14M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  creditCard: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM2 10h20M6 15h3",
  banknote: "M2 6h20v12H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 12h.01M18 12h.01",
  smartphone: "M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM11 19h2",
  building: "M3 21h18M5 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M15 9h3a1 1 0 0 1 1 1v11M9 7h2M9 11h2M9 15h2",

  // — Navigation & controls —
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  chevronDown: "m6 9 6 6 6-6",
  chevronRight: "m9 18 6-6-6-6",
  chevronLeft: "m15 18-6-6 6-6",
  close: "M18 6 6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3",
  filter: "M22 3H2l8 9.5V19l4 2v-8.5L22 3Z",
  externalLink: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",

  // — Contact —
  mail: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM3 6l9 7 9-7",
  phone:
    "M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.26-1.26a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z",
  mapPin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  message: "M21 11.5a8.4 8.4 0 0 1-9 8.5 8.9 8.9 0 0 1-4-1L3 20l1.3-4a8.4 8.4 0 0 1-1-4.5 8.4 8.4 0 0 1 9-8.5 8.4 8.4 0 0 1 8.7 8.5Z",

  // — Misc —
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6 8.4 8.4M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 16v-4M12 8h.01",
  alert: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 8v4M12 16h.01",
  trash: "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6",
  copy: "M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1ZM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z",
  menu: "M4 7h16M4 12h16M4 17h16",
};

const FILLED: Record<string, string> = {
  star: "M12 2.5 15 9l7 .9-5.1 4.8 1.3 6.8L12 18.2 5.8 21.5 7.1 14.7 2 9.9 9 9l3-6.5Z",
  quote:
    "M9.4 5.5A7.9 7.9 0 0 0 4 13v5.5h6.6V13H7.9c0-2.4 1.1-3.9 3-4.5l-1.5-3ZM19 5.5A7.9 7.9 0 0 0 13.6 13v5.5h6.6V13h-2.7c0-2.4 1.1-3.9 3-4.5l-1.5-3Z",
  whatsapp:
    "M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.2s-.7 1-.9 1.2c-.2.2-.3.2-.6.1s-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.7-1.6-.9-2.2-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4S6 7.9 6 9.4s1.1 2.9 1.2 3.1 2.1 3.2 5.1 4.5c.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.2-1.3.2-1.4-.3-.2-.6-.4ZM12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.1 1.5 5.8L0 23.5a.5.5 0 0 0 .6.6l5.8-1.5A11.9 11.9 0 0 0 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0Zm0 21.9c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 0 1 2.1 12 9.9 9.9 0 1 1 12 21.9Z",
};

export type IconName = keyof typeof STROKE | keyof typeof FILLED;

type Props = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number | string;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, strokeWidth = 1.75, className, ...rest }: Props) {
  const filled = FILLED[name as string];
  const d = filled ?? STROKE[name as string];
  if (!d) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? undefined : "currentColor"}
      strokeWidth={filled ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}

/** Instagram needs a rect + circle, so it does not fit the single-path map. */
export function InstagramIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4Z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}
