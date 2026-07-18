import { useEffect, useRef, useState } from "react";
import { Bell, Plus, X, CalendarClock, Wrench, PackageX } from "lucide-react";
import { PAGE_META } from "../utils/constants";
import { useData } from "../context/DataContext";
import { useAppointments } from "../context/AppointmentsContext";

const STATUS_TONE = {
  Complete: "bg-emerald-50 text-emerald-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Scheduled: "bg-blue-50 text-blue-700",
};

const APPT_STATUS_TONE = {
  pending: "bg-amber-50 text-amber-700",
  upcoming: "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  declined: "bg-red-50 text-red-700",
};

function timeAgoOrDate(dateStr) {
  return dateStr || "—";
}

function NotificationModal({ onClose, appointments, workOrders, lowStock }) {
  const panelRef = useRef(null);

  // Close on Escape, and on click outside the panel
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  // Only bookings still awaiting admin review belong here — once approved/
  // declined they're no longer "new" and shouldn't clutter notifications.
  // Newest bookings first — this is what makes a just-submitted booking
  // show up at the top of the list.
  const recentAppointments = appointments
    .filter((a) => a.status === "pending")
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 5);

  const openWorkOrders = workOrders.filter((w) => w.status !== "Complete").slice(0, 5);

  return (
    <div className="absolute right-6 top-14 z-50 w-[380px] max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg" ref={panelRef}>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sticky top-0 bg-white">
        <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          aria-label="Close notifications"
        >
          <X size={15} />
        </button>
      </div>

      {/* Appointments */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <CalendarClock size={12} />
          Appointments
        </div>
        {recentAppointments.length === 0 ? (
          <p className="text-xs text-slate-400">No pending appointments.</p>
        ) : (
          <div className="space-y-2">
            {recentAppointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="font-medium text-slate-800 truncate">
                    {a.contactName || "Customer"} · {a.service}
                  </div>
                  <div className="text-slate-400">
                    {timeAgoOrDate(a.date)}
                    {a.time ? ` · ${a.time}` : ""}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                    APPT_STATUS_TONE[a.status] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work orders */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Wrench size={12} />
          Work order status
        </div>
        {openWorkOrders.length === 0 ? (
          <p className="text-xs text-slate-400">No open work orders.</p>
        ) : (
          <div className="space-y-2">
            {openWorkOrders.map((w) => (
              <div key={w.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="font-medium text-slate-800 truncate">
                    {w.id} · {w.vehicle}
                  </div>
                  <div className="text-slate-400">Due {w.due}</div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    STATUS_TONE[w.status] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory */}
      <div className="px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <PackageX size={12} />
          Inventory status
        </div>
        {lowStock.length === 0 ? (
          <p className="text-xs text-slate-400">All parts sufficiently stocked.</p>
        ) : (
          <div className="space-y-2">
            {lowStock.slice(0, 5).map((item) => (
              <div key={item.sku} className="flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="font-medium text-slate-800 truncate">{item.name}</div>
                  <div className="text-slate-400">{item.sku}</div>
                </div>
                <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                  {item.stock} left
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Topbar({ page, saveState, openWOModal, newWOBtnRef }) {
  const { data, derived } = useData();
  // allAppointments is the shared store every booking actually lands in
  // (AppointmentsContext / localStorage "slipways_appointments_all"), so
  // this is what stays in sync with what BookingPage writes — unlike
  // data.appointments, which only ever holds the static seed data.
  const { allAppointments, pendingCount } = useAppointments();
  const [notifOpen, setNotifOpen] = useState(false);

  // Checks PAGE_META first. If the specific page key doesn't exist,
  // it safely falls back to custom Appointments metadata instead of the dashboard.
  const meta = PAGE_META[page] || {
    title: "Appointments",
    breadcrumb: "Management / Appointments",
  };

  const workOrders = data?.workOrders || [];
  const lowStock = derived?.lowStock || [];

  const notificationCount = pendingCount + lowStock.length;
  const hasNotifications = notificationCount > 0;

  return (
    <div className="relative bg-white border-b border-slate-100 px-6 h-14 flex items-center justify-between flex-shrink-0 shadow-xs">
      <div>
        <div className="text-lg font-semibold text-slate-900">{meta.title}</div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          {meta.breadcrumb}
          {saveState !== "idle" && (
            <span className="text-teal-600 font-medium" aria-live="polite">
              · {saveState === "saving" ? "Saving…" : "Saved"}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((open) => !open)}
            className="w-9 h-9 rounded-xl border border-slate-100 bg-white flex items-center justify-center relative text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <Bell size={15} />
            {hasNotifications && (
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
            )}
          </button>
          {notifOpen && (
            <NotificationModal
              onClose={() => setNotifOpen(false)}
              appointments={allAppointments}
              workOrders={workOrders}
              lowStock={lowStock}
            />
          )}
        </div>
        <button
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
          ref={newWOBtnRef}
          onClick={openWOModal}
        >
          <Plus size={14} /> New work order
        </button>
      </div>
    </div>
  );
}