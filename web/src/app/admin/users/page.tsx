"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser, RegisterUserFields } from "@/app/actions/users";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ToastProvider, useToast } from "@/components/ui/toast";

const userFormSchema = z.object({
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

type UserFormSchema = z.infer<typeof userFormSchema>;

interface DBUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

function AdminUsersContent() {
  const supabase = createClient();
  const { toast } = useToast();
  const [users, setUsers] = React.useState<DBUser[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: "support_worker",
    },
  });

  const fetchUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, role, status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          type: "destructive",
        });
      } else if (data) {
        setUsers(data as DBUser[]);
      }
    } catch {
      toast({
        title: "System Error",
        description: "Failed to load user records.",
        type: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [supabase, toast]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onSubmit = async (data: UserFormSchema) => {
    setIsSubmitting(true);
    try {
      const response = await registerUser(data);

      if (response.success) {
        toast({
          title: "User Created",
          description: `Successfully registered profile for ${data.fullName}`,
          type: "success",
        });
        reset();
        fetchUsers();
      } else {
        toast({
          title: "Failed to Create User",
          description: response.error,
          type: "destructive",
        });
      }
    } catch {
      toast({
        title: "Server Error",
        description: "An unexpected error occurred during registration.",
        type: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "manager":
        return "bg-warning/10 text-warning border-warning/20";
      case "team_leader":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-success/10 text-success border-success/20";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 select-none">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground select-none">
          Admin Console
        </h1>
        <p className="text-muted-foreground select-none">
          Create staff authentication accounts and assign system-wide user roles.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Registration Form Card */}
        <div className="lg:col-span-1">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Register Staff Account</CardTitle>
              <CardDescription>
                Create credentials. Registered users can sign in immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  disabled={isSubmitting}
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john.doe@handoversafe.com.au"
                  disabled={isSubmitting}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground select-none">
                    System Role
                  </label>
                  <select
                    disabled={isSubmitting}
                    className="flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    {...register("role")}
                  >
                    <option value="support_worker">Support Worker</option>
                    <option value="team_leader">Team Leader</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                  {errors.role && (
                    <p className="text-sm font-medium text-destructive mt-0.5 select-none">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <Input
                  label="Temporary Password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  error={errors.password?.message}
                  {...register("password")}
                />

                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Existing Users Table Card */}
        <div className="lg:col-span-2">
          <Card className="border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Accounts</CardTitle>
                <CardDescription>
                  Active staff users registered on HandoverSafe.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchUsers} disabled={isLoadingUsers}>
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground select-none">
                  <div className="w-8 h-8 rounded-full border-4 border-muted border-t-primary animate-spin" />
                  <span>Loading account records...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground select-none border border-dashed border-border rounded-lg">
                  No registered users found.
                </div>
              ) : (
                <div className="overflow-x-auto border border-border rounded-lg bg-card">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">
                          Full Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border text-sm">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground select-text">
                            {user.full_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-muted-foreground select-text">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {user.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-success" />
                              <span className="capitalize text-foreground font-medium select-none">
                                {user.status}
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <ToastProvider>
      <AdminUsersContent />
    </ToastProvider>
  );
}
