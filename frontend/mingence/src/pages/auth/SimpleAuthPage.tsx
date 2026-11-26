import { useState } from "react";
import type { FormEvent } from "react";
import type { Page } from "../../common/types";
import { Logo } from "../../common/Logo";
import { requestPasswordReset, updatePassword } from "../../api/supabase/supabaseAuth";
export function SimpleAuthPage({
  navigate,
  mode,
}: {
  navigate: (p: Page) => void;
  mode: "forgot" | "reset";
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const result =
      mode === "forgot"
        ? await requestPasswordReset(
            String(form.get("email")),
            `${window.location.origin}/?page=reset-password`,
          )
        : await updatePassword(String(form.get("password")));
    setBusy(false);
    if (result.error) {
      setStatus(result.error.message);
    } else {
      setStatus(
        mode === "forgot"
          ? "If an account exists for that address, a secure reset link is on its way."
          : "Your password has been changed. You can now continue to your profile.",
      );
    }
  };
  return (
    <main className="single-auth-page">
      <Logo onClick={() => navigate("home")} />
      <section className="single-auth-card">
        <span className="auth-kicker">
          {mode === "forgot" ? "ACCOUNT RECOVERY" : "SECURE RESET LINK"}
        </span>
        <h1>{mode === "forgot" ? "Forgot your password?" : "Choose a new password"}</h1>
        <p>
          {mode === "forgot"
            ? "Enter your account email and we’ll send you a one-time password reset URL."
            : "This page uses the secure recovery URL from your email to update your password."}
        </p>
        <form onSubmit={submit}>
          {mode === "forgot" ? (
            <label>
              Email address
              <input required name="email" type="email" placeholder="you@example.com" />
            </label>
          ) : (
            <label>
              New password
              <input
                required
                name="password"
                type="password"
                minLength={8}
                placeholder="At least 8 characters"
              />
            </label>
          )}
          {status && <p className="form-status">{status}</p>}
          <button className="primary-btn auth-submit" disabled={busy}>
            {busy ? "Please wait..." : mode === "forgot" ? "Send reset URL" : "Change password"}
          </button>
        </form>
        <button
          className="back-link"
          onClick={() => navigate(mode === "forgot" ? "login" : "login")}
        >
          {mode === "forgot" ? "Back to log in" : "Continue"}
        </button>
      </section>
    </main>
  );
}
