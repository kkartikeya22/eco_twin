// A small, consistent set of stroke-based icons (24x24, currentColor)
// so the whole app shares one visual language without adding a
// third-party icon dependency.

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconLeaf(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 14c0-6 5-10 14-10 0 9-4 14-13 14-1.5 0-1-2.5-1-4Z" />
      <path d="M6 18 16 8" />
    </svg>
  );
}

export function IconHome(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconReceipt(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

export function IconUtensils(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3v6a2 2 0 0 0 2 2v10" />
      <path d="M7 3v4M11 3v4" />
      <path d="M17 3c1.7 0 3 2 3 4.5S18.7 12 17 12v9" />
    </svg>
  );
}

export function IconBolt(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 4 14h6l-1 8 9-12h-6Z" />
    </svg>
  );
}

export function IconCompass(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 6-6 2 2-6Z" />
    </svg>
  );
}

export function IconSparkles(props) {
  return (
    <svg {...base} {...props}>
      <path d="M11 3 9.5 7 5 8.5 9.5 10l1.5 4 1.5-4L17 8.5 12.5 7Z" />
      <path d="M18 14l-.8 2-2 .8 2 .8.8 2 .8-2 2-.8-2-.8Z" />
    </svg>
  );
}

export function IconCalendarDay(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" />
      <rect x="9.5" y="13" width="5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBarChart(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}

export function IconLogOut(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function IconUpload(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function IconImage(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m21 16-5-5-4 4-2-2-5 5" />
    </svg>
  );
}

export function IconChevronRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function IconArrowRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconAlertCircle(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.01" />
    </svg>
  );
}

export function IconLoader(props) {
  return (
    <svg
      {...base}
      style={{ animation: "spin-slow 0.8s linear infinite" }}
      {...props}
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

export function IconTrendingDown(props) {
  return (
    <svg {...base} {...props}>
      <path d="m4 7 7 7 4-4 5 5" />
      <path d="M20 9v6h-6" />
    </svg>
  );
}

export function IconZap(props) {
  return <IconBolt {...props} />;
}

export function IconMail(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function IconLock(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function IconUser(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}

export function IconMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconX(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconFileJson(props) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 16c.7 0 1-.4 1-1v-1c0-.6.3-1 1-1-.7 0-1-.4-1-1v-1c0-.6-.3-1-1-1" />
      <path d="M15 16c-.7 0-1-.4-1-1v-1c0-.6-.3-1-1-1 .7 0 1-.4 1-1v-1c0-.6.3-1 1-1" />
    </svg>
  );
}

export function IconFlame(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2c1 3-3 4.5-3 8a3 3 0 0 0 6 0c1.5 1.5 2 3 2 4.5A5 5 0 0 1 12 22a5 5 0 0 1-5-5.5C7 12 9.5 9.5 12 2Z" />
    </svg>
  );
}

export function IconTarget(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconFeather(props) {
  return (
    <svg {...base} {...props}>
      <path d="M19 4 6.5 16.5A4.5 4.5 0 0 0 5 19.5 4.5 4.5 0 0 0 8 21l12.5-12.5" />
      <path d="M14 9 9 14M17 6l-5 5" />
      <path d="M5 19.5 9.5 15" />
    </svg>
  );
}

export function IconFootprints(props) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="7.5" cy="9" rx="2.3" ry="3" />
      <path d="M5.5 13.5c0 2.5 1 4 2 4s2-1.5 2-4-1-3.5-2-3.5-2 1-2 3.5Z" />
      <ellipse cx="16.5" cy="6" rx="2.3" ry="3" />
      <path d="M14.5 10.5c0 2.5 1 4 2 4s2-1.5 2-4-1-3.5-2-3.5-2 1-2 3.5Z" />
    </svg>
  );
}

export function IconTrendingUp(props) {
  return (
    <svg {...base} {...props}>
      <path d="m4 17 7-7 4 4 5-5" />
      <path d="M14 9h6v6" />
    </svg>
  );
}

export function IconAward(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="5" />
      <path d="m8.5 12.5-1.5 7 5-2.5 5 2.5-1.5-7" />
    </svg>
  );
}

export function IconCheckCircle(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </svg>
  );
}

export function IconGlobe(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export function IconLock2(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="15.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
