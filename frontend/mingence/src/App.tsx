
import { useEffect, useState, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import type { Page, PaidPlan } from "./common/types";
import type { HistoryItem } from "./models/resultModel";

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

import {
    getSession,
    onAuthStateChange,
} from "./api/supabase/supabaseAuth";

import { getUserInfo } from "./models/userInfoModel";

  
interface Route {
    page: Page;
    inputClaimId: string | null;
}

function getRoute(): Route {
    const params = new URLSearchParams(window.location.search);

    const page = (params.get("page") ?? "home") as Page;
    const inputClaimId = params.get("id");

    // Results must always have an input claim ID.
    if (page === "results" && !inputClaimId) {
        return {
            page: "verify",
            inputClaimId: null,
        };
    }

    return {
        page,
        inputClaimId,
    };
}

export default function App() {
    const initialRoute = getRoute();

    const [page, setPage] = useState<Page>(initialRoute.page);
    const [inputClaimId, setInputClaimId] = useState<string | null>(
        initialRoute.inputClaimId
    );
    
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PaidPlan>("Premium");

    const [historyItems, setHistoryItems] = useState<HistoryItem[] | null>(null);
    const [claimCount, setClaimCount] = useState<number | null>(null);

    const handleHistoryChange = (items: HistoryItem[]) => {
        setHistoryItems(items);
        setClaimCount(items.length);
    };

    // Prevent the initial session response from overwriting
    // a newer authentication event.
    const authEventReceived = useRef(false);

    // Navigation
    const navigate = (target: Page, id?: string) => {

        // Results must have an input claim ID.
        if (target === "results" && !id) {
            console.error("An input claim ID is required for the results page.");
            return;
        }

        const params = new URLSearchParams();

        if (target !== "home") {
            params.set("page", target);
        }

        if (id) {
            params.set("id", id);
        }

        const url = params.toString()
            ? `?${params.toString()}`
            : window.location.pathname;

        window.history.pushState({}, "", url);

        setPage(target);
        setInputClaimId(id ?? null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Authentication: restore session and listen for auth changes.
    useEffect(() => {
        let mounted = true;

        getSession()
            .then(({ data, error }) => {
                if (!mounted || authEventReceived.current) return;

                if (error) {
                    console.error("Failed to retrieve session:", error);
                    return;
                }

                const currentUser = data.session?.user ?? null;

                setUser(currentUser);

                if (
                    data.session &&
                    (initialRoute.page === "login" ||
                        initialRoute.page === "register")
                ) {
                    navigate("verify");
                }
            })
            .catch((error) => {
                console.error("Session restoration failed:", error);
            });

        const {
            data: { subscription },
        } = onAuthStateChange((event, session) => {

            authEventReceived.current = true;

            setUser(session?.user ?? null);

            if (event === "PASSWORD_RECOVERY") {
                navigate("reset-password");
            }

            if (event === "SIGNED_IN") {
                setPage((current) => {
                    if (current === "login") {
                        navigate("verify");
                        return "verify";
                    }

                    return current;
                });
            }
        });

        // Browser back/forward navigation.
        const onPopState = () => {
            const route = getRoute();

            setPage(route.page);
            setInputClaimId(route.inputClaimId);
        };

        window.addEventListener("popstate", onPopState);

        return () => {
            mounted = false;
            subscription.unsubscribe();
            window.removeEventListener("popstate", onPopState);
        };
    }, []);

    // Retrieve the authenticated user's role from the backend.
    useEffect(() => {
        let active = true;

        const fetchUserRole = async () => {

            if (!user) {
                setRole(null);
                setRoleLoading(false);
                return;
            }

            setRoleLoading(true);

            try {
                const { data, error } = await getSession();

                if (error) {
                    throw error;
                }

                const accessToken = data.session?.access_token;

                if (!accessToken) {
                    throw new Error("Access token is unavailable.");
                }

                const response = await getUserInfo(accessToken);

                console.debug(
                    response.message + " : " + response.role
                );

                if (active) {
                    setRole(response.role);
                }

            } catch (error) {
                console.error("Failed to retrieve user role:", error);

                if (active) {
                    setRole(null);
                }

            } finally {
                if (active) {
                    setRoleLoading(false);
                }
            }
        };

        fetchUserRole();

        return () => {
            active = false;
        };
    }, [user?.id]);

    // Header visibility
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
            {showHeader && (
                <Header
                    page={page}
                    navigate={navigate}
                    user={user}
                />
            )}

            {page === "home" && (
                <HomePage navigate={navigate} />
            )}

            {page === "verify" && (
                <VerifyPage
                    key={inputClaimId ?? "new"}
                    inputClaimId={inputClaimId}
                    navigate={navigate}
                    onComplete={(id) => {
                        navigate("results", id);
                    }}
                    historyItems={historyItems}
                    onHistoryChange={handleHistoryChange}
                />
            )}

            {page === "results" && inputClaimId && (
                <ResultsPage
                    key={inputClaimId}
                    inputClaimId={inputClaimId}
                    navigate={navigate}
                    onEdit={() => {
                        navigate("verify", inputClaimId);
                    }}
                    historyItems={historyItems}
                    onHistoryChange={handleHistoryChange}
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

            {page === "login" && (
                <AuthPage
                    mode="login"
                    navigate={navigate}
                />
            )}

            {page === "register" && (
                <AuthPage
                    mode="register"
                    navigate={navigate}
                />
            )}

            {page === "forgot-password" && (
                <SimpleAuthPage
                    mode="forgot"
                    navigate={navigate}
                />
            )}

            {page === "reset-password" && (
                <SimpleAuthPage
                    mode="reset"
                    navigate={navigate}
                />
            )}

            {page === "confirm-email" && (
                <EmailConfirmationPage navigate={navigate} />
            )}

            {page === "profile" && (
                <ProfilePage
                    user={user}
                    navigate={navigate}
                />
            )}

            {["about", "contact", "privacy", "terms"].includes(page) && (
                <InfoPage
                    page={page}
                    navigate={navigate}
                />
            )}

            {page === "payment" && (
                <PaymentPage
                    plan={selectedPlan}
                    navigate={navigate}
                />
            )}

            {page === "payment-success" && (
                <PaymentSuccess
                    plan={selectedPlan}
                    navigate={navigate}
                />
            )}
        </div>
    );
}
