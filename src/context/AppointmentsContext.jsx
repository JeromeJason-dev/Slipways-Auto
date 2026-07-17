import React, { createContext, useContext, useState, useCallback } from "react";

const AppointmentsContext = createContext(null);

// Single source of truth for "today" so booking, the customer view, and the
// admin week-strip all agree on what "today" / "tomorrow" means.
export const BASE_DATE = "2026-07-17";

// Canonical appointment shape — this is what gets created by the booking
// form and consumed by both the customer and admin views:
// {
//   id, service, serviceIncludes, durationMinutes, vehicle,
//   date ("YYYY-MM-DD"), time ("HH:MM" 24hr),
//   status: "upcoming" | "completed" | "in-progress" | "delayed",
//   technician, location, contactName, contactPhone, contactEmail,
// }
const INITIAL_APPOINTMENTS = [
  {
    id: "1", service: "Oil Change", serviceIncludes: null, durationMinutes: 30,
    vehicle: "2023 BMW M3", date: "2026-07-17", time: "10:30", status: "upcoming",
    technician: "Mike Otieno", location: "Slipways Auto — Westlands Bay",
    contactName: "Jordan Lee", contactPhone: "", contactEmail: "",
  },
  {
    id: "2", service: "Brake Service", serviceIncludes: null, durationMinutes: 90,
    vehicle: "2021 Toyota Corolla", date: "2026-07-19", time: "14:00", status: "upcoming",
    technician: "Sarah Njeri", location: "Slipways Auto — Westlands Bay",
    contactName: "Amaya Otieno", contactPhone: "", contactEmail: "",
  },
  {
    id: "3", service: "Full Inspection", serviceIncludes: null, durationMinutes: 45,
    vehicle: "2023 BMW M3", date: "2026-06-28", time: "09:00", status: "completed",
    technician: "Mike Otieno", location: "Slipways Auto — Westlands Bay",
    contactName: "Jordan Lee", contactPhone: "", contactEmail: "",
  },
  {
    id: "4", service: "Tire Rotation", serviceIncludes: null, durationMinutes: 30,
    vehicle: "2020 Mazda CX-5", date: "2026-07-17", time: "13:15", status: "in-progress",
    technician: "Carlos R.", location: "Slipways Auto — Westlands Bay",
    contactName: "Priya Shah", contactPhone: "", contactEmail: "",
  },
  {
    id: "5", service: "Engine Diagnostics", serviceIncludes: null, durationMinutes: 60,
    vehicle: "2019 Honda Civic", date: "2026-07-17", time: "15:45", status: "delayed",
    technician: "Moses N.", location: "Slipways Auto — Westlands Bay",
    contactName: "Tom Baraza", contactPhone: "", contactEmail: "",
  },
];

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  // Called by the booking form. Adding it here means it instantly shows up
  // on both the customer's appointments page and the admin dashboard,
  // since they both read from this same context.
  const addAppointment = useCallback((appointment) => {
    setAppointments((prev) =>
      prev.some((a) => a.id === appointment.id) ? prev : [appointment, ...prev]
    );
  }, []);

  const updateAppointmentStatus = useCallback((id, status) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

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