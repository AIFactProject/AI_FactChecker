import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";


export const signInWithPassword = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signUpWithEmail = (
  email: string,
  password: string,
  displayName: string,
  emailRedirectTo: string,
) =>
  supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo,
    },
  });

export const signInWithGoogle = (redirectTo: string) =>
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

export const signOut = () => supabase.auth.signOut();

export const getSession = () => supabase.auth.getSession();

export const updatePassword = (password: string) =>
  supabase.auth.updateUser({ password });

export const requestPasswordReset = (email: string, redirectTo: string) =>
  supabase.auth.resetPasswordForEmail(email, { redirectTo });

export const exchangeCodeForSession = (code: string) =>
  supabase.auth.exchangeCodeForSession(code);

export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) => supabase.auth.onAuthStateChange(callback);


export async function getAccessToken(): Promise<string> {
    const { data, error } = await getSession();

    if (error || !data.session?.access_token) {
        throw new Error("Your session has expired. Please sign in again.");
    }

    return data.session.access_token;
}