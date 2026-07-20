import React, { useState } from "react";
import {
  Star,
  ShieldCheck,
  Users,
  Wrench,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const NAVY = "#0F1B2E";
const NAVY_SOFT = "#16233A";
const RED = "#C81E2C";
const RED_DARK = "#A5141F";

const services = [
  {
    title: "Periodic Maintenance",
    desc: "Keep your vehicle in top shape with regular expert servicing.",
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Cooling System Repairs",
    desc: "Ensure engine efficiency by fixing leaks, radiators, and coolants.",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "A/C Repairs",
    desc: "Stay cool with efficient air conditioning diagnostics and repairs.",
    img: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Brake Repairs",
    desc: "Professional brake inspection and repair for your safety on the road.",
    img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
  },
];

const testimonials = [
  {
    name: "Helena",
    role: "Car Owner",
    quote: "Fast, friendly, and reliable! They fixed my AC perfectly.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Marie",
    role: "Car Owner",
    quote: "Professional service with honest pricing. Highly recommended!",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 text-[#C81E2C]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={16} fill="#C81E2C" strokeWidth={0} />
      ))}
    </div>
  );
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-[#C81E2C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A5141F] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function SlipwaysAutoHome() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "Periodic Maintenance",
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans text-[#0F1B2E]">
      {/* Hero */}
      <section className="bg-[#0F1B2E] px-4 py-10 sm:px-6 sm:py-10 lg:py-10">
        <div className="flex max-w-6xl flex-col gap-1 lg:flex-row lg:gap-5">
          {/* Left: text + CTA */}
          <div className="w-full text-center lg:pt-10 lg:text-left">
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Reliable <span className="text-[#C81E2C]">Automotive</span>{" "}
              Services Since 2005
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm text-slate-300 sm:text-base lg:mx-0 lg:max-w-none lg:pr-6">
              Your trusted neighborhood garage for complete car care — from
              diagnostics and mechanical repairs to detailing and headlight
              restoration. Backed by decades of experience.
            </p>
            <Link to="/booking">
              <PrimaryButton className="m-6 w-full gap-2 sm:w-auto">
                Book an appointment
                <ArrowRight size={22} strokeWidth={2.5} />
              </PrimaryButton>
            </Link>
          </div>

          {/* Right: image */}
          <div className="w-full overflow-hidden rounded-xl lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&w=1400&q=80"
              alt="Garage with car on lift"
              className="h-64 w-full object-cover sm:h-80 lg:h-[420px]"
            />
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold sm:text-4xl">Who We Are</h2>
          <p className="mt-4 text-sm text-slate-600 sm:text-base">
            Slipways Auto has been serving vehicle owners in Kenya since
            2005. With decades of experience and a commitment to quality, we
            specialize in comprehensive automotive care — from diagnostics
            and repairs to detailing and restoration. Our trained
            professionals use the latest technology to ensure your vehicle
            performs at its best.
          </p>
          <PrimaryButton className="mt-6">Get Started</PrimaryButton>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDE8E9] text-[#C81E2C]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-bold text-sm">Experience</p>
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
              <p className="font-bold text-sm">Expert Technicians</p>
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
              <p className="font-bold text-sm">Modern Facility</p>
              <p className="text-xs text-slate-500">
                Equipped with the latest technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section id="services" className="bg-[#0F1B2E] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-3xl font-bold tracking-wide text-[#C81E2C]">
            OUR SERVICES
          </p>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            At Slipways Auto, we offer a complete range of automotive
            services to keep your vehicle running smoothly, safely, and
            looking its best.
          </p>
        </div>

        <div className=" mt-10 grid max-w-6xl gap-8 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="overflow-hidden rounded-xl bg-[#16233A]"
            >
              <img
                src={s.img}
                alt={s.title}
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C81E2C]">
                  Learn more <ChevronRight size={16} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-10">
        <h2 className="text-center text-2xl font-extrabold sm:text-4xl">
          Testimonial
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Voices from Satisfied Car Owners
        </p>

        <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col gap-3">
              <Stars />
              <p className="text-sm italic text-slate-700">“{t.quote}”</p>
              <div className="mt-2 overflow-hidden rounded-lg">
                <img
                  src={
                    t.name === "Helena"
                      ? "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80"
                      : "https://images.unsplash.com/photo-1554774853-719586f82d77?auto=format&fit=crop&w=800&q=80"
                  }
                  alt="Customer with car"
                  className="h-40 w-full object-cover"
                />
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={t.img}
                  alt={t.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Car Owner
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1B2E] px-9 pb-6 pt-14 text-slate-300">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
              <li><Link to="/" className="hover:text-red-500">Home</Link></li>
              <li><Link to="/about" className="hover:text-red-500">About Us</Link></li>
              <li><a href="#services" className="hover:text-red-500">Services</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-bold text-white">
              Subscribe Our News Letter.
            </h4>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-md border border-white/20 bg-transparent px-4 py-2 text-xs text-white placeholder:text-slate-400 outline-none focus:border-[#C81E2C]"
              />
              <button className="shrink-0 rounded-md bg-[#C81E2C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A5141F]">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
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