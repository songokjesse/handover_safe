"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ToastProvider, useToast } from "@/components/ui/toast";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
}

function DashboardContent() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select("id, full_name, email, role, status")
            .eq("id", user.id)
            .single();

          if (error) {
            toast({
              title: "Profile Load Failed",
              description: error.message,
              type: "destructive",
            });
          } else if (data) {
            setProfile(data as UserProfile);
          }
        }
      } catch {
        toast({
          title: "System Error",
          description: "Failed to authenticate session.",
          type: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [supabase, toast]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Logout Failed",
          description: error.message,
          type: "destructive",
        });
      } else {
        toast({
          title: "Logged Out",
          description: "Successfully signed out of your session.",
          type: "success",
        });
        router.refresh();
        router.push("/login");
      }
    } catch {
      toast({
        title: "Logout Error",
        description: "An unexpected error occurred during logout.",
        type: "destructive",
      });
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "manager":
        return "Manager";
      case "team_leader":
        return "Team Leader";
      default:
        return "Support Worker";
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 select-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-extrabold select-none">HandoverSafe</CardTitle>
            <CardDescription className="select-none">Shift Verification & Accountability Dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground select-none">
                <div className="w-6 h-6 rounded-full border-3 border-muted border-t-primary animate-spin" />
                <span>Loading active session profile...</span>
              </div>
            ) : profile ? (
              <div className="space-y-4">
                <div className="border border-border rounded-lg bg-card/50 p-4 space-y-3">
                  <div className="flex justify-between border-b border-border/50 pb-2.5">
                    <span className="text-sm text-muted-foreground select-none">Full Name</span>
                    <span className="font-semibold text-foreground select-text">{profile.full_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2.5">
                    <span className="text-sm text-muted-foreground select-none">Email Address</span>
                    <span className="font-semibold text-foreground select-text">{profile.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2.5">
                    <span className="text-sm text-muted-foreground select-none">System Role</span>
                    <span className="font-semibold text-foreground select-none">{getRoleLabel(profile.role)}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-sm text-muted-foreground select-none">Account Status</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-success select-none">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      {profile.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {profile.role === "admin" && (
                    <Button onClick={() => router.push("/admin/users")} className="w-full">
                      Go to Admin Console
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground select-none">
                Session expired. Redirecting to login...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
