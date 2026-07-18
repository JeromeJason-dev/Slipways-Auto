# Slipways Auto

A full-stack shop management platform for auto repair shops — a public marketing/booking site paired with an authenticated admin dashboard for tracking work orders, customers, invoices, inventory, appointments, and revenue.

---

## Overview

Slipways Auto has two sides:

- **Public site** (`/`, `/about`, `/booking`) — a marketing home page, an about page, and a customer-facing booking form where customers can request an appointment.
- **Admin dashboard** (`/dashboard/*`) — a protected, single-page app for shop staff to manage day-to-day operations: work orders, customers, invoices, inventory, appointment approvals, and reports.

Authentication is powered by Firebase (email/password + Google sign-in), and appointment confirmation/decline emails are sent via EmailJS.

---

## Features

### Public site
- **Home / About** — marketing pages describing the shop and its services.
- **Booking** — a public form for customers to request an appointment without an account.
- **Login / Register** — email/password and Google OAuth sign-in via Firebase Auth.

### Admin dashboard (protected, admin-only)
- **Dashboard** — at-a-glance metrics (monthly revenue, open work orders, customers on file, low-stock parts), a revenue bar chart, and a work-order status breakdown.
- **Appointments** — review, approve, or decline incoming booking requests, with automated approval/decline emails sent through EmailJS.
- **Work Orders** — searchable/filterable table of jobs, inline status updates, and a validated "New work order" form.
- **Customers** — customer directory with visit history and lifetime spend, plus a validated "Add customer" form.
- **Invoices** — invoice list with totals for invoiced, paid, and outstanding amounts.
- **Inventory** — parts tracking with low-stock and out-of-stock indicators.
- **Reports** — revenue trend chart and summary KPIs.

### Cross-cutting
- **Route protection** — the `/dashboard` area is gated behind Firebase authentication and an admin role check (`ProtectedRoute`); unauthenticated users are redirected to `/login`.
- **Persistence** — dashboard state auto-saves to `localStorage` (debounced), with a "reset to demo data" option; seed data is loaded from `public/data.json`.
- **Accessible UI** — focus-trapped modals, keyboard (Esc/Tab) support, ARIA roles/labels on nav, tabs, and a live save-status region.
- **Error handling** — a top-level `ErrorBoundary` guards the app from unhandled render errors.

---

## Tech Stack

| Layer                 | Technology |
|------------------------|------------|
| UI Framework            | React 19 (hooks: `useState`, `useEffect`, `useReducer`, `useRef`, `useMemo`, `useCallback`) |
| Build tool               | [Vite](https://vitejs.dev/) |
| Styling                  | Tailwind CSS 4 + [shadcn](https://ui.shadcn.com/) / [Base UI](https://base-ui.com/) components |
| Charts                   | [Recharts](https://recharts.org/) (`BarChart`, `LineChart`) |
| Icons                    | [lucide-react](https://lucide.dev/) |
| Authentication           | [Firebase Auth](https://firebase.google.com/docs/auth) (email/password + Google OAuth) |
| Database                 | [Firebase Firestore](https://firebase.google.com/docs/firestore) |
| Transactional email      | [EmailJS](https://www.emailjs.com/) (appointment approval/decline notifications) |
| State persistence (local) | Browser `localStorage` |

---

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Low-level shadcn/Base UI primitives
│   ├── Badge.jsx             # Status pill (color-coded by tone)
│   ├── CustomerModal.jsx     # Customer detail/edit modal
│   ├── ErrorBoundary.jsx     # App-wide error boundary
│   ├── Field.jsx              # Labeled form field wrapper with error/hint text
│   ├── MetricCard.jsx        # KPI card used on Dashboard/Invoices/Reports
│   ├── Modal.jsx               # Accessible, focus-trapped modal dialog
│   ├── Navbar.jsx              # Public-site navigation bar
│   ├── ProtectedRoute.jsx    # Auth/role-gated route wrapper
│   ├── Sidebar.jsx             # Dashboard left navigation with section grouping & badges
│   ├── Topbar.jsx               # Dashboard page header, save status, "New work order" CTA
│   └── WorkOrderModal.jsx    # Work order detail/edit modal
├── config/
│   └── firebase.js             # Firebase app initialization (Auth + Firestore)
├── context/
│   ├── AppointmentsContext.jsx # Appointment state + EmailJS approval/decline notifications
│   ├── AuthContext.jsx          # Firebase auth state, login/register/logout, role resolution
│   └── DataContext.jsx          # Dashboard domain data (work orders, customers, invoices, inventory)
├── data/
│   └── seedData.js               # Fallback/demo seed data
├── hooks/
│   └── usePersistedState.js   # Debounced localStorage-backed state hook
├── lib/
│   └── utils.js                   # Shared helpers (e.g. class merging for shadcn components)
├── pages/
│   ├── About.jsx                  # Public "About" page
│   ├── Appointments.jsx        # Public appointments view
│   ├── AppointmentsPage.jsx  # Admin appointments management page
│   ├── Booking.jsx               # Public booking request form
│   ├── Customers.jsx            # Admin customer directory
│   ├── Dashboard.jsx           # Admin KPIs + charts overview
│   ├── Home.jsx                   # Public marketing home page
│   ├── Inventory.jsx            # Admin parts stock table
│   ├── Invoices.jsx              # Admin invoice table + billing KPIs
│   ├── Login.jsx                   # Login page (email/password + Google)
│   ├── NotFound.jsx             # 404 page
│   ├── Register.jsx              # Registration page
│   ├── Reports.jsx                # Admin revenue trend + summary KPIs
│   └── WorkOrders.jsx          # Admin work order table, search, filters, status control
├── utils/
│   ├── constants.js              # Nav config, seed data references, formatters, status logic
│   ├── format.js                    # Formatting helpers (currency, dates, etc.)
│   ├── styles.js                     # Shared style/class helpers
│   └── validation.js               # Form validation for work orders & customers
├── App.jsx                            # Route definitions, admin shell, and modals
├── main.jsx                          # App entry point (Auth + Appointments providers)
└── index.css                         # Tailwind entrypoint + base styles

public/
└── data.json                          # Seed dataset for the dashboard demo
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- A [Firebase](https://firebase.google.com/) project with Email/Password and Google sign-in enabled
- An [EmailJS](https://www.emailjs.com/) account with templates set up for appointment approval and decline emails

### Installation

```bash
git clone https://github.com/JeromeJason-dev/Slipways-Auto.git
cd Slipways-Auto
npm install
```

### Run locally

```bash
npm run dev
```

Then open the app in your browser (typically `http://localhost:5173`).

### Other scripts

```bash
npm run build     # Production build
npm run preview   # Preview the production build locally
npm run lint       # Run ESLint
```

---

## Future Roadmap

- Integration of backend

## License

This project is licensed under the MIT License.