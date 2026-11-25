import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Page, PaidPlan } from "./common/types";
import { Header } from "./common/Header";
import { HomePage } from "./pages/home/HomePage";
import { VerifyPage } from "./pages/verify/VerifyPage";
import { ResultsPage } from "./pages/results/ResultsPage";
import { PricingPage } from "./pages/pricing/PricingPage";
import { AuthPage } from "./pages/auth/AuthPage";
import { SimpleAuthPage } from "./pages/auth/SimpleAuthPage";
import { EmailConfirmationPage } from "./pages/auth/EmailConfirmationPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { InfoPage } from "./pages/info/InfoPage";
import { PaymentPage, PaymentSuccess } from "./pages/payment/PaymentPage";
import { getSession, onAuthStateChange } from "./api/supabase/supabaseAuth";

export default function App() {
  const initialPage = new URLSearchParams(window.location.search).get("page") as Page | null;
  const [page, setPage] = useState<Page>(initialPage ?? "home");
  const [claim, setClaim] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaidPlan>("Premium");
  const navigate = (target: Page) => {
    setPage(target);
    const url = target === "home" ? window.location.pathname : `?page=${target}`;
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session && (initialPage === "login" || initialPage === "register")) {
        setPage("results");
        window.history.replaceState({}, "", "?page=results");
      }
    });
    const {
      data: { subscription },
    } = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") setPage("reset-password");
      if (event === "SIGNED_IN") {
        setPage((current) => (current === "login" ? "results" : current));
      }
    });
    const onPopState = () => {
      const next = new URLSearchParams(window.location.search).get("page") as Page | null;
      setPage(next ?? "home");
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
  const showHeader = ![
    "results",
    "login",
    "register",
    "forgot-password",
    "reset-password",
    "confirm-email",
    "payment",
    "payment-success",
  ].includes(page);
  return (
    <div className="app">
      {showHeader && <Header page={page} navigate={navigate} user={user} />}
      {page === "home" && <HomePage navigate={navigate} />}
      {page === "verify" && (
        <VerifyPage
          initialClaim={claim}
          navigate={navigate}
          onComplete={(text) => {
            setClaim(text);
            navigate("results");
          }}
        />
      )}
      {page === "results" && (
        <ResultsPage
          navigate={navigate}
          onEdit={() => {
            if (!claim) {
              setClaim(
                "Global average sea level has risen by more than 20 centimetres since 1900.",
              );
            }
            navigate("verify");
          }}
        />
      )}
      {page === "pricing" && (
        <PricingPage
          navigate={navigate}
          onChoose={(plan) => {
            setSelectedPlan(plan);
            navigate("payment");
          }}
        />
      )}
      {page === "login" && <AuthPage mode="login" navigate={navigate} />}
      {page === "register" && <AuthPage mode="register" navigate={navigate} />}
      {page === "forgot-password" && <SimpleAuthPage mode="forgot" navigate={navigate} />}
      {page === "reset-password" && <SimpleAuthPage mode="reset" navigate={navigate} />}
      {page === "confirm-email" && <EmailConfirmationPage navigate={navigate} />}
      {page === "profile" && <ProfilePage user={user} navigate={navigate} />}
      {["about", "contact", "privacy", "terms"].includes(page) && (
        <InfoPage page={page} navigate={navigate} />
      )}
      {page === "payment" && <PaymentPage plan={selectedPlan} navigate={navigate} />}
      {page === "payment-success" && <PaymentSuccess plan={selectedPlan} navigate={navigate} />}
    </div>
  );
}
