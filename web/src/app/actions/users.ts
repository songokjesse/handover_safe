"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import * as z from "zod";

const registerUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["support_worker", "team_leader", "manager", "admin"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type RegisterUserFields = z.infer<typeof registerUserSchema>;

export async function registerUser(fields: RegisterUserFields) {
  // 1. Authenticate caller and verify they are an admin
  const userSupabase = await createServerClient();
  const {
    data: { user: currentUser },
  } = await userSupabase.auth.getUser();

  if (!currentUser) {
    return { success: false, error: "Unauthenticated. Please log in." };
  }

  // Get current user's profile role
  const { data: profile, error: profileError } = await userSupabase
    .from("users")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return { success: false, error: "Unauthorized. Admin privileges required." };
  }

  // 2. Validate input fields using Zod
  const validation = registerUserSchema.safeParse(fields);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const { email, password, fullName, role } = validation.data;

  // 3. Register user via Supabase Auth Admin API
  const adminSupabase = createAdminClient();
  const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email for easy worker setup
    user_metadata: { full_name: fullName },
  });

  if (authError || !authUser.user) {
    return { success: false, error: authError?.message || "Failed to create authentication user." };
  }

  // 4. Create public profile record
  const { error: dbError } = await adminSupabase.from("users").insert({
    id: authUser.user.id,
    full_name: fullName,
    email,
    role,
    status: "active",
  });

  if (dbError) {
    // Attempt clean up of auth user to maintain consistency
    await adminSupabase.auth.admin.deleteUser(authUser.user.id);
    return { success: false, error: dbError.message || "Failed to create public user profile." };
  }

  return { success: true };
}
