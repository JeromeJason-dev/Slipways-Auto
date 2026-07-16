import React from "react";
import {
  ShieldCheck,
  Users,
  Wrench,
  Target,
  Eye,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const NAVY = "#0F1B2E";
const NAVY_SOFT = "#16233A";
const RED = "#C81E2C";
const RED_DARK = "#A5141F";

const stats = [
  { value: "19+", label: "Years of Service" },
  { value: "12k+", label: "Vehicles Serviced" },
  { value: "24", label: "Expert Technicians" },
  { value: "4.9★", label: "Average Rating" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "Deliver dependable, transparent auto care that keeps every customer safely and confidently on the road.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "To be the most trusted automotive service brand in Kenya, known for craftsmanship and integrity.",
  },
  {
    icon: HeartHandshake,
    title: "Our Values",
    desc: "Honesty, precision, and respect for your time — every diagnosis explained, every price agreed upfront.",
  },
];

const team = [
  {
    name: "Benson Kariuki",
    role: "Founder & Master Mechanic",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Grace Wanjiru",
    role: "Lead Service Advisor",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Peter Kamau",
    role: "Diagnostics Specialist",
    img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Samuel Otieno",
    role: "Brake & Suspension Lead",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
  },
];

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#C81E2C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A5141F] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-[#0F1B2E]">
      {/* Hero */}
      <section className="bg-[#0F1B2E] px-4 py-10 sm:px-6 lg:px-10 lg:py-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C81E2C]">
          Est. 2005
        </p>
        <h1 className="mx-auto mt-2 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
          Built on Trust, <span className="text-[#C81E2C]">Driven</span> by
          Precision
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
          For nearly two decades, Slipways Auto has kept Kenya's vehicles
          running strong — one honest diagnosis and one careful repair at a
          time.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/booking" className="w-full sm:w-auto">
            <PrimaryButton className="w-full sm:w-auto">
              Book a Service
              <ArrowRight size={18} />
            </PrimaryButton>
          </Link>
          <a href="#story" className="w-full sm:w-auto">
            <button className="w-full rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto">
              Our Story
            </button>
          </a>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#16233A] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-[#C81E2C] sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story / Who We Are */}
      <section id="story" className="bg-white px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:gap-14">
          <div className="w-full lg:w-1/2">
            <div className="overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?auto=format&fit=crop&w=1000&q=80"
                alt="Technician inspecting an engine"
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
              />
            </div>
          </div>
          <div className="w-full text-center lg:w-1/2 lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C81E2C]">
              Who We Are
            </p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-4xl">
              A Neighborhood Garage That Grew Into a Trusted Name
            </h2>
            <p className="mt-4 text-sm text-slate-600 sm:text-base">
              Slipways Auto has been serving vehicle owners in Kenya since 2005.
              What started as a two-bay garage is now a full-service repair
              center, built entirely on referrals and repeat customers who trust
              us with their daily drivers and weekend rides alike.
            </p>
            <p className="mt-4 text-sm text-slate-600 sm:text-base">
              We specialize in comprehensive automotive care — from routine
              diagnostics and maintenance to complex engine and transmission
              repairs — all backed by certified technicians and honest, upfront
              pricing.
            </p>
          </div>
        </div>

        {/* Why choose us icons, matching home page style */}
        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDE8E9] text-[#C81E2C]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Experience</p>
              <p className="text-xs text-slate-500">
                Trusted service in Kenya since 2005.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDE8E9] text-[#C81E2C]">
              <Users size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Expert Technicians</p>
              <p className="text-xs text-slate-500">
                Certified top-quality car care.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDE8E9] text-[#C81E2C]">
              <Wrench size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Modern Facility</p>
              <p className="text-xs text-slate-500">
                Equipped with the latest technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-[#0F1B2E] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-2xl font-bold tracking-wide text-[#C81E2C] sm:text-3xl">
            WHAT DRIVES US
          </p>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Every service we perform is guided by the same three commitments.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-xl bg-[#16233A] p-6 text-center sm:text-left"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-[#C81E2C]/15 text-[#C81E2C] sm:mx-0">
                <v.icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{v.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C81E2C]">
            The Team
          </p>
          <h2 className="mt-3 text-2xl font-extrabold sm:text-4xl">
            Meet the People Behind the Wrench
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div
              key={m.name}
              className="overflow-hidden rounded-xl border border-slate-100 shadow-sm"
            >
              <img
                src={m.img}
                alt={m.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-sm font-bold">{m.name}</p>
                <p className="text-xs font-semibold text-[#C81E2C]">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-gradient-to-r from-[#C81E2C] to-[#A5141F] px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
            Ready to Experience the Difference?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
            Book your vehicle in for a service today and see why Kenya trusts
            Slipways Auto.
          </p>
          <Link to="/booking">
            <button className="mt-7 rounded-md bg-white px-7 py-3 text-sm font-semibold text-[#C81E2C] transition-colors hover:bg-white/90">
              Book Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1B2E] px-6 pb-6 pt-14 text-slate-300 sm:px-9">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#C81E2C] text-xs font-bold text-white">
                S
              </div>
              <span className="text-2xl font-bold text-white">
                Slipways Auto
              </span>
            </div>
            <p className="mt-4 text-xs">
              Reliable automotive care in Kenya since 2005.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-bold text-white">Contact Us</h4>
            <ul className="space-y-2 text-xs">
              <li>slipwaysauto@gmail.com</li>
              <li>+254 712 345 678</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-bold text-white">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-red-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-red-500">
                  Services
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Slipways Auto. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Workshop Address</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
