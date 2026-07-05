"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { createHouse } from "@/app/actions/houses";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { ArrowLeft, Home, MapPin, Plus } from "lucide-react";

interface House {
  id: string;
  name: string;
  location: string | null;
  status: string;
}

const formSchema = z.object({
  name: z.string().min(2, "House name is required"),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function AdminHousesContent() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  
  const [houses, setHouses] = React.useState<House[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", location: "" },
  });

  const loadHouses = React.useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("houses")
      .select("id, name, location, status")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load houses", type: "destructive" });
    } else {
      setHouses(data || []);
    }
    setIsLoading(false);
  }, [supabase, toast]);

  React.useEffect(() => {
    loadHouses();
  }, [loadHouses]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const result = await createHouse(data);

    if (result.success) {
      toast({ title: "Success", description: "House created successfully", type: "success" });
      reset();
      loadHouses(); // Refresh the list
    } else {
      toast({ title: "Error", description: result.error || "Failed to create house", type: "destructive" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Houses</h1>
            <p className="text-slate-500 text-sm">Create and manage SIL houses in the system</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Create House Form */}
          <div className="md:col-span-1">
            <Card>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" /> Add New House
                  </CardTitle>
                  <CardDescription>Enter the details for a new house location.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">House Name <span className="text-red-500">*</span></label>
                    <Input {...register("name")} placeholder="e.g. Main Street House" disabled={isSubmitting} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location (Optional)</label>
                    <Input {...register("location")} placeholder="e.g. Brisbane North" disabled={isSubmitting} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create House"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Houses List */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Current Houses</h2>
            
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-xl bg-white">
                Loading houses...
              </div>
            ) : houses.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-xl bg-white">
                <Home className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                <p>No houses exist in the database yet.</p>
                <p className="text-sm mt-1">Use the form to create your first house!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {houses.map((house) => (
                  <Card key={house.id} className="bg-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{house.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {house.location || "No location specified"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                        <span className={`w-1.5 h-1.5 rounded-full ${house.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                        {house.status.charAt(0).toUpperCase() + house.status.slice(1)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function AdminHousesPage() {
  return (
    <ToastProvider>
      <AdminHousesContent />
    </ToastProvider>
  );
}
