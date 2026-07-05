"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { assignUserToHouse, removeUserFromHouse } from "@/app/actions/assignments";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { ArrowLeft, UserPlus, UserMinus, ShieldAlert } from "lucide-react";

interface House {
  id: string;
  name: string;
  location: string | null;
  status: string;
}

interface User {
  id: string;
  full_name: string;
  role: string;
}

interface Assignment {
  id: string;
  user_id: string;
  users: {
    full_name: string;
    role: string;
  };
}

export default function HouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  
  // Unwrap params using React.use
  const { id: houseId } = React.use(params);

  const [house, setHouse] = React.useState<House | null>(null);
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAssigning, setIsAssigning] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState("");

  const loadData = React.useCallback(async () => {
    setIsLoading(true);

    // 1. Fetch House details
    const { data: houseData, error: houseError } = await supabase
      .from("houses")
      .select("*")
      .eq("id", houseId)
      .single();

    if (houseError || !houseData) {
      toast({ title: "Error", description: "Failed to load house details.", type: "destructive" });
      setIsLoading(false);
      return;
    }
    setHouse(houseData);

    // 2. Fetch current assignments with user details
    const { data: assignmentData, error: assignmentError } = await supabase
      .from("user_house_assignments")
      .select(`
        id, 
        user_id,
        users ( full_name, role )
      `)
      .eq("house_id", houseId)
      .eq("status", "active");

    if (!assignmentError && assignmentData) {
      setAssignments(assignmentData as any);
    }

    // 3. Fetch all active users (to populate dropdown)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, full_name, role")
      .eq("status", "active");

    if (!userError && userData) {
      setAllUsers(userData);
    }

    setIsLoading(false);
  }, [houseId, supabase, toast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAssign = async () => {
    if (!selectedUserId) return;
    setIsAssigning(true);
    
    const result = await assignUserToHouse(selectedUserId, houseId);
    
    if (result.success) {
      toast({ title: "Assigned", description: "Worker successfully assigned to house.", type: "success" });
      setSelectedUserId("");
      loadData();
    } else {
      toast({ title: "Assignment Failed", description: result.error || "Unknown error occurred.", type: "destructive" });
    }
    
    setIsAssigning(false);
  };

  const handleRemove = async (assignmentId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${userName} from this house?`)) return;
    
    const result = await removeUserFromHouse(assignmentId);
    if (result.success) {
      toast({ title: "Removed", description: "Worker removed from house.", type: "success" });
      loadData();
    } else {
      toast({ title: "Removal Failed", description: result.error || "Unknown error occurred.", type: "destructive" });
    }
  };

  // Filter out users who are already assigned
  const assignedUserIds = assignments.map(a => a.user_id);
  const assignableUsers = allUsers.filter(u => !assignedUserIds.includes(u.id));

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin/houses")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isLoading ? "Loading..." : house?.name || "House Details"}
              </h1>
              <p className="text-slate-500 text-sm">
                {house?.location ? `Location: ${house.location}` : "Manage house assignments"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Assign New Worker Form */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" /> Assign Worker
                  </CardTitle>
                  <CardDescription>Select a worker to assign to this house.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Worker</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      disabled={isLoading || isAssigning || assignableUsers.length === 0}
                    >
                      <option value="">-- Choose a worker --</option>
                      {assignableUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.full_name} ({user.role.replace('_', ' ')})
                        </option>
                      ))}
                    </select>
                    {assignableUsers.length === 0 && !isLoading && (
                      <p className="text-xs text-slate-500 mt-1">All active users are already assigned to this house.</p>
                    )}
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleAssign} 
                    disabled={!selectedUserId || isAssigning}
                  >
                    {isAssigning ? "Assigning..." : "Assign Worker"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Assigned Workers List */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Assigned Workers</h2>
              
              {isLoading ? (
                <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-xl bg-white">
                  Loading assignments...
                </div>
              ) : assignments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-xl bg-white">
                  <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                  <p>No workers are currently assigned to this house.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Worker Name</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {assignments.map((assignment) => (
                        <tr key={assignment.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {assignment.users?.full_name || "Unknown User"}
                          </td>
                          <td className="px-4 py-3 text-slate-500 capitalize">
                            {assignment.users?.role?.replace('_', ' ') || "Unknown"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                              onClick={() => handleRemove(assignment.id, assignment.users?.full_name)}
                            >
                              <UserMinus className="w-4 h-4 mr-1.5" /> Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
