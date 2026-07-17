import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const AppointmentsContext = createContext(null);

// Single source of truth for "today"
export const BASE_DATE = "2026-07-17";

export function AppointmentsProvider({ children }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  // Helper to determine the storage namespace
  const getUserKey = useCallback(() => user?.uid || "anonymous", [user]);

  // Dynamically load user-specific appointments when user logs in/out
  useEffect(() => {
    const userKey = getUserKey();
    const saved = localStorage.getItem(`appointments_${userKey}`);
    
    // Default to an empty list if no local records exist yet
    setAppointments(saved ? JSON.parse(saved) : []);
  }, [user, getUserKey]);

  // Add new appointment and sync to localStorage
  const addAppointment = useCallback((appointment) => {
    setAppointments((prev) => {
      if (prev.some((a) => a.id === appointment.id)) return prev;
      
      const updated = [appointment, ...prev];
      localStorage.setItem(`appointments_${getUserKey()}`, JSON.stringify(updated));
      return updated;
    });
  }, [getUserKey]);

  // Update appointment details/status and sync to localStorage
  const updateAppointmentStatus = useCallback((id, status) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem(`appointments_${getUserKey()}`, JSON.stringify(updated));
      return updated;
    });
  }, [getUserKey]);

  return (
    <AppointmentsContext.Provider
      value={{ appointments, addAppointment, updateAppointmentStatus, BASE_DATE }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments must be used within an AppointmentsProvider");
  return ctx;
}