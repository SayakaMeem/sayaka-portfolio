import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true
};

export function ArrowUpRight(props: IconProps) { return <svg {...defaults} {...props}><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>; }
export function ArrowRight(props: IconProps) { return <svg {...defaults} {...props}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>; }
export function Github(props: IconProps) { return <svg {...defaults} {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 4 5.1 5.1 0 0 0 19.1.5S18 0 15 2a13.4 13.4 0 0 0-7 0C5-.1 3.9.5 3.9.5A5.1 5.1 0 0 0 3.7 4a5.5 5.5 0 0 0-1.5 3.8c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .9-3-1.5-4-2"/></svg>; }
export function Mail(props: IconProps) { return <svg {...defaults} {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>; }
export function Sun(props: IconProps) { return <svg {...defaults} {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>; }
export function Moon(props: IconProps) { return <svg {...defaults} {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>; }
export function Menu(props: IconProps) { return <svg {...defaults} {...props}><path d="M4 6h16M4 12h16M4 18h16"/></svg>; }
export function X(props: IconProps) { return <svg {...defaults} {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>; }
export function Search(props: IconProps) { return <svg {...defaults} {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>; }
export function Code(props: IconProps) { return <svg {...defaults} {...props}><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>; }
export function Database(props: IconProps) { return <svg {...defaults} {...props}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>; }
export function Smartphone(props: IconProps) { return <svg {...defaults} {...props}><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></svg>; }
export function Brain(props: IconProps) { return <svg {...defaults} {...props}><path d="M9.5 4A2.5 2.5 0 0 0 7 6.5v.3A3 3 0 0 0 5 12a3 3 0 0 0 2 5.2v.3A2.5 2.5 0 0 0 9.5 20H12V4Z"/><path d="M14.5 4A2.5 2.5 0 0 1 17 6.5v.3a3 3 0 0 1 2 5.2v.3a2.5 2.5 0 0 1-2.5 2.5H12V4Z"/><path d="M8 9h4M12 14h4M9 16v-2M15 10V8"/></svg>; }
export function Terminal(props: IconProps) { return <svg {...defaults} {...props}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/></svg>; }
export function Layers(props: IconProps) { return <svg {...defaults} {...props}><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></svg>; }
export function Check(props: IconProps) { return <svg {...defaults} {...props}><path d="m5 12 4 4L19 6"/></svg>; }
export function Send(props: IconProps) { return <svg {...defaults} {...props}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>; }
export function ExternalLink(props: IconProps) { return <svg {...defaults} {...props}><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>; }
export function Sparkles(props: IconProps) { return <svg {...defaults} {...props}><path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5Z"/><path d="m5 14-.7 2.3L2 17l2.3.7L5 20l.7-2.3L8 17l-2.3-.7ZM19 14l-.7 2.3L16 17l2.3.7L19 20l.7-2.3L22 17l-2.3-.7Z"/></svg>; }
export function BarChart(props: IconProps) { return <svg {...defaults} {...props}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>; }
export function TableIcon(props: IconProps) { return <svg {...defaults} {...props}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M15 9v11"/></svg>; }
export function Briefcase(props: IconProps) { return <svg {...defaults} {...props}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>; }
export function Filter(props: IconProps) { return <svg {...defaults} {...props}><path d="M4 5h16M7 12h10M10 19h4"/></svg>; }
export function Globe(props: IconProps) { return <svg {...defaults} {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>; }
export function ChartLine(props: IconProps) { return <svg {...defaults} {...props}><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/></svg>; }
export function RefreshCw(props: IconProps) { return <svg {...defaults} {...props}><path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 9M5.5 15A7 7 0 0 0 17.8 17.8L20 15"/></svg>; }
