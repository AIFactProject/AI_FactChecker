import { useEffect, useState } from "react";
import type { Page } from "../../common/types";
import { Icon } from "../../common/Icon";
import { Logo } from "../../common/Logo";
import { getSession, exchangeCodeForSession } from "../../api/supabase/supabaseAuth";
export function EmailConfirmationPage({ navigate }: { navigate: (p: Page) => void }) {
  const [state, setState] = useState<"checking" | "confirmed" | "error">("checking");
  const [message, setMessage] = useState("Confirming your email address securely...");
  useEffect(() => {
    const confirm = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      let { data } = await getSession();
      if (!data.session && code) {
        const { error } = await exchangeCodeForSession(code);
        if (error) {
          setState("error");
          setMessage("This confirmation link is invalid or has expired.");
          return;
        }
        ({ data } = await getSession());
      }
      if (data.session) {
        setState("confirmed");
        setMessage("Your email has been confirmed. Your Mingence account is ready.");
      } else {
        setState("error");
        setMessage("This confirmation link is invalid or has expired.");
      }
    };
    window.setTimeout(confirm, 250);
  }, []);
  return (
    <main className="single-auth-page">
      <Logo onClick={() => navigate("home")} />
      <section className="single-auth-card confirmation-card">
        <span className={`confirmation-icon ${state}`}>
          {state === "checking" ? (
            <Icon name="clock" />
          ) : (
            <Icon name={state === "confirmed" ? "check" : "x"} />
          )}
        </span>
        <span className="auth-kicker">EMAIL CONFIRMATION</span>
        <h1>
          {state === "checking"
            ? "Checking your link"
            : state === "confirmed"
              ? "Email confirmed"
              : "We couldn’t confirm your email"}
        </h1>
        <p>{message}</p>
        {state !== "checking" && (
          <button
            className="primary-btn auth-submit"
            onClick={() => navigate(state === "confirmed" ? "results" : "register")}
          >
            {state === "confirmed" ? "Continue to your workspace" : "Create an account"}
          </button>
        )}
      </section>
    </main>
  );
}
