import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-3aca330f/health", (c) => {
  return c.json({ status: "ok" });
});

app.delete("/make-server-3aca330f/account", async (c) => {
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!serviceRoleKey || !supabaseUrl) {
    return c.json({ error: "Account deletion is not configured." }, 503);
  }

  const accessToken = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!accessToken) return c.json({ error: "Authentication required." }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const {
    data: { user },
    error: userError,
  } = await admin.auth.getUser(accessToken);
  if (userError || !user) return c.json({ error: "Invalid session." }, 401);

  const source = `${user.id}:${user.email ?? ""}:${user.user_metadata?.display_name ?? ""}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const deletedAt = new Date().toISOString();
  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
    email: `deleted+${hash.slice(0, 24)}@deleted.mingence.invalid`,
    user_metadata: { display_name: hash, soft_deleted_at: deletedAt },
    app_metadata: { ...user.app_metadata, soft_deleted: true },
    ban_duration: "876000h",
  });
  if (updateError) return c.json({ error: "Could not anonymise this account." }, 500);

  await kv.set(`soft_deleted:${user.id}`, { hash, deletedAt });
  return c.json({ success: true });
});

Deno.serve(app.fetch);
