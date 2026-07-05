import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

export default async function HousesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch houses the user is assigned to.
  // Because of our RLS policies, we could just query `houses` directly 
  // and it will only return assigned houses (or all if admin).
  const { data: houses, error } = await supabase
    .from("houses")
    .select("id, name, location")
    .eq("status", "active")
    .order("name");

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Select a House</h1>
        <p className="text-slate-500 mt-2">
          Choose a house below to start your shift and access checklists.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200 mb-6">
          Failed to load houses. Please try again.
        </div>
      )}

      {houses && houses.length === 0 && !error && (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-lg">
          <h3 className="text-lg font-medium text-slate-900 mb-2">No houses assigned</h3>
          <p className="text-slate-500">
            You are not currently assigned to any active houses. Please contact your manager.
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {houses?.map((house) => (
          <Card key={house.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{house.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                {house.location || "Location not specified"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href={`/shifts/new?houseId=${house.id}`}
                className={buttonVariants({ className: "w-full justify-between group" })}
              >
                Start Shift
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
