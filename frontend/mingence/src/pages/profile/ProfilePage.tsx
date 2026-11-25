import { useState } from "react";
import type { FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import type { Page } from "../../common/types";
import { ContentPage } from "../../common/ContentPage";
import { updatePassword } from "../../api/supabase/supabaseAuth";
// import { updatePassword, getSession, signOut } from "../../api/supabase/supabaseAuth";
//import { supabase } from "../../config/config";
export function ProfilePage({ user, navigate }: { user: User | null; navigate: (p: Page) => void }) {
  const [message, setMessage] = useState("");
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password"));
    const { error } = await updatePassword(password);
    setMessage(error?.message ?? "Password updated successfully.");
    if (!error) e.currentTarget.reset();
  };
  // const softDelete = async () => {
  //   const { data } = await getSession();
  //   const response = await fetch(
  //     `${supabaseProjectUrl}/functions/v1/make-server-3aca330f/account`,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${data.session?.access_token}`,
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );
  //   if (!response.ok) {
  //     const body = await response.json().catch(() => ({}));
  //     setMessage(body.error ?? "Account deletion is unavailable. Please contact support.");
  //     return;
  //   }
  //   await signOut();
  //   navigate("home");
  // };
  if (!user) {
    return (
      <ContentPage title="Your profile" eyebrow="ACCOUNT">
        <p>Please log in to view or update your profile.</p>
        <button className="primary-btn" onClick={() => navigate("login")}>
          Log in
        </button>
      </ContentPage>
    );
  }
  return (
    <main className="profile-page">
      <div className="profile-shell">
        <div className="profile-heading">
          <span className="section-label">ACCOUNT SETTINGS</span>
          <h1>Your profile</h1>
          <p>Manage your Mingence account and security.</p>
        </div>
        <div className="profile-grid">
          <section className="settings-card">
            <h2>Profile details</h2>
            <dl>
              <div>
                <dt>Display name</dt>
                <dd>{user.user_metadata.display_name || "Not set"}</dd>
              </div>
              <div>
                <dt>Email address</dt>
                <dd>{user.email}</dd>
              </div>
            </dl>
          </section>
          <section className="settings-card">
            <h2>Change password</h2>
            <form onSubmit={changePassword}>
              <label>
                New password
                <input
                  required
                  name="password"
                  minLength={8}
                  type="password"
                  placeholder="At least 8 characters"
                />
              </label>
              <button className="primary-btn">Update password</button>
            </form>
          </section>
          {/*
            <section className="settings-card danger-card">
            <h2>Delete account</h2>
            <p>
            Soft deletion anonymises your display name and email with non-reversible hashes,
            disables access and retains only the record needed for integrity.
            </p>
            {!confirmDelete ? (
              <button className="danger-btn" onClick={() => setConfirmDelete(true)}>
              Delete my account
              </button>
              ) : (
                <div className="delete-confirm">
                <strong>This cannot be undone. Continue?</strong>
                <button className="danger-btn" onClick={softDelete}>
                Yes, anonymise my account
                </button>
                <button onClick={() => setConfirmDelete(false)}>Cancel</button>
                </div>
                )}
            </section>
          */}
        </div>
        {message && <p className="profile-message">{message}</p>}
      </div>
    </main>
  );
}
