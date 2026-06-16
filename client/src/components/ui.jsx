import { IconAlertCircle, IconLoader, IconUpload } from "./icons";

/* -------------------------------------------------------------------- */
/* Buttons                                                                */
/* -------------------------------------------------------------------- */

const variantClass = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...rest
}) {
  return (
    <button
      className={`btn ${size === "sm" ? "btn-sm" : "btn-md"} ${
        variantClass[variant] || variantClass.primary
      } ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && <IconLoader className="h-4 w-4" />}
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------- */
/* Page header — Notion-style icon block + title                         */
/* -------------------------------------------------------------------- */

export function PageHeader({ icon, eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-brand-soft text-brand">
            {icon}
          </div>
        )}
        <div>
          {eyebrow && (
            <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-ink-3">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ink-2">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Card / Section                                                         */
/* -------------------------------------------------------------------- */

export function Card({ children, className = "", as: Tag = "div", ...rest }) {
  return (
    <Tag className={`surface-card p-5 sm:p-6 ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[15px] font-semibold text-ink">{children}</h2>
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Callout — Notion's signature colored info block                       */
/* -------------------------------------------------------------------- */

const calloutTone = {
  brand: { bg: "var(--color-brand-soft)", text: "var(--color-brand-soft-text)" },
  info: { bg: "var(--color-info-soft)", text: "var(--color-info)" },
  warning: { bg: "var(--color-warning-soft)", text: "var(--color-warning)" },
  danger: { bg: "var(--color-danger-soft)", text: "var(--color-danger)" },
  neutral: { bg: "var(--color-sidebar)", text: "var(--color-ink-2)" },
};

export function Callout({ tone = "brand", icon, title, children }) {
  const colors = calloutTone[tone] || calloutTone.brand;
  return (
    <div
      className="flex gap-3 rounded-[var(--radius-card)] border border-border p-4"
      style={{ backgroundColor: colors.bg }}
    >
      {icon && (
        <div
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center"
          style={{ color: colors.text }}
        >
          {icon}
        </div>
      )}
      <div className="text-[14px] leading-relaxed text-ink">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Tag — small category pill                                             */
/* -------------------------------------------------------------------- */

export function Tag({ label, bg, text, dot }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: dot }}
        />
      )}
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------- */
/* Stat tile — quiet number block                                        */
/* -------------------------------------------------------------------- */

export function StatTile({
  label,
  value,
  unit,
  tone = "neutral",
  icon,
  className = "",
}) {
  const toneClass =
    tone === "brand"
      ? "text-brand"
      : tone === "danger"
      ? "text-danger"
      : "text-ink";
  return (
    <div className={`surface-card p-5 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-medium text-ink-2">{label}</p>
        {icon && <div className="text-ink-3">{icon}</div>}
      </div>
      <p className={`text-[28px] font-bold leading-none ${toneClass}`}>
        {value}
        {unit && (
          <span className="ml-1 text-[14px] font-medium text-ink-3">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Empty state                                                            */
/* -------------------------------------------------------------------- */

export function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border-strong px-6 py-12 text-center">
      {icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-hover text-ink-3">
          {icon}
        </div>
      )}
      <p className="text-[14px] font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-[13px] text-ink-2">{description}</p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Progress bar                                                           */
/* -------------------------------------------------------------------- */

export function ProgressBar({ value = 0, max = 100, tone = "brand", className = "", trackClassName = "" }) {
  const pct = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;
  const fillColor =
    tone === "danger"
      ? "var(--color-danger)"
      : tone === "warning"
      ? "var(--color-warning)"
      : tone === "info"
      ? "var(--color-info)"
      : tone === "muted"
      ? "var(--color-ink-3)"
      : "var(--color-brand)";

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-hover ${trackClassName}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ${className}`}
        style={{ width: `${pct}%`, backgroundColor: fillColor }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Error banner                                                           */
/* -------------------------------------------------------------------- */

export function ErrorBanner({ children }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-border bg-danger-soft px-4 py-3 text-[13.5px] text-danger">
      <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Field wrapper                                                          */
/* -------------------------------------------------------------------- */

export function Field({ label, children }) {
  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* File drop — Notion-style upload block                                 */
/* -------------------------------------------------------------------- */

export function FileDrop({ accept, onChange, fileName, hint }) {
  return (
    <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border-2 border-dashed border-border-strong bg-sidebar px-6 py-10 text-center transition-colors hover:border-brand hover:bg-brand-soft/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-ink-2 shadow-sm transition-colors group-hover:text-brand">
        <IconUpload className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[14px] font-medium text-ink">
          {fileName ? fileName : "Click to upload, or drag a file here"}
        </p>
        {hint && <p className="mt-0.5 text-[12.5px] text-ink-3">{hint}</p>}
      </div>
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}
