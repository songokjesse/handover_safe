"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ShiftType = "AM" | "PM" | "Night" | "Custom";

export interface ActiveShift {
  id: string;
  house_id: string;
  shift_type: ShiftType;
  start_time: string;
  status: string;
}

interface ActiveShiftContextType {
  activeShift: ActiveShift | null;
  setActiveShift: (shift: ActiveShift | null) => void;
  isLoading: boolean;
}

const ActiveShiftContext = createContext<ActiveShiftContextType | undefined>(undefined);

export function ActiveShiftProvider({ children }: { children: React.ReactNode }) {
  const [activeShift, setActiveShiftState] = useState<ActiveShift | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from local storage on mount (or you can fetch from DB)
    const stored = localStorage.getItem("activeShift");
    if (stored) {
      try {
        setActiveShiftState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse active shift from local storage");
      }
    }
    setIsLoading(false);
  }, []);

  const setActiveShift = (shift: ActiveShift | null) => {
    setActiveShiftState(shift);
    if (shift) {
      localStorage.setItem("activeShift", JSON.stringify(shift));
    } else {
      localStorage.removeItem("activeShift");
    }
  };

  return (
    <ActiveShiftContext.Provider value={{ activeShift, setActiveShift, isLoading }}>
      {children}
    </ActiveShiftContext.Provider>
  );
}

export function useActiveShift() {
  const context = useContext(ActiveShiftContext);
  if (context === undefined) {
    throw new Error("useActiveShift must be used within an ActiveShiftProvider");
  }
  return context;
}
