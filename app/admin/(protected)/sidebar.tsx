"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountSignOutButton } from "@/components/account-sign-out-button";
import type { StaffRole } from "@/lib/roles";
import { Avatar, ROLE_LABELS, icons } from "../ui";

type NavItem = { href: string; label: string; icon: React.ReactNode; roles: StaffRole[] };

const manage: NavItem[] = [
  { href: "/admin", label: "Хяналтын самбар", icon: icons.dashboard, roles: ["admin", "orders"] },
  { href: "/admin/products", label: "Бараа", icon: icons.box, roles: ["admin", "orders"] },
  { href: "/admin/categories", label: "Ангилал", icon: icons.tag, roles: ["admin"] },
  { href: "/admin/orders", label: "Захиалга", icon: icons.clipboard, roles: ["admin", "orders"] },
  { href: "/admin/beltgel", label: "Бэлтгэл", icon: icons.package, roles: ["admin", "packer"] },
  { href: "/admin/news", label: "Мэдээ", icon: icons.news, roles: ["admin"] },
  { href: "/admin/catalog", label: "Каталог", icon: icons.book, roles: ["admin"] },
  { href: "/admin/users", label: "Хэрэглэгчид", icon: icons.users, roles: ["admin"] },
  { href: "/admin/reports", label: "Тайлан", icon: icons.chart, roles: ["admin"] },
];

const config: NavItem[] = [
  { href: "/admin/settings", label: "Тохиргоо", icon: icons.settings, roles: ["admin"] },
];

export function Sidebar({
  user,
}: {
  user: { name: string; imageUrl: string; role: StaffRole };
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const renderGroup = (title: string, items: NavItem[]) => {
    const visible = items.filter((item) => item.roles.includes(user.role));
    if (visible.length === 0) return null;
    return (
      <div className="mt-10 first:mt-12">
        <div className="mb-3 px-3 text-[10px] uppercase tracking-[0.35em] text-white/35">
          {title}
        </div>
        <nav className="flex flex-col gap-1">
          {visible.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition ${
                isActive(item.href)
                  ? "bg-adm-sand font-medium text-adm-ink"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={isActive(item.href) ? "text-adm-ink" : "text-white/45"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col bg-adm-ink text-white">
      <div className="flex-1 overflow-y-auto px-4 pt-8">
        <Link href="/admin" className="block px-3">
          <div className="text-[30px] font-light leading-[1.1] tracking-[0.25em]">
            Tod
            <br />
            Cashmere
          </div>
          <div className="mt-4 text-[10px] uppercase tracking-[0.45em] text-white/45">
            Admin console
          </div>
        </Link>
        {renderGroup("Удирдлага", manage)}
        {renderGroup("Тохиргоо", config)}
      </div>
      <div className="px-4 pb-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-white/75 hover:bg-white/5 hover:text-white"
        >
          <span className="text-white/45">{icons.back}</span>
          Сайт руу буцах
        </Link>
      </div>
      <div className="flex items-center gap-3 border-t border-white/10 px-6 py-5">
        <Avatar name={user.name} imageUrl={user.imageUrl} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm">{user.name}</div>
          <div className="text-xs text-white/45">{ROLE_LABELS[user.role]}</div>
        </div>
        <AccountSignOutButton
          label="Гарах"
          className="text-xs text-white/45 hover:text-white"
        />
      </div>
    </aside>
  );
}
