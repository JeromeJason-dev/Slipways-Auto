import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

const AppointmentsContext = createContext(null);

// Single source of truth for "today"
export const BASE_DATE = "2026-07-17";

// A default technician roster. Kept here so both the admin dashboard and
// any other consumer (e.g. a future booking form) can share the same list.
export const TECHNICIANS = ["Mike Otieno", "Sarah Njeri", "James Kariuki", "Grace Wambui"];

// One shared "table" for every booking, regardless of which user placed it.
// This is what lets the admin dashboard see bookings the moment a user
// submits them, instead of each user only ever seeing their own copy.
const STORAGE_KEY = "slipways_appointments_all";

function loadAll() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load appointments", e);
    return [];
  }
}

function saveAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function AppointmentsProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const [allAppointments, setAllAppointments] = useState(() => loadAll());

  // Keep other tabs/windows (e.g. an admin and a customer open side by side)
  // in sync with each other.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setAllAppointments(loadAll());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((updater) => {
    setAllAppointments((prev) => {
      const updated = typeof updater === "function" ? updater(prev) : updater;
      saveAll(updated);
      return updated;
    });
  }, []);

  // Every new booking starts life as "pending" — it only becomes a
  // confirmed appointment once an admin approves it. We force this here
  // so no caller can accidentally skip the approval step.
  const addAppointment = useCallback(
    (appointment) => {
      persist((prev) => {
        if (prev.some((a) => a.id === appointment.id)) return prev;
        return [{ ...appointment, status: "pending" }, ...prev];
      });
    },
    [persist]
  );

  const updateAppointmentStatus = useCallback(
    (id, status) => {
      persist((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    },
    [persist]
  );

  const updateAppointment = useCallback(
    (id, changes) => {
      persist((prev) => prev.map((a) => (a.id === id ? { ...a, ...changes } : a)));
    },
    [persist]
  );

  const cancelAppointment = useCallback(
    (id) => {
      persist((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
    },
    [persist]
  );

  // Approval / decline are admin-only actions. Approval now requires (and
  // records) a technician assignment in the same atomic update, so an
  // appointment can never end up "upcoming" without someone assigned to it.
  const approveAppointment = useCallback(
    (id, technician) => {
      if (!isAdmin) return;
      if (!technician) {
        console.warn("approveAppointment called without a technician; ignoring.");
        return;
      }
      persist((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "upcoming", technician } : a
        )
      );
    },
    [persist, isAdmin]
  );

  // Lets an admin reassign the technician on an already-approved (or any)
  // appointment without touching its status.
  const assignTechnician = useCallback(
    (id, technician) => {
      if (!isAdmin) return;
      persist((prev) =>
        prev.map((a) => (a.id === id ? { ...a, technician } : a))
      );
    },
    [persist, isAdmin]
  );

  const declineAppointment = useCallback(
    (id) => {
      if (!isAdmin) return;
      persist((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "declined" } : a))
      );
    },
    [persist, isAdmin]
  );

  // Admins see every booking (so they can triage/approve). Regular users
  // only ever see their own.
  const appointments = useMemo(() => {
    if (isAdmin) return allAppointments;
    if (!user?.uid) return [];
    return allAppointments.filter((a) => a.uid === user.uid);
  }, [allAppointments, isAdmin, user?.uid]);

  const pendingCount = useMemo(
    () => allAppointments.filter((a) => a.status === "pending").length,
    [allAppointments]
  );

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        allAppointments,
        pendingCount,
        technicians: TECHNICIANS,
        addAppointment,
        updateAppointmentStatus,
        updateAppointment,
        cancelAppointment,
        approveAppointment,
        assignTechnician,
        declineAppointment,
        BASE_DATE,
      }}
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