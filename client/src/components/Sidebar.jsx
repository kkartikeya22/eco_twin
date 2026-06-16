import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { StreakChip } from "./Gamification";
import {
  IconLeaf,
  IconHome,
  IconCalendarDay,
  IconBarChart,
  IconReceipt,
  IconUtensils,
  IconBolt,
  IconCompass,
  IconSparkles,
  IconLogOut,
  IconTarget,
  IconAward,
} from "./icons";

const NAV_SECTIONS = [
  {
    items: [
      { to: "/dashboard", label: "Dashboard", icon: IconHome },
      { to: "/insights", label: "Insights & goals", icon: IconTarget },
    ],
  },
  {
    title: "Overview",
    items: [
      { to: "/daily-timeline", label: "Daily timeline", icon: IconCalendarDay },
      { to: "/weekly-timeline", label: "Weekly timeline", icon: IconBarChart },
    ],
  },
  {
    title: "Track emissions",
    items: [
      { to: "/receipt-scanner", label: "Receipt scanner", icon: IconReceipt },
      { to: "/food-scanner", label: "Food scanner", icon: IconUtensils },
      { to: "/electricity-scanner", label: "Electricity bill", icon: IconBolt },
      { to: "/travel-tracker", label: "Travel tracker", icon: IconCompass },
    ],
  },
  {
    title: "Guidance",
    items: [{ to: "/ai-coach", label: "AI climate coach", icon: IconSparkles }],
  },
];

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();

  const initials = (user?.name || "?")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Workspace header */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
          <IconLeaf className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <p className="text-[13.5px] font-semibold text-ink">EcoTwin</p>
          <p className="text-[11.5px] text-ink-3">Personal carbon workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className={idx === 0 ? "mb-2" : "mt-4"}>
            {section.title && (
              <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "nav-item-active" : ""}`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User / logout */}
      <div className="border-t border-border p-2">
        {(user?.level || user?.streakDays) && (
          <div className="mb-1.5 flex items-center gap-1.5 px-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-1 text-[11.5px] font-semibold text-brand">
              <IconAward className="h-3.5 w-3.5" />
              Level {user.level || 1}
            </span>
            <StreakChip streakDays={user.streakDays || 0} className="text-[11.5px]" />
          </div>
        )}
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-active text-[12px] font-semibold text-ink-2">
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-medium text-ink">
              {user?.name || "Account"}
            </p>
            <p className="truncate text-[11.5px] text-ink-3">
              {user?.email || ""}
            </p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-hover hover:text-danger"
          >
            <IconLogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
