"use client";

import * as React from "react";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type ChecklistStatus = "done" | "not_done" | "not_applicable" | null;

interface ChecklistItemProps {
  id: string;
  itemName: string;
  description?: string;
  isRequired: boolean;
  status: ChecklistStatus;
  comment?: string;
  onStatusChange: (id: string, status: ChecklistStatus) => void;
  onCommentChange: (id: string, comment: string) => void;
}

export function ChecklistItem({
  id,
  itemName,
  description,
  isRequired,
  status,
  comment,
  onStatusChange,
  onCommentChange,
}: ChecklistItemProps) {
  return (
    <Card className={`overflow-hidden transition-colors ${status === "done" ? "border-green-200 bg-green-50/50" : status === "not_done" ? "border-red-200 bg-red-50/50" : ""}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <h4 className="text-base font-semibold leading-none flex items-center gap-2">
              {itemName}
              {isRequired && <span className="text-red-500 text-sm font-normal">*</span>}
            </h4>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onStatusChange(id, "done")}
              className={`p-2 rounded-full transition-colors flex items-center justify-center
                ${status === "done" ? "bg-green-100 text-green-700 ring-2 ring-green-600 ring-offset-1" : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"}`}
              title="Mark as Done"
            >
              <CheckCircle2 className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => onStatusChange(id, "not_done")}
              className={`p-2 rounded-full transition-colors flex items-center justify-center
                ${status === "not_done" ? "bg-red-100 text-red-700 ring-2 ring-red-600 ring-offset-1" : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"}`}
              title="Mark as Not Done"
            >
              <XCircle className="w-6 h-6" />
            </button>
            {!isRequired && (
              <button
                type="button"
                onClick={() => onStatusChange(id, "not_applicable")}
                className={`p-2 rounded-full transition-colors flex items-center justify-center
                  ${status === "not_applicable" ? "bg-slate-800 text-white ring-2 ring-slate-800 ring-offset-1" : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"}`}
                title="Mark as Not Applicable"
              >
                <MinusCircle className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Comment input, mandatory if 'not_done', optional if 'not_applicable', hidden if 'done' */}
        {(status === "not_done" || status === "not_applicable") && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <label htmlFor={`comment-${id}`} className="block text-sm font-medium mb-1.5 text-slate-700">
              {status === "not_done" ? (
                <span>Reason (Required) <span className="text-red-500">*</span></span>
              ) : (
                "Comment (Optional)"
              )}
            </label>
            <Input
              id={`comment-${id}`}
              value={comment || ""}
              onChange={(e) => onCommentChange(id, e.target.value)}
              placeholder={status === "not_done" ? "Explain why this was not done..." : "Add a note..."}
              className={`w-full ${status === "not_done" && !comment?.trim() ? "border-red-300 focus-visible:ring-red-500" : ""}`}
              required={status === "not_done"}
            />
            {status === "not_done" && !comment?.trim() && (
              <p className="text-xs text-red-500 mt-1.5">You must provide a reason when marking an item as Not Done.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
