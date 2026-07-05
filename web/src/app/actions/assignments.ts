"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import * as z from "zod";

const assignSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  houseId: z.string().uuid("Invalid house ID"),
});

export async function assignUserToHouse(userId: string, houseId: string) {
  // 1. Authenticate caller and verify they are an admin/manager
  const userSupabase = await createServerClient();
  const { data: { user: currentUser } } = await userSupabase.auth.getUser();

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

  // 2. Validate input
  const validation = assignSchema.safeParse({ userId, houseId });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  // 3. Insert assignment using Supabase Admin Client (bypasses RLS)
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase
    .from("user_house_assignments")
    .insert({
      user_id: userId,
      house_id: houseId,
      assigned_by: currentUser.id,
      status: "active",
    });

  if (error) {
    // Check for unique constraint violation (code 23505)
    if (error.code === '23505') {
       return { success: false, error: "User is already assigned to this house." };
    }
    return { success: false, error: error.message || "Failed to assign user." };
  }

  return { success: true };
}

export async function removeUserFromHouse(assignmentId: string) {
  // 1. Authenticate caller and verify they are an admin/manager
  const userSupabase = await createServerClient();
  const { data: { user: currentUser } } = await userSupabase.auth.getUser();

  if (!currentUser) {
    return { success: false, error: "Unauthenticated. Please log in." };
  }

  const { data: profile } = await userSupabase
    .from("users")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "manager")) {
    return { success: false, error: "Unauthorized. Admin privileges required." };
  }

  // 2. Delete assignment using Supabase Admin Client
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase
    .from("user_house_assignments")
    .delete()
    .eq("id", assignmentId);

  if (error) {
    return { success: false, error: error.message || "Failed to remove assignment." };
  }

  return { success: true };
}
