import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  RotateCcw,
  Headphones,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppointments } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext";

const REQUIRED_FIELDS = ["name", "phone", "email", "vehicle", "service", "date", "time"];

const SERVICES = [
  { value: "oil-change", label: "Oil Change", durationMinutes: 30 },
  { value: "brake-service", label: "Brake Service", durationMinutes: 90 },
  { value: "tire-rotation", label: "Tire Rotation", durationMinutes: 30 },
  { value: "full-inspection", label: "Full Inspection", durationMinutes: 45 },
  { value: "engine-diagnostics", label: "Engine Diagnostics", durationMinutes: 60 },
];

const BUNDLES = [
  {
    value: "basic-package",
    label: "Basic Service Package",
    includes: ["Oil Change", "Full Inspection"],
    durationMinutes: 60,
  },
  {
    value: "full-package",
    label: "Full Service Package",
    includes: ["Oil Change", "Brake Service", "Tire Rotation"],
    durationMinutes: 135,
  },
  {
    value: "safety-package",
    label: "Safety Check Package",
    includes: ["Brake Service", "Full Inspection", "Engine Diagnostics"],
    durationMinutes: 150,
  },
];

const SERVICE_LOOKUP = [...SERVICES, ...BUNDLES].reduce((acc, item) => {
  acc[item.value] = item;
  return acc;
}, {});

export default function BookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addAppointment } = useAppointments();
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    service: "",
    date: "",
    time: "",
  });
  const [error, setError] = useState("");

  // Sync form with user context whenever the logged-in user changes
  useEffect(() => {
    setForm((f) => ({
      ...f,
      name: user?.name || "",
      email: user?.email || "",
    }));
  }, [user]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = REQUIRED_FIELDS.some((key) => !form[key].trim());
    if (missing) {
      setError("Please fill in all fields before confirming your booking.");
      return;
    }
    setError("");

    const selected = SERVICE_LOOKUP[form.service];
    const userKey = user?.uid || "anonymous";

    const newAppointment = {
      id: `local-${Date.now()}`,
      uid: userKey, 
      service: selected?.label || form.service,
      serviceIncludes: selected?.includes || null,
      durationMinutes: selected?.durationMinutes || 30,
      vehicle: form.vehicle,
      date: form.date,
      time: form.time,
      status: "upcoming",
      technician: "To be assigned",
      location: "Slipways Auto — Westlands Bay",
      contactName: form.name,
      contactPhone: form.phone,
      contactEmail: form.email,
    };
    
    // 1. Save to Context
    addAppointment(newAppointment);
    
    // 2. Save directly to User-Specific LocalStorage array
    const storageKey = `appointments_${userKey}`;
    const existingAppointments = JSON.parse(localStorage.getItem(storageKey)) || [];
    localStorage.setItem(storageKey, JSON.stringify([...existingAppointments, newAppointment]));
    
    navigate("/appointments", { state: { justBooked: true } });
  };

  const selectedService = SERVICE_LOOKUP[form.service];

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

      <main className="flex-1 w-full max-w-md sm:max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero */}
        <div className="mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1c1c] leading-tight mb-2">
            Schedule Your Service
          </h2>
          <p className="text-[#8a5a52] text-sm sm:text-base">
            Fill out the form below and our team will confirm your slot within
            24 hours.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#efe1de] shadow-sm p-5 sm:p-7 space-y-5"
        >
          {error && (
            <div className="flex items-center gap-2 bg-[#fdecec] border border-[#f3c9c9] text-[#C81E2C] text-sm font-medium rounded-xl px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <Field label="Full Name">
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={update("name")}
              required
              className="input-field"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Phone Number">
              <input
                type="tel"
                placeholder="+254 700 000 000"
                value={form.phone}
                onChange={update("phone")}
                required
                className="input-field"
              />
            </Field>

            <Field label="Email Address">
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={update("email")}
                required
                className="input-field"
              />
            </Field>
          </div>

          <Field label="Vehicle Model">
            <input
              type="text"
              placeholder="e.g. 2023 BMW M3"
              value={form.vehicle}
              onChange={update("vehicle")}
              required
              className="input-field"
            />
          </Field>

          <Field label="Service Selection">
            <div className="relative">
              <select
                value={form.service}
                onChange={update("service")}
                required
                className="input-field appearance-none pr-10 text-[#1c1c1c]"
              >
                <option value="" disabled>
                  Select a Service
                </option>
                <optgroup label="Individual Services">
                  {SERVICES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label} ({s.durationMinutes} min)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Service Packages">
                  {BUNDLES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label} ({b.durationMinutes} min)
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a5a52]"
              />
            </div>

            {selectedService?.includes && (
              <div className="mt-2 text-xs text-[#8a5a52] bg-[#f6eeed] border border-[#efe1de] rounded-lg px-3 py-2">
                Includes: {selectedService.includes.join(", ")}
              </div>
            )}
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Preferred Date">
              <div className="relative">
                <input
                  type="date"
                  value={form.date}
                  onChange={update("date")}
                  required
                  className="input-field pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <Calendar
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a5a52]"
                />
              </div>
            </Field>

            <Field label="Preferred Time">
              <div className="relative">
                <input
                  type="time"
                  value={form.time}
                  onChange={update("time")}
                  required
                  className="input-field pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <Clock
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a5a52]"
                />
              </div>
            </Field>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C81E2C] hover:bg-[#ab1d29] active:bg-[#8f202a] transition-colors text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 mt-2"
          >
            Confirm Booking
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Trust Card */}
        <div className="bg-[#0F1B2E] rounded-2xl p-5 sm:p-6 mt-6 space-y-4">
          <TrustItem
            icon={<Shield size={20} className="text-white" />}
            title="Certified Experts"
            desc="All technicians are ASE certified."
          />
          <TrustItem
            icon={<RotateCcw size={20} className="text-white" />}
            title="Genuine Parts"
            desc="We only use OEM-spec components."
          />
          <TrustItem
            icon={<Headphones size={20} className="text-white" />}
            title="24/7 Support"
            desc="Emergency towing & roadside help."
          />
        </div>

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

      <style>{`
        .input-field {
          width: 100%;
          background-color: #f6eeed;
          border: 1px solid #e6c9c5;
          border-radius: 0.75rem;
          padding: 0.7rem 0.9rem;
          font-size: 0.9rem;
          color: #1c1c1c;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .input-field::placeholder {
          color: #b09490;
        }
        .input-field:focus {
          border-color: #7a1f1f;
          box-shadow: 0 0 0 3px rgba(122, 31, 31, 0.12);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-[#1c1c1c] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function TrustItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-[#C81E2C] rounded-lg p-2.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-[#a8a3a8] text-xs mt-0.5">{desc}</p>
      </div>
    </div>
  );
}