import React, { useMemo, useState } from "react";
import { Bell, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppointments } from "../context/AppointmentsContext";

const statusStyles = {
  "In progress": "bg-amber-50 text-amber-700",
  Done: "bg-emerald-50 text-emerald-700",
  Delayed: "bg-red-50 text-red-700",
  Scheduled: "bg-blue-50 text-blue-700",
};

const dotStyles = {
  "In progress": "bg-amber-500",
  Done: "bg-emerald-600",
  Delayed: "bg-red-600",
  Scheduled: "bg-blue-600",
};

const rowAccent = {
  "In progress": "bg-amber-400",
  Done: "bg-emerald-500",
  Delayed: "bg-red-500",
  Scheduled: "bg-blue-500",
};

const technicians = [
  { initials: "CR", name: "Carlos R.", jobs: 2, total: 3, avatar: "bg-indigo-100 text-indigo-600", bar: "bg-amber-500" },
  { initials: "FK", name: "Fatuma K.", jobs: 3, total: 3, avatar: "bg-emerald-100 text-emerald-600", bar: "bg-emerald-500" },
  { initials: "DO", name: "David O.", jobs: 1, total: 3, avatar: "bg-emerald-100 text-emerald-600", bar: "bg-emerald-500" },
  { initials: "MN", name: "Moses N.", jobs: 1, total: 3, avatar: "bg-red-100 text-red-600", bar: "bg-amber-500" },
];

// Builds the 7-day strip starting from `baseDate` (a "YYYY-MM-DD" string),
// each entry carrying its own ISO date so it can be matched against
// appointment.date.
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

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold ${statusStyles[status]}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} />
      {status}
    </span>
  );
}



export default function AppointmentsPage() {
  const { appointments, BASE_DATE } = useAppointments();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedIso, setSelectedIso] = useState(BASE_DATE);

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
        .sort((a, b) => (a.time24 < b.time24 ? -1 : 1)),
    [appointments, selectedIso]
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="px-8 py-6">
        {/* Date nav row */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWeekOffset((w) => w - 7)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
            <span className="text-lg font-bold">{formatHeaderDate(selectedIso)}</span>
            <button
              onClick={() => setWeekOffset((w) => w + 7)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left: schedule */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5.5 py-4.5">
              <h2 className="text-base font-bold">Today's schedule</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[13px] font-semibold text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {todaysAppointments.length} appointment{todaysAppointments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div>
              {todaysAppointments.length === 0 && (
                <div className="px-5.5 py-10 text-center text-sm text-slate-400">
                  No appointments booked for this day yet.
                </div>
              )}
              {todaysAppointments.map((a, i) => (
                <div
                  key={a.id}
                  className={`flex items-center gap-4.5 px-5.5 py-4.5 ${
                    i < todaysAppointments.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <div className="w-11 text-[15px] font-bold text-slate-900">{a.time}</div>
                  <div className={`w-[3px] self-stretch rounded-full ${rowAccent[a.status]}`} />
                  <div className="flex-1">
                    <div className="text-[15px] font-bold">{a.name}</div>
                    <div className="mt-0.5 text-[13.5px] text-slate-500">{a.detail}</div>
                  </div>
                  <StatusPill status={a.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            {/* Upcoming */}
            <div className="rounded-2xl border border-slate-200 bg-white px-5.5 py-4.5">
              <h2 className="mb-4 text-base font-bold">Upcoming (next 7 days)</h2>
              <div className="flex justify-between">
                {week.map((d) => {
                  const isActive = d.iso === selectedIso;
                  const count = countsByDate[d.iso] || null;
                  return (
                    <button
                      key={d.iso}
                      onClick={() => setSelectedIso(d.iso)}
                      className="flex flex-col items-center gap-1 px-0.5 py-1"
                    >
                      <span className={`text-xs font-semibold ${isActive ? "text-orange-500" : "text-slate-400"}`}>
                        {d.label}
                      </span>
                      <span className={`text-[17px] font-bold ${isActive ? "text-orange-500" : "text-slate-900"}`}>
                        {d.date}
                      </span>
                      <span className={`text-xs font-semibold ${isActive ? "text-orange-500" : "text-slate-400"}`}>
                        {count ?? "—"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technician availability — stays static for now; wire this up
                once technicians are assigned to real appointment records. */}
            <div className="rounded-2xl border border-slate-200 bg-white px-5.5 py-4.5">
              <h2 className="mb-4 text-base font-bold">Technician availability</h2>
              <div className="flex flex-col gap-4.5">
                {technicians.map((t, i) => (
                  <div key={i}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-7.5 w-7.5 items-center justify-center rounded-full text-[11px] font-bold ${t.avatar}`}
                        >
                          {t.initials}
                        </div>
                        <span className="text-[14.5px] font-semibold">{t.name}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-slate-400">
                        {t.jobs}/{t.total} jobs
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${t.bar}`}
                        style={{ width: `${(t.jobs / t.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}