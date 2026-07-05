"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { useActiveShift } from "@/context/ActiveShiftContext";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const shiftSchema = z.object({
  shift_type: z.enum(["AM", "PM", "Night", "Custom"]),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().optional(),
});

type ShiftFormValues = z.infer<typeof shiftSchema>;

function ShiftForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const houseId = searchParams.get("houseId");
  const { setActiveShift } = useActiveShift();
  const supabase = createClient();
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      shift_type: "AM",
      // Set default start time to now
      start_time: new Date().toISOString().slice(0, 16),
    },
  });

  if (!houseId) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
        Missing house selection. Please go back and select a house.
        <Button variant="link" onClick={() => router.push("/houses")} className="ml-2 px-0">
          Return to Houses
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: ShiftFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Not authenticated");

      // Insert the shift
      const { data: shift, error: shiftError } = await supabase
        .from("shifts")
        .insert({
          house_id: houseId,
          user_id: userData.user.id,
          shift_type: data.shift_type,
          start_time: new Date(data.start_time).toISOString(),
          end_time: data.end_time ? new Date(data.end_time).toISOString() : null,
          status: "active",
        })
        .select()
        .single();

      if (shiftError) {
        if (shiftError.message.includes("User already has an active shift")) {
          throw new Error("You already have an active shift. Please complete or cancel it first.");
        }
        throw shiftError;
      }

      // Update global context
      setActiveShift({
        id: shift.id,
        house_id: shift.house_id,
        shift_type: shift.shift_type,
        start_time: shift.start_time,
        status: shift.status
      });

      // Redirect to checklist or dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Start New Shift</CardTitle>
          <CardDescription>Select your shift type and confirm the start time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Shift Type</label>
            <select
              {...register("shift_type")}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
              <option value="Night">Night</option>
              <option value="Custom">Custom</option>
            </select>
            {errors.shift_type && <p className="text-sm text-red-500">{errors.shift_type.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Start Time</label>
            <Input type="datetime-local" {...register("start_time")} />
            {errors.start_time && <p className="text-sm text-red-500">{errors.start_time.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Expected End Time (Optional)</label>
            <Input type="datetime-local" {...register("end_time")} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/houses")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Starting..." : "Start Shift"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default function NewShiftPage() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Suspense fallback={<div className="p-4 text-center">Loading shift form...</div>}>
        <ShiftForm />
      </Suspense>
    </div>
  );
}
