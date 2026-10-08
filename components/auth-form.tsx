"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useLang } from "./lang-provider";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const { dict } = useLang();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignUp = mode === "signup";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    setLoading(true);
    setError("");
    const { error } = isSignUp
      ? await authClient.signUp.email({
          name: String(form.get("name") || ""),
          email,
          password,
        })
      : await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message || dict.authError);
      return;
    }
    router.push("/account");
    router.refresh();
  };

  return (
    <form className="card auth-card" onSubmit={handleSubmit}>
      <div className="auth-fields">
        {isSignUp && (
          <label className="form-field">
            {dict.name}
            <input name="name" autoComplete="name" required />
          </label>
        )}
        <label className="form-field">
          {dict.email}
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label className="form-field">
          {dict.password}
          <input
            type="password"
            name="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={8}
            required
          />
          {isSignUp && <span className="muted">{dict.passwordHint}</span>}
        </label>
      </div>
      {error && <p className="auth-error">{error}</p>}
      <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
        {loading ? dict.pleaseWait : isSignUp ? dict.signUp : dict.login}
      </button>
      <p className="auth-switch muted">
        {isSignUp ? dict.haveAccount : dict.noAccount}{" "}
        <Link href={isSignUp ? "/account/login" : "/account/login?mode=signup"}>
          {isSignUp ? dict.login : dict.signUp}
        </Link>
      </p>
    </form>
  );
}
