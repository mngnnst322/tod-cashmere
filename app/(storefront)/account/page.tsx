import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountSignOutButton } from "@/components/account-sign-out-button";
import { getSessionUser } from "@/lib/auth-guard";
import { getDict } from "@/lib/i18n-server";

const dateLocales = { mn: "mn-MN", en: "en-US", ru: "ru-RU", zh: "zh-CN" };

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.profile} – Tod Cashmere` };
}

export default async function AccountPage() {
  const [user, { lang, dict }] = await Promise.all([getSessionUser(), getDict()]);
  if (!user) redirect("/account/login");

  const isAdmin = user.role === "admin";
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">{dict.profile}</div>
          <div className="section-subtitle">{dict.profileSubtitle}</div>
        </div>
      </div>
      <div className="container">
        <div className="card auth-card">
          <dl className="profile-details">
            <div>
              <dt>{dict.name}</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>{dict.email}</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>{dict.role}</dt>
              <dd>{isAdmin ? dict.roleAdmin : dict.roleUser}</dd>
            </div>
            <div>
              <dt>{dict.memberSince}</dt>
              <dd>
                {new Date(user.createdAt).toLocaleDateString(dateLocales[lang])}
              </dd>
            </div>
          </dl>
          <div className="profile-actions">
            {isAdmin && (
              <Link className="btn btn-primary" href="/admin">
                {dict.openAdmin}
              </Link>
            )}
            <AccountSignOutButton label={dict.signOut} />
          </div>
        </div>
      </div>
    </section>
  );
}
