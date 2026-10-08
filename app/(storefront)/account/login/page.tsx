import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSessionUser } from "@/lib/auth-guard";
import { getDict } from "@/lib/i18n-server";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.login} – Tod Cashmere` };
}

export default async function AccountLoginPage(
  props: PageProps<"/account/login">,
) {
  const [{ mode }, user, { dict }] = await Promise.all([
    props.searchParams,
    getSessionUser(),
    getDict(),
  ]);
  if (user) redirect("/account");

  const isSignUp = mode === "signup";
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">
            {isSignUp ? dict.signUp : dict.login}
          </div>
          <div className="section-subtitle">
            {isSignUp ? dict.signUpSubtitle : dict.signInSubtitle}
          </div>
        </div>
      </div>
      <div className="container">
        <AuthForm key={isSignUp ? "signup" : "signin"} mode={isSignUp ? "signup" : "signin"} />
      </div>
    </section>
  );
}
