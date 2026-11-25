import { useState } from "react";
import type { FormEvent } from "react";
import type { Page } from "../../common/types";
import { Icon } from "../../common/Icon";
import { Logo } from "../../common/Logo";
import { signInWithPassword, signUpWithEmail, signInWithGoogle } from "../../api/supabase/supabaseAuth";
export function AuthPage({ mode, navigate }: { mode: "login" | "register"; navigate: (p: Page) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const result =
      mode === "login"
        ? await signInWithPassword(email, password)
        : await signUpWithEmail(
            email,
            password,
            String(form.get("displayName")),
            `${window.location.origin}/?page=confirm-email`,
          );
    setBusy(false);
    if (result.error) {
      setError(result.error.message);
    } else if (mode === "login") {
      navigate("results");
    } else {
      setSubmitted(true);
    }
  };
  const google = async () => {
    setError("");
    const { error: authError } = await signInWithGoogle(`${window.location.origin}/?page=login`);
    if (authError) setError(authError.message);
  };
  return (
    <main className="auth-page">
      <section className="auth-brand">
        <Logo onClick={() => navigate("home")} />
        <div>
          <div className="auth-art">
            <span>明</span>
            <i className="ring r1" />
            <i className="ring r2" />
            <i className="dot d1" />
            <i className="dot d2" />
          </div>
          <blockquote>
            “The truth is rarely simple.
            <br />
            Understanding it can be.”
          </blockquote>
          <p>AI-assisted verification, grounded in evidence.</p>
        </div>
        <small>© 2025 Mingence. Responsible AI for informed decisions.</small>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-form">
          <span className="auth-kicker">{mode === "login" ? "WELCOME BACK" : "GET STARTED"}</span>
          <h1>{mode === "login" ? "Log in to Mingence" : "Create your account"}</h1>
          <p>
            {mode === "login"
              ? "Continue where you left off."
              : "Start verifying information with greater clarity."}
          </p>
          {submitted ? (
            <div className="success-message">
              <span>
                <Icon name="check" />
              </span>
              <h2>{mode === "login" ? "Welcome back." : "Check your email"}</h2>
              <p>
                {mode === "login"
                  ? "Your workspace is ready."
                  : "Check your email to confirm your account, then log in."}
              </p>
              <button
                className="primary-btn"
                onClick={() => navigate(mode === "login" ? "results" : "login")}
              >
                {mode === "login" ? "View last analysis" : "Return to log in"}{" "}
                <Icon name="arrow" size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <button type="button" className="google-btn" onClick={google}>
                <Icon name="google" size={20} /> Continue with Google
              </button>
              <div className="or">
                <span>or continue with email</span>
              </div>
              {mode === "register" && (
                <label>
                  Display name
                  <input required name="displayName" placeholder="How others will see you" />
                </label>
              )}
              <label>
                Email address
                <input required name="email" type="email" placeholder="you@example.com" />
              </label>
              <label>
                <span>
                  Password{" "}
                  {mode === "login" && (
                    <button type="button" onClick={() => navigate("forgot-password")}>
                      Forgot password?
                    </button>
                  )}
                </span>
                <input
                  required
                  name="password"
                  type="password"
                  minLength={8}
                  placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="primary-btn auth-submit" disabled={busy}>
                {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}{" "}
                {!busy && <Icon name="arrow" size={18} />}
              </button>
              {mode === "register" && (
                <small className="terms">
                  By creating an account, you agree to our Terms and Privacy Policy.
                </small>
              )}
            </form>
          )}
          <p className="auth-switch">
            {mode === "login" ? "New to Mingence?" : "Already have an account?"}{" "}
            <button onClick={() => navigate(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
