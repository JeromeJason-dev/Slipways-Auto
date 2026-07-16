import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  RotateCcw,
  Headphones,
  Home,
  Wrench,
  Car,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function BookingPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    service: "",
    date: "",
    time: "",
  });

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Booking confirmation would be wired up here
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

      <main className="flex-1 w-full max-w-md sm:max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero */}
        <div className="mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1c1c] leading-tight mb-2 px-20">
            Schedule Your Service
          </h2>
          <p className="text-[#8a5a52] text-sm sm:text-base px-5">
            Fill out the form below and our team will confirm your slot within
            24 hours.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#efe1de] shadow-sm p-5 sm:p-7 space-y-5"
        >
          <Field label="Full Name">
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={update("name")}
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
                className="input-field"
              />
            </Field>

            <Field label="Email Address">
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={update("email")}
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
              className="input-field"
            />
          </Field>

          <Field label="Service Selection">
            <div className="relative">
              <select
                value={form.service}
                onChange={update("service")}
                className="input-field appearance-none pr-10 text-[#1c1c1c]"
              >
                <option value="" disabled>
                  Select a Service
                </option>
                <option value="oil-change">Oil Change</option>
                <option value="brake-service">Brake Service</option>
                <option value="tire-rotation">Tire Rotation</option>
                <option value="full-inspection">Full Inspection</option>
                <option value="engine-diagnostics">Engine Diagnostics</option>
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a5a52]"
              />
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Preferred Date">
              <div className="relative">
                <input
                  type="date"
                  value={form.date}
                  onChange={update("date")}
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

function NavItem({ icon, label, active }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg ${
        active ? "text-[#7a1f1f] bg-[#f6eeed]" : "text-[#a8a3a8]"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}