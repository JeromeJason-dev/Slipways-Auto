import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Wrench,
  Bell,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Car,
  MapPin,
  ChevronRight,
  Package,
  X,
  User,
  Paperclip,
  ExternalLink,
  CalendarPlus,
  Ban,
  Check,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/context/AppointmentsContext";

// Added 'uid' to mock data to simulate user ownership.
const MOCK_APPOINTMENTS = [
  {
    id: "1",
    uid: "mock_user_123",
    service: "Oil Change",
    vehicle: "2023 BMW M3",
    date: "2026-07-17",
    time: "10:30",
    durationMinutes: 30,
    status: "upcoming",
    price: "5000",
    technician: "Mike Otieno",
    location: "Slipways Auto — Westlands Bay",
    notes: "Please arrive 10 minutes early. Drop-off is available if you can't wait on-site.",
    attachments: [{ name: "Service-Checklist.pdf" }],
  },
  {
    id: "2",
    uid: "mock_user_123",
    service: "Brake Service",
    vehicle: "2021 Toyota Corolla",
    date: "2026-07-19",
    time: "14:00",
    durationMinutes: 90,
    status: "upcoming",
    price: "10000",
    technician: "Sarah Njeri",
    location: "Slipways Auto — Westlands Bay",
    notes: "Your vehicle will need to stay most of the day. A courtesy shuttle is available on request.",
    attachments: [],
  },
  {
    id: "3",
    uid: "another_user_456",
    service: "Full Inspection",
    vehicle: "2023 BMW M3",
    date: "2026-06-28",
    time: "09:00",
    durationMinutes: 45,
    status: "completed",
    price: "20000",
    technician: "Mike Otieno",
    location: "Slipways Auto — Westlands Bay",
    notes: "",
    attachments: [{ name: "Inspection-Report.pdf" }],
  },
];

const SERVICE_ICON = {
  "Oil Change": Wrench,
  "Brake Service": Car,
  "Tire Rotation": Car,
  "Full Inspection": Car,
  "Engine Diagnostics": Wrench,
};

const SLOT_TIMES = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00"];

function getReminder(dateStr, timeStr, status) {
  if (status === "pending") return { label: "Pending approval", tone: "pending" };
  if (status === "declined") return { label: "Declined", tone: "urgent" };
  if (status === "cancelled") return { label: "Cancelled", tone: "urgent" };

  const target = new Date(`${dateStr}T${timeStr}`);
  const now = new Date();
  const diffMs = target - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) return { label: "Completed", tone: "done" };
  if (diffDays <= 0) return { label: "Today", tone: "urgent" };
  if (diffDays === 1) return { label: "Tomorrow", tone: "urgent" };
  if (diffDays <= 3) return { label: `In ${diffDays} days`, tone: "soon" };
  return { label: `In ${diffDays} days`, tone: "later" };
}

function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
function formatDateLong(dateStr) {
  return new Date(`${dateStr}T00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Global fixed date declaration
const dateObj = new Date();
function formatTime(timeStr) {
  const [h, m] = timeStr.split(":");
  dateObj.setHours(Number(h), Number(m));
  return dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const TONE_STYLES = {
  urgent: "bg-[#C81E2C]/10 text-[#C81E2C] border-[#C81E2C]/20",
  soon: "bg-[#e6c9c5]/40 text-[#7a1f1f] border-[#e6c9c5]",
  later: "bg-[#f6eeed] text-[#8a5a52] border-[#efe1de]",
  done: "bg-[#eef3ee] text-[#3f7a52] border-[#d7e6da]",
  pending: "bg-[#fff4e0] text-[#9a6a00] border-[#f5dfa8]",
};

const pad2 = (n) => String(n).padStart(2, "0");

function toICSStamp(d) {
  return (
    d.getUTCFullYear() +
    pad2(d.getUTCMonth() + 1) +
    pad2(d.getUTCDate()) +
    "T" +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) +
    "Z"
  );
}
function apptStart(appt) {
  return new Date(`${appt.date}T${appt.time}`);
}
function apptEnd(appt) {
  return new Date(apptStart(appt).getTime() + (appt.durationMinutes || 30) * 60000);
}
function googleCalUrl(appt) {
  const start = apptStart(appt);
  const end = apptEnd(appt);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${appt.service} — ${appt.vehicle}`,
    dates: `${toICSStamp(start)}/${toICSStamp(end)}`,
    details: appt.notes || "",
    location: appt.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function Appointments() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const justBooked = location.state?.justBooked;

  const ctx = useAppointments() || {};

  // ctx.appointments is already scoped to this user by AppointmentsContext
  // (admins get everyone's; regular users get only their own). Fall back to
  // demo data only when there's genuinely nothing in the shared store yet.
  const appointments =
    ctx.appointments && ctx.appointments.length
      ? ctx.appointments
      : MOCK_APPOINTMENTS.filter((a) => a.uid === (user?.uid || "mock_user_123") || true);

  const [modalApptId, setModalApptId] = useState(null);
  const [modalView, setModalView] = useState("detail");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    if (justBooked) showToast("Booking request sent — awaiting admin approval");
  }, [justBooked]);

  const { pending, upcoming, past, nextAppointment } = useMemo(() => {
    const sorted = [...appointments].sort(
      (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
    );
    return {
      pending: sorted.filter((a) => a.status === "pending"),
      upcoming: sorted.filter((a) => a.status === "upcoming"),
      past: sorted.filter(
        (a) => a.status !== "upcoming" && a.status !== "pending"
      ),
      nextAppointment: sorted.find((a) => a.status === "upcoming") || null,
    };
  }, [appointments]);

  const modalAppt = appointments.find((a) => a.id === modalApptId) || null;

  const openAppt = (id) => {
    setModalApptId(id);
    setModalView("detail");
  };
  const closeModal = () => {
    setModalApptId(null);
    setModalView("detail");
  };

  const confirmReschedule = (id, newDate, newTime) => {
    if (typeof ctx.updateAppointment === "function") {
      ctx.updateAppointment(id, { date: newDate, time: newTime });
    }
    setModalView("detail");
    showToast("Appointment rescheduled");
  };

  const confirmCancel = (id) => {
    if (typeof ctx.cancelAppointment === "function") {
      ctx.cancelAppointment(id);
    }
    closeModal();
    showToast("Appointment cancelled");
  };

  return (
    <div className="min-h-screen bg-[#f5f2f0] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0F1B2E]/90 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-4 flex items-center gap-3 text-white">
        <Link to="/">
          <button
            type="button"
            aria-label="Go back"
            className="text-white hover:text-[#C81E2C] transition-colors"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
        </Link>
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white">
            Slipways <span className="text-[#E4222A]">Auto</span>
          </h1>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-md sm:max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1c1c1c] leading-tight mb-2">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h2>
          <p className="text-[#8a5a52] text-sm sm:text-base">
            Here's an overview of your appointments and upcoming reminders.
          </p>
        </div>

        {/* Reminder banner */}
        {nextAppointment && (
          <div className="bg-[#0F1B2E] rounded-2xl p-5 sm:p-6 mb-6 flex items-start sm:items-center gap-4 flex-col sm:flex-row">
            <div className="bg-[#C81E2C] rounded-lg p-2.5 flex-shrink-0">
              <Bell size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm sm:text-base">
                Reminder: {nextAppointment.service} coming up
              </p>
              <p className="text-[#a8a3a8] text-xs sm:text-sm mt-0.5">
                {formatDate(nextAppointment.date)} at{" "}
                {formatTime(nextAppointment.time)} — {nextAppointment.vehicle}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap ${
                TONE_STYLES[
                  getReminder(nextAppointment.date, nextAppointment.time, nextAppointment.status).tone
                ]
              }`}
            >
              {getReminder(nextAppointment.date, nextAppointment.time, nextAppointment.status).label}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={<Calendar size={18} className="text-[#C81E2C]" />}
            label="Upcoming"
            value={upcoming.length}
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-[#3f7a52]" />}
            label="Completed"
            value={past.filter((a) => a.status === "completed").length}
          />
        </div>

        {/* Pending approval */}
        {pending.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-bold text-[#1c1c1c] mb-3 px-1">
              Pending Approval
            </h3>
            <div className="space-y-3">
              {pending.map((appt) => (
                <AppointmentCard key={appt.id} appt={appt} onOpen={openAppt} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming appointments */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-lg font-bold text-[#1c1c1c]">
              Upcoming Appointments
            </h3>
            <Link
              to="/booking"
              className="text-sm font-semibold text-[#C81E2C] hover:underline"
            >
              Book new
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {upcoming.map((appt) => (
                <AppointmentCard key={appt.id} appt={appt} onOpen={openAppt} />
              ))}
            </div>
          )}
        </section>

        {/* Past appointments */}
        {past.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-bold text-[#1c1c1c] mb-3 px-1">
              Past Appointments
            </h3>
            <div className="space-y-3">
              {past.map((appt) => (
                <AppointmentCard key={appt.id} appt={appt} onOpen={openAppt} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-[#9a8580] mt-8 mb-5 space-y-2">
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-[#7a1f1f]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#7a1f1f]">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#7a1f1f]">
              Contact Us
            </a>
          </div>
          <p>© 2026 Slipways Auto. All rights reserved.</p>
        </footer>
      </main>

      {modalAppt && (
        <ModalShell onClose={closeModal}>
          {modalView === "detail" && (
            <DetailView
              appt={modalAppt}
              onClose={closeModal}
              onReschedule={() => setModalView("reschedule")}
              onCancel={() => setModalView("cancel")}
              onToast={showToast}
            />
          )}
          {modalView === "reschedule" && (
            <RescheduleView
              appt={modalAppt}
              allAppointments={appointments}
              onBack={() => setModalView("detail")}
              onConfirm={(newDate, newTime) => confirmReschedule(modalAppt.id, newDate, newTime)}
            />
          )}
          {modalView === "cancel" && (
            <CancelView
              appt={modalAppt}
              onBack={() => setModalView("detail")}
              onConfirm={() => confirmCancel(modalAppt.id)}
            />
          )}
        </ModalShell>
      )}

      <Toast message={toast} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                      */
/* ------------------------------------------------------------------ */
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-[#efe1de] shadow-sm p-4 sm:p-5 flex items-center gap-3">
      <div className="bg-[#f6eeed] rounded-lg p-2.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xl sm:text-2xl font-extrabold text-[#1c1c1c] leading-none">
          {value}
        </p>
        <p className="text-xs sm:text-sm text-[#8a5a52] mt-1">{label}</p>
      </div>
    </div>
  );
}

function AppointmentCard({ appt, onOpen }) {
  const reminder = getReminder(appt.date, appt.time, appt.status);
  const Icon = appt.serviceIncludes ? Package : SERVICE_ICON[appt.service] || Wrench;
  const inactive = appt.status === "cancelled" || appt.status === "declined";

  return (
    <button
      onClick={() => onOpen(appt.id)}
      className={`w-full text-left bg-white rounded-2xl border border-[#efe1de] shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity ${
        inactive ? "opacity-60" : "hover:border-[#e6c9c5]"
      }`}
    >
      <div className="bg-[#f6eeed] rounded-xl p-3 flex-shrink-0 w-fit">
        <Icon size={20} className="text-[#C81E2C]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-[#1c1c1c] text-sm sm:text-base truncate">
            {appt.service}
          </p>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
              TONE_STYLES[reminder.tone]
            }`}
          >
            {reminder.label}
          </span>
        </div>

        <p className="text-[#8a5a52] text-xs sm:text-sm mt-1 truncate">
          {appt.vehicle}
        </p>

        {appt.serviceIncludes && (
          <p className="text-[#9a8580] text-xs mt-1 truncate">
            Includes: {appt.serviceIncludes.join(", ")}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-[#9a8580]">
          <span className="flex items-center gap-1">
            <Calendar size={13} /> {formatDate(appt.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {formatTime(appt.time)}
            {appt.durationMinutes ? ` (${appt.durationMinutes} min)` : ""}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {appt.location}
          </span>
        </div>
      </div>

      <ChevronRight size={18} className="text-[#c9b9b6] hidden sm:block" />
    </button>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-[#e6c9c5] p-8 flex flex-col items-center text-center gap-2">
      <AlertCircle size={22} className="text-[#c9b9b6]" />
      <p className="text-[#8a5a52] text-sm">
        You have no upcoming appointments.
      </p>
      <Link
        to="/booking"
        className="text-sm font-semibold text-[#C81E2C] hover:underline mt-1"
      >
        Schedule one now
      </Link>
    </div>
  );
}

function ModalShell({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: "rgba(15,27,46,0.55)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col border border-[#efe1de]"
        style={{ maxHeight: "88vh" }}
      >
        {children}
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] bg-[#0F1B2E] text-white rounded-full px-4 py-2.5 flex items-center gap-2 shadow-lg"
    >
      <Check size={15} className="text-[#8fd6a8]" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

function DetailView({ appt, onClose, onReschedule, onCancel, onToast }) {
  const isUpcoming = appt.status === "upcoming";
  const isPending = appt.status === "pending";
  const reminder = getReminder(appt.date, appt.time, appt.status);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#efe1de]">
        <div>
          <span
            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mb-1.5 ${TONE_STYLES[reminder.tone]}`}
          >
            {reminder.label}
          </span>
          <div className="text-xl font-extrabold text-[#1c1c1c] leading-tight">
            {appt.service}
          </div>
          <div className="text-sm text-[#8a5a52] mt-0.5">{appt.vehicle}</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 rounded-full hover:bg-[#f6eeed] shrink-0"
        >
          <X size={18} className="text-[#8a5a52]" />
        </button>
      </div>

      <div className="px-5 py-4 overflow-y-auto flex-1 space-y-5">
        {isPending && (
          <div className="rounded-lg px-3.5 py-3 text-sm bg-[#fff4e0] border border-[#f5dfa8] text-[#9a6a00]">
            Waiting on admin approval — you'll be notified once this booking is confirmed.
          </div>
        )}

        <div className="flex items-start gap-3">
          <Calendar size={17} className="mt-0.5 shrink-0 text-[#C81E2C]" />
          <div>
            <div className="text-sm font-semibold text-[#1c1c1c]">
              {formatDateLong(appt.date)}
            </div>
            <div className="text-sm text-[#8a5a52]">
              {formatTime(appt.time)}
              {appt.durationMinutes ? ` · ${appt.durationMinutes} min` : ""}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center rounded-full bg-[#f6eeed] shrink-0 w-9 h-9">
            <User size={16} className="text-[#C81E2C]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1c1c1c]">{appt.technician}</div>
            <div className="text-sm text-[#8a5a52]">Assigned technician</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin size={17} className="mt-0.5 shrink-0 text-[#C81E2C]" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#1c1c1c]">{appt.location}</div>
            {isUpcoming && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  appt.location
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm mt-1 text-[#C81E2C] hover:underline"
              >
                Get directions <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {appt.notes && (
          <div className="rounded-lg px-3.5 py-3 text-sm bg-[#f6eeed] border-l-[3px] border-[#C81E2C] text-[#7a5b56] italic">
            {appt.notes}
          </div>
        )}

        {appt.serviceIncludes && (
          <div className="rounded-lg px-3.5 py-3 text-sm bg-[#f6eeed] border border-[#efe1de] text-[#8a5a52]">
            Includes: {appt.serviceIncludes.join(", ")}
          </div>
        )}

        {appt.attachments && appt.attachments.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wide text-[#9a8580] mb-2">
              Attachments
            </div>
            <div className="space-y-1.5">
              {appt.attachments.map((f) => (
                <div
                  key={f.name}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-white border border-[#efe1de] text-[#1c1c1c]"
                >
                  <Paperclip size={14} className="text-[#8a5a52]" />
                  <span className="truncate">{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isUpcoming && (
          <div>
            <a
              href={googleCalUrl(appt)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3.5 py-2 border border-[#C81E2C] text-[#C81E2C] hover:bg-[#fdecec]"
            >
              <CalendarPlus size={15} />
              Add to Google Calendar
            </a>
          </div>
        )}
      </div>

      {isPending && (
        <div className="px-5 py-4 border-t border-[#efe1de]">
          <button
            onClick={onCancel}
            className="w-full rounded-xl py-2.5 text-sm font-semibold border border-[#7a1f1f] text-[#7a1f1f]"
          >
            Withdraw request
          </button>
        </div>
      )}

      {isUpcoming && (
        <div className="px-5 py-4 border-t border-[#efe1de] flex gap-2">
          <button
            onClick={onReschedule}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#C81E2C] text-[#C81E2C]"
          >
            Reschedule
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#7a1f1f] text-[#7a1f1f]"
          >
            Cancel booking
          </button>
        </div>
      )}
    </div>
  );
}

function RescheduleView({ appt, allAppointments, onBack, onConfirm }) {
  const days = useMemo(() => {
    const arr = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 1; i <= 7; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);
  const [dayIdx, setDayIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  const isConflict = (day, time) => {
    const dateStr = `${day.getFullYear()}-${pad2(day.getMonth() + 1)}-${pad2(day.getDate())}`;
    const candidate = new Date(`${dateStr}T${time}`);
    const candidateEnd = new Date(candidate.getTime() + (appt.durationMinutes || 30) * 60000);
    return allAppointments.some((other) => {
      if (other.id === appt.id || other.status !== "upcoming") return false;
      const oStart = new Date(`${other.date}T${other.time}`);
      const oEnd = new Date(oStart.getTime() + (other.durationMinutes || 30) * 60000);
      return candidate < oEnd && candidateEnd > oStart;
    });
  };

  const chosenDay = days[dayIdx];
  const conflictNow = selectedTime ? isConflict(chosenDay, selectedTime) : false;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-[#efe1de]">
        <button
          onClick={onBack}
          aria-label="Back to appointment details"
          className="p-1 -ml-1 rounded-full hover:bg-[#f6eeed]"
        >
          <ArrowLeft size={18} className="text-[#1c1c1c]" />
        </button>
        <div>
          <div className="text-lg font-bold text-[#1c1c1c]">Reschedule</div>
          <div className="text-sm text-[#8a5a52]">
            {appt.service} · {appt.vehicle}
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="text-xs uppercase tracking-wide text-[#9a8580] mb-2">
          Choose a day
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d, i) => {
            const active = i === dayIdx;
            return (
              <button
                key={i}
                onClick={() => {
                  setDayIdx(i);
                  setSelectedTime(null);
                }}
                className="flex flex-col items-center justify-center rounded-xl px-3 py-2 shrink-0 w-14 border"
                style={{
                  background: active ? "#C81E2C" : "#f6eeed",
                  color: active ? "#fff" : "#1c1c1c",
                  borderColor: active ? "#C81E2C" : "#efe1de",
                }}
              >
                <span className="text-[10px] uppercase opacity-80">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-lg leading-tight font-bold">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-4 flex-1">
        <div className="text-xs uppercase tracking-wide text-[#9a8580] mb-2">
          Available times
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SLOT_TIMES.map((t) => {
            const conflict = isConflict(chosenDay, t);
            const active = selectedTime === t;
            return (
              <button
                key={t}
                disabled={conflict}
                onClick={() => setSelectedTime(t)}
                className="rounded-xl py-2.5 text-sm border"
                style={{
                  background: conflict ? "#f2f2f0" : active ? "#C81E2C" : "#fff",
                  color: conflict ? "#c9b9b6" : active ? "#fff" : "#1c1c1c",
                  borderColor: conflict ? "#efe1de" : active ? "#C81E2C" : "#e6c9c5",
                  textDecoration: conflict ? "line-through" : "none",
                  cursor: conflict ? "not-allowed" : "pointer",
                }}
              >
                {formatTime(t)}
                {conflict && (
                  <span className="block text-[10px] mt-0.5" style={{ textDecoration: "none" }}>
                    Booked
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selectedTime && conflictNow && (
          <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm bg-[#fdecec] border border-[#f3c9c9] text-[#C81E2C]">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            This time overlaps with another appointment on your calendar. Please choose a different slot.
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-[#efe1de]">
        <button
          disabled={!selectedTime || conflictNow}
          onClick={() => {
            const dateStr = `${chosenDay.getFullYear()}-${pad2(chosenDay.getMonth() + 1)}-${pad2(
              chosenDay.getDate()
            )}`;
            onConfirm(dateStr, selectedTime);
          }}
          className="w-full rounded-xl py-3 text-sm font-semibold transition-opacity"
          style={{
            background: !selectedTime || conflictNow ? "#e6c9c5" : "#C81E2C",
            color: !selectedTime || conflictNow ? "#a8938f" : "#fff",
            cursor: !selectedTime || conflictNow ? "not-allowed" : "pointer",
          }}
        >
          Confirm new time
        </button>
      </div>
    </div>
  );
}

function CancelView({ appt, onBack, onConfirm }) {
  const isPending = appt.status === "pending";
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-[#efe1de]">
        <button
          onClick={onBack}
          aria-label="Back to appointment details"
          className="p-1 -ml-1 rounded-full hover:bg-[#f6eeed]"
        >
          <ArrowLeft size={18} className="text-[#1c1c1c]" />
        </button>
        <div className="text-lg font-bold text-[#1c1c1c]">
          {isPending ? "Withdraw request" : "Cancel booking"}
        </div>
      </div>

      <div className="px-5 py-5 flex-1">
        <div className="flex items-center justify-center rounded-full mx-auto mb-4 w-12 h-12 bg-[#fdecec]">
          <Ban size={22} className="text-[#C81E2C]" />
        </div>
        <p className="text-center text-lg font-extrabold text-[#1c1c1c] mb-1">
          {isPending ? `Withdraw request for ${appt.service}?` : `Cancel ${appt.service}?`}
        </p>
        <p className="text-center text-sm text-[#8a5a52] mb-5">
          {isPending
            ? "This request hasn't been approved yet — withdrawing it removes it from the queue."
            : `This will free your slot and notify ${appt.technician}.`}
        </p>

        {!isPending && (
          <div className="rounded-xl px-4 py-3.5 text-sm bg-[#f6eeed] border border-[#efe1de] text-[#8a5a52]">
            <div className="font-semibold mb-1 text-[#1c1c1c]">Cancellation policy</div>
            Cancellations made 24 hours or more before your appointment receive a
            full refund of any amount paid. Cancellations within 24 hours are
            refunded at 50%. Missed appointments are non-refundable.
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-[#efe1de] flex flex-col gap-2">
        <button
          onClick={onConfirm}
          className="w-full rounded-xl py-3 text-sm font-semibold bg-[#7a1f1f] hover:bg-[#661a1a] text-white"
        >
          {isPending ? "Withdraw request" : "Cancel booking"}
        </button>
        <button
          onClick={onBack}
          className="w-full rounded-xl py-3 text-sm font-semibold border border-[#efe1de] text-[#8a5a52]"
        >
          Keep appointment
        </button>
      </div>
    </div>
  );
}