import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Page } from "./types";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { signOut } from "../api/supabase/supabaseAuth";
export function Header({
  page,
  navigate,
  user,
}: {
  page: Page;
  navigate: (page: Page) => void;
  user: User | null;
}) {
  const [open, setOpen] = useState(false);
  const go = (target: Page) => {
    navigate(target);
    setOpen(false);
  };
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Logo onClick={() => go("home")} />
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <Icon name={open ? "x" : "menu"} />
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <button
            onClick={() => {
              go("home");
              setTimeout(
                () => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" }),
                50,
              );
            }}
          >
            How it works
          </button>
          <button className={page === "pricing" ? "active" : ""} onClick={() => go("pricing")}>
            Pricing
          </button>
          <button className="mobile-account-link" onClick={() => go(user ? "profile" : "login")}>
            {user ? "Profile" : "Log in"}
          </button>
          <button
            className="mobile-account-link"
            onClick={async () => {
              if (user) {
                await signOut();
                go("home");
              } else {
                go("register");
              }
            }}
          >
            {user ? "Log out" : "Create account"}
          </button>
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <button className="text-btn" onClick={() => go("profile")}>
                Profile
              </button>
              <button
                className="primary-btn small"
                onClick={async () => {
                  await signOut();
                  go("home");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button className="text-btn" onClick={() => go("login")}>
                Log in
              </button>
              <button className="primary-btn small" onClick={() => go("register")}>
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
