"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useActiveShift } from "@/context/ActiveShiftContext";
import { ChecklistItem, ChecklistStatus } from "@/components/ChecklistItem";
import { Button } from "@/components/ui/button";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { LogOut, ArrowRight, Save, CheckSquare } from "lucide-react";

interface Template {
  id: string;
  section: string;
  item_name: string;
  description: string;
  is_required: boolean;
  order_index: number;
}

interface ResponseState {
  id?: string;
  status: ChecklistStatus;
  comment: string;
}

function DashboardContent() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const { activeShift, setActiveShift, isLoading: shiftLoading } = useActiveShift();

  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [responses, setResponses] = React.useState<Record<string, ResponseState>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    async function loadData() {
      if (!activeShift) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      // Fetch templates
      const { data: templateData, error: templateError } = await supabase
        .from("checklist_templates")
        .select("*")
        .eq("status", "active")
        .order("order_index");

      if (templateError) {
        toast({ title: "Error loading templates", description: templateError.message, type: "destructive" });
      } else {
        setTemplates(templateData || []);
      }

      // Fetch existing responses for this shift
      const { data: responseData, error: responseError } = await supabase
        .from("checklist_responses")
        .select("*")
        .eq("shift_id", activeShift.id);

      if (responseError) {
        toast({ title: "Error loading responses", description: responseError.message, type: "destructive" });
      } else if (responseData) {
        const responseMap: Record<string, ResponseState> = {};
        responseData.forEach((r) => {
          responseMap[r.checklist_template_id] = {
            id: r.id,
            status: r.status as ChecklistStatus,
            comment: r.comment || "",
          };
        });
        setResponses(responseMap);
      }
      setIsLoading(false);
    }
    loadData();
  }, [activeShift, supabase, toast]);

  const handleStatusChange = (templateId: string, status: ChecklistStatus) => {
    setResponses((prev) => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        status,
        comment: status === "done" ? "" : prev[templateId]?.comment || "",
      },
    }));
  };

  const handleCommentChange = (templateId: string, comment: string) => {
    setResponses((prev) => ({
      ...prev,
      [templateId]: { ...prev[templateId], comment },
    }));
  };

  const handleSave = async () => {
    if (!activeShift) return;

    // Validate required fields
    const missingRequired = templates.some(
      (t) => t.is_required && (!responses[t.id]?.status || responses[t.id].status === null)
    );
    if (missingRequired) {
      toast({ title: "Incomplete", description: "Please complete all required items.", type: "destructive" });
      return;
    }

    const missingComments = Object.values(responses).some(
      (r) => r.status === "not_done" && !r.comment.trim()
    );
    if (missingComments) {
      toast({ title: "Missing Reason", description: "Please provide a reason for all 'Not Done' items.", type: "destructive" });
      return;
    }

    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const upsertData = Object.entries(responses)
        .filter(([_, state]) => state.status !== null)
        .map(([templateId, state]) => ({
          ...(state.id ? { id: state.id } : {}), // include id if it exists (for update)
          shift_id: activeShift.id,
          checklist_template_id: templateId,
          status: state.status,
          comment: state.comment || null,
          completed_by: user.id,
        }));

      if (upsertData.length > 0) {
        const { error } = await supabase.from("checklist_responses").upsert(upsertData, { onConflict: "shift_id,checklist_template_id" });
        if (error) throw error;
      }

      toast({ title: "Saved", description: "Checklist progress saved successfully.", type: "success" });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, type: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveShift(null);
    router.push("/login");
  };

  // Group templates by section
  const sections = Array.from(new Set(templates.map((t) => t.section)));

  if (shiftLoading) return <div className="p-8 text-center text-slate-500">Loading session...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <CheckSquare className="w-6 h-6" />
            HandoverSafe
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-slate-800">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {!activeShift ? (
          <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ready for your shift?</h1>
            <p className="text-slate-500 mt-3 max-w-md mx-auto mb-8 text-lg">
              You don't have an active shift right now. Select a house and start a shift to access your checklist.
            </p>
            <Button size="lg" onClick={() => router.push("/houses")} className="rounded-full px-8">
              Start a Shift <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading checklist...</div>
        ) : (
          <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shift Checklist</h1>
              <p className="text-slate-500 mt-2">
                Shift: {activeShift.shift_type} • Started: {new Date(activeShift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {sections.map((section) => (
              <div key={section} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">{section}</h2>
                <div className="space-y-4">
                  {templates
                    .filter((t) => t.section === section)
                    .map((template) => (
                      <ChecklistItem
                        key={template.id}
                        id={template.id}
                        itemName={template.item_name}
                        description={template.description}
                        isRequired={template.is_required}
                        status={responses[template.id]?.status || null}
                        comment={responses[template.id]?.comment}
                        onStatusChange={handleStatusChange}
                        onCommentChange={handleCommentChange}
                      />
                    ))}
                </div>
              </div>
            ))}

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg flex justify-center z-10">
              <div className="max-w-4xl w-full flex justify-end">
                <Button size="lg" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Progress
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
