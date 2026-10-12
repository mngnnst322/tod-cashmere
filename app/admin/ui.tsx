import type { OrderStatus } from "@/lib/db/schema";
import type { Role } from "@/lib/roles";

// Shared building blocks for the admin console.

export const btnDark =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-adm-ink px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-adm-ink-soft disabled:opacity-50";
export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-adm-ink/80 bg-white px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-adm-ink transition hover:bg-adm-cream";
export const btnSoft =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-adm-line bg-white px-4 py-2.5 text-sm text-adm-ink transition hover:border-adm-sand";
export const input =
  "w-full rounded-lg border border-adm-line bg-white px-4 py-3 text-sm text-adm-ink outline-none transition placeholder:text-adm-mute/70 focus:border-adm-sand";
export const label = "mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-adm-mute";
export const th =
  "px-5 py-4 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-adm-mute";
export const td = "px-5 py-4 align-middle";
export const panel = "rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,26,23,0.04)]";
export const link = "text-sm font-medium";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-adm-line bg-adm-cream px-6 py-7 md:px-10">
      <div>
        <h1 className="text-[34px] font-light leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-adm-mute">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6 px-6 py-8 md:px-10">{children}</div>;
}

export function StatCard({
  label,
  value,
  note,
  noteTone = "mute",
  icon,
}: {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  noteTone?: "mute" | "up" | "warn";
  icon?: React.ReactNode;
}) {
  const tone = {
    mute: "text-adm-mute",
    up: "text-emerald-700",
    warn: "text-adm-sand-dark",
  }[noteTone];
  return (
    <div className={`${panel} p-6`}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm text-adm-mute">{label}</div>
        {icon && (
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-adm-paper text-adm-mute">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 text-[34px] font-semibold leading-none tracking-tight">{value}</div>
      {note && <div className={`mt-3 text-xs font-medium ${tone}`}>{note}</div>}
    </div>
  );
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Шинэ",
  confirmed: "Баталгаажсан",
  shipping: "Хүргэлтэд",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

const ORDER_STATUS_TONES: Record<OrderStatus, string> = {
  new: "bg-indigo-50 text-indigo-700",
  confirmed: "bg-sky-50 text-sky-700",
  shipping: "bg-amber-50 text-amber-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const key = (status in ORDER_STATUS_LABELS ? status : "new") as OrderStatus;
  return (
    <span
      className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${ORDER_STATUS_TONES[key]}`}
    >
      {ORDER_STATUS_LABELS[key]}
    </span>
  );
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  orders: "Захиалга бэлдэх",
  packer: "Бэлтгэх",
  user: "Энгийн",
};

export const ROLE_DESCRIPTIONS: Record<Exclude<Role, "user">, string> = {
  admin: "Admin (бүх эрх)",
  orders: "Захиалга бэлдэх ажилтан (самбар, бараа, захиалгыг зөвхөн харна)",
  packer: "Бэлтгэх ажилтан (/beltgel хуудсанд л хандана)",
};

export function RoleBadge({ role }: { role: Role }) {
  if (role === "user") {
    return <span className="text-xs text-adm-mute">{ROLE_LABELS.user}</span>;
  }
  return (
    <span className="inline-block rounded-md bg-adm-ink px-2.5 py-1 text-xs font-medium text-white">
      {ROLE_LABELS[role]}
    </span>
  );
}

export function Avatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
  const initial = (name.trim()[0] || "?").toUpperCase();
  return imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-adm-sand/60 text-sm font-medium text-white">
      {initial}
    </span>
  );
}

export function orderCode(id: string) {
  return `#${id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("sv-SE");
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14 text-center text-sm text-adm-mute">
        {children}
      </td>
    </tr>
  );
}

// Minimal line icons (24×24, stroke = currentColor).
function Icon({ d, className = "h-[18px] w-[18px]" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export const icons = {
  dashboard: <Icon d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  box: <Icon d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v18M4 7.5l8 4.5 8-4.5" />,
  tag: <Icon d="M3 12V4h8l9 9-8 8-9-9Zm4.5-4.5h.01" />,
  clipboard: <Icon d="M9 4h6v3H9zM7 5.5H5.5V21h13V5.5H17M9 13l2 2 4-4" />,
  news: <Icon d="M5 5h14v14H5zM8 9h8M8 12h8M8 15h5" />,
  book: <Icon d="M6 3h11v18H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 4h5M9 10h5" />,
  users: <Icon d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 9c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5c1.8.8 3 2.6 3 5.5" />,
  chart: <Icon d="M5 20v-6M12 20V8M19 20v-9" />,
  settings: <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2-1.2L14.5 3h-4l-.4 2.6a7.6 7.6 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7.6 7.6 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z" />,
  package: <Icon d="M3 7h18v13H3zM3 7l2-4h14l2 4M9 11h6" />,
  back: <Icon d="M19 12H5m6-6-6 6 6 6" />,
  download: <Icon d="M12 4v11m-5-5 5 5 5-5M5 20h14" className="h-4 w-4" />,
  upload: <Icon d="M12 20V9m-5 5 5-5 5 5M5 4h14" className="h-4 w-4" />,
  image: <Icon d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9h.01" className="h-4 w-4" />,
  plus: <Icon d="M12 5v14M5 12h14" className="h-4 w-4" />,
};
