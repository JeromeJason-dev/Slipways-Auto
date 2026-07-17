import React, { useMemo, useState } from "react";
import { Bell, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppointments } from "../context/AppointmentsContext";
import { useAuth } from "../context/AuthContext";

// Maps the real appointment.status values onto display labels/styles.
const STATUS_DISPLAY = {
  pending: { label: "Pending", pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500", accent: "bg-amber-400" },
  upcoming: { label: "Scheduled", pill: "bg-blue-50 text-blue-700", dot: "bg-blue-600", accent: "bg-blue-500" },
  in_progress: { label: "In Progress", pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500", accent: "bg-amber-400" },
  completed: { label: "Done", pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-600", accent: "bg-emerald-500" },
  cancelled: { label: "Cancelled", pill: "bg-red-50 text-red-700", dot: "bg-red-600", accent: "bg-red-500" },
  declined: { label: "Declined", pill: "bg-red-50 text-red-700", dot: "bg-red-600", accent: "bg-red-500" },
};

const EDITABLE_STATUSES = [
  { value: "upcoming", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

function StatusSelect({ status, onChange }) {
  const display = STATUS_DISPLAY[status] || STATUS_DISPLAY.upcoming;
  return (
    <div className="relative inline-block w-auto shrink-0">
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none cursor-pointer rounded-full pl-4 pr-7 py-1.5 text-[13px] font-semibold outline-none w-full ${display.pill}`}
      >
        {EDITABLE_STATUSES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronRight
        size={12}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 opacity-60"
      />
    </div>
  );
}

function buildWeek(baseDate, offset) {
  const start = new Date(`${baseDate}T00:00:00`);
  start.setDate(start.getDate() + offset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return {
      iso,
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
    };
  });
}

function formatHeaderDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function StatusPill({ status }) {
  const display = STATUS_DISPLAY[status] || STATUS_DISPLAY.upcoming;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold shrink-0 ${display.pill}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${display.dot}`} />
      {display.label}
    </span>
  );
}

export default function AppointmentsPage() {
  const { appointments, BASE_DATE, approveAppointment, declineAppointment, updateAppointmentStatus } =
    useAppointments();
  const { isAdmin } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedIso, setSelectedIso] = useState(BASE_DATE);

  const pendingAppointments = useMemo(
    () => appointments.filter((a) => a.status === "pending"),
    [appointments]
  );

  const week = useMemo(() => buildWeek(BASE_DATE, weekOffset), [BASE_DATE, weekOffset]);

  const countsByDate = useMemo(() => {
    const map = {};
    for (const a of appointments) map[a.date] = (map[a.date] || 0) + 1;
    return map;
  }, [appointments]);

  const todaysAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date === selectedIso)
        .sort((a, b) => (a.time < b.time ? -1 : 1)),
    [appointments, selectedIso]
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased">
      {/* Dynamic shell spacing: smaller padding on mobile, generous padding on desktop */}
      <div className="px-4 py-4 md:px-8 md:py-6 max-w-7xl mx-auto">
        
        {/* Date nav row */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setWeekOffset((w) => w - 7)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white active:scale-95 transition-transform hover:bg-slate-50"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
              {formatHeaderDate(selectedIso)}
            </h1>
            <button
              onClick={() => setWeekOffset((w) => w + 7)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white active:scale-95 transition-transform hover:bg-slate-50"
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Pending Approvals Section */}
        {isAdmin && pendingAppointments.length > 0 && (
          <div className="mb-5 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-amber-200 px-4 py-3.5 md:px-5.5">
              <h2 className="text-sm md:text-base font-bold text-amber-800">Pending approvals</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs md:text-[13px] font-semibold text-amber-800 whitespace-nowrap">
                {pendingAppointments.length} awaiting review
              </span>
            </div>
            <div className="divide-y divide-amber-200/70">
              {pendingAppointments.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-3 p-4 md:p-5.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm md:text-[15px] font-bold text-slate-900 break-words">
                      {a.service} — {a.vehicle}
                    </div>
                    <div className="mt-0.5 text-xs md:text-[13.5px] text-slate-500">
                      {a.contactName} · {a.date} at {formatTime(a.time)}
                    </div>
                  </div>
                  {/* Buttons group is full width on tiny mobile devices */}
                  <div className="flex items-center gap-2 sm:w-auto w-full">
                    <button
                      onClick={() => approveAppointment(a.id)}
                      className="flex-1 sm:flex-initial text-center justify-center rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-700 whitespace-nowrap"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => declineAppointment(a.id)}
                      className="flex-1 sm:flex-initial text-center justify-center rounded-lg border border-red-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-red-700 transition-colors hover:bg-red-50 whitespace-nowrap"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main layout grid */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          
          {/* Left Block: Today's Schedule */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm order-2 lg:order-1">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-4 md:px-5.5">
              <h2 className="text-sm md:text-base font-bold">Today's schedule</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs md:text-[13px] font-semibold text-blue-700 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {todaysAppointments.length} appointment{todaysAppointments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {todaysAppointments.length === 0 && (
                <div className="px-5.5 py-12 text-center text-sm text-slate-400">
                  No appointments booked for this day yet.
                </div>
              )}
              {todaysAppointments.map((a) => {
                const display = STATUS_DISPLAY[a.status] || STATUS_DISPLAY.upcoming;
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-4 md:gap-4.5 md:p-5.5"
                  >
                    {/* Timestamp alignment */}
                    <div className="w-14 md:w-16 shrink-0 text-sm md:text-[15px] font-bold text-slate-900">
                      {formatTime(a.time)}
                    </div>
                    
                    {/* Accent border pill */}
                    <div className={`w-[3px] self-stretch rounded-full shrink-0 ${display.accent}`} />
                    
                    {/* Content area */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-sm md:text-[15px] font-bold truncate text-slate-900">
                        {a.service}
                        {a.serviceIncludes ? ` (${a.serviceIncludes.join(", ")})` : ""}
                      </div>
                      <div className="mt-0.5 text-xs md:text-[13.5px] text-slate-500 truncate">
                        {a.contactName ? `${a.contactName} · ` : ""}
                        {a.vehicle}
                        {a.technician ? ` · ${a.technician}` : ""}
                      </div>
                    </div>
                    
                    {/* Interactive Selector or Display Tag */}
                    <div className="shrink-0 max-w-[130px] sm:max-w-none">
                      {isAdmin && EDITABLE_STATUSES.some((opt) => opt.value === a.status) ? (
                        <StatusSelect
                          status={a.status}
                          onChange={(newStatus) => updateAppointmentStatus(a.id, newStatus)}
                        />
                      ) : (
                        <StatusPill status={a.status} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Block: Upcoming Panel Calendar */}
          <div className="flex flex-col gap-5 order-1 lg:order-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5.5 shadow-sm">
              <h2 className="mb-3.5 text-sm md:text-base font-bold">Upcoming (next 7 days)</h2>
              
              {/* Responsive Calendar Carousel Container: Scrollable horizontally on small viewports, full width grid on large */}
              <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex min-w-[420px] sm:min-w-0 sm:grid sm:grid-cols-7 justify-between gap-1">
                  {week.map((d) => {
                    const isActive = d.iso === selectedIso;
                    const count = countsByDate[d.iso] || null;
                    return (
                      <button
                        key={d.iso}
                        onClick={() => setSelectedIso(d.iso)}
                        className={`flex flex-col items-center gap-0.5 rounded-xl py-2 px-1 flex-1 sm:flex-initial transition-colors ${
                          isActive ? "bg-orange-50/70" : "hover:bg-slate-50"
                        }`}
                      >
                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${isActive ? "text-orange-600" : "text-slate-400"}`}>
                          {d.label}
                        </span>
                        <span className={`text-base md:text-[17px] font-extrabold my-0.5 ${isActive ? "text-orange-600" : "text-slate-900"}`}>
                          {d.date}
                        </span>
                        <span className={`text-[11px] font-bold min-w-[18px] text-center px-1 rounded ${
                          isActive ? "text-orange-600/80" : "text-slate-400 bg-slate-100/80"
                        }`}>
                          {count ?? "—"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}