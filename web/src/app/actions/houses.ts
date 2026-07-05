"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import * as z from "zod";

const createHouseSchema = z.object({
  name: z.string().min(2, "House name must be at least 2 characters long"),
  location: z.string().optional(),
});

export type CreateHouseFields = z.infer<typeof createHouseSchema>;

export async function createHouse(fields: CreateHouseFields) {
  // 1. Authenticate caller and verify they are an admin/manager
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

  if (profileError || !profile || (profile.role !== "admin" && profile.role !== "manager")) {
    return { success: false, error: "Unauthorized. Admin privileges required." };
  }

  // 2. Validate input fields using Zod
  const validation = createHouseSchema.safeParse(fields);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const { name, location } = validation.data;

  // 3. Insert house using Supabase Admin Client (bypasses RLS)
  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase
    .from("houses")
    .insert({
      name,
      location,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message || "Failed to create house." };
  }

  return { success: true, house: data };
}
