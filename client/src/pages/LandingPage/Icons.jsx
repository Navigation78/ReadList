// Shared props for all outline icons
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const BookOpenIcon = ({ className = "h-5 w-5" }) => (
  <svg {...base} className={className}>
    <path d="M2 5.5C4.5 4.5 8 4.5 12 6.5c4-2 7.5-2 10-1V19c-2.5-1-6-1-10 1-4-2-7.5-2-10-1z" />
    <path d="M12 6.5V20" />
  </svg>
);

export const SearchIcon = ({ className = "h-5 w-5" }) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const ChartIcon = ({ className = "h-5 w-5" }) => (
  <svg {...base} className={className}>
    <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" />
  </svg>
);

export const HeartIcon = ({ className = "h-5 w-5" }) => (
  <svg {...base} className={className}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </svg>
);

export const SunIcon = ({ className = "h-5 w-5" }) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = ({ className = "h-5 w-5" }) => (
  <svg {...base} className={className}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export const ArrowIcon = ({ className = "h-4 w-4" }) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// Filled brand mark used next to the "ReadList" wordmark
export const LogoMark = ({ className = "h-7 w-7" }) => (
  <svg viewBox="0 0 32 28" fill="currentColor" className={className} aria-hidden="true">
    <path d="M2 3c5-1.5 10-.5 13 2v21c-3-2.5-8-3.5-13-2z" />
    <path d="M30 3c-5-1.5-10-.5-13 2v21c3-2.5 8-3.5 13-2z" />
  </svg>
);