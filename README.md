# Slipways Auto

A single-page shop management dashboard for auto repair shops — track work orders, customers, invoices, inventory, and revenue reports in one place.

---

## Features

- **Dashboard** — at-a-glance metrics (monthly revenue, open work orders, customers on file, low-stock parts), a 6-month revenue bar chart, and a work-order status breakdown.
- **Work Orders** — searchable/filterable table of jobs, inline status updates, and a validated "New work order" form.
- **Customers** — customer directory with visit history and lifetime spend, plus a validated "Add customer" form.
- **Appointments** - where customers can book appointments for a service they want offered. 
- **Invoices** — invoice list with totals for invoiced, paid, and outstanding amounts.
- **Inventory** — parts tracking with low-stock and out-of-stock indicators.
- **Reports** — year-to-date revenue trend line chart and summary KPIs.
- **Persistence** — app state auto-saves to `localStorage` (debounced), with a "reset to demo data" option.
- **Accessible UI** — focus-trapped modals, keyboard (Esc/Tab) support, ARIA roles/labels on nav, tabs, and live save-status region.

---

## Tech Stack

| Layer            | Technology                     |
|-------------------|--------------------------------|
| UI Framework       | React (hooks: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`) |
| Styling            | Tailwind CSS                   |
| Charts             | [Recharts](https://recharts.org/) (`BarChart`, `LineChart`) |
| Icons              | [lucide-react](https://lucide.dev/) |
| State persistence  | Browser `localStorage`         |

No backend is required — all data is seeded in-memory and persisted client-side.

---

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Badge.jsx        # Status pill (color-coded by tone)
│   │   ├── Field.jsx        # Labeled form field wrapper with error/hint text
│   │   ├── MetricCard.jsx   # KPI card used on Dashboard/Invoices/Reports
│   │   └── Modal.jsx        # Accessible, focus-trapped modal dialog
│   ├── Sidebar.jsx          # Left navigation with section grouping & badges
│   └── Topbar.jsx           # Page header, save status, "New work order" CTA
├── pages/
│   ├── Dashboard.jsx        # KPIs + charts overview
│   ├── WorkOrders.jsx       # Work order table, search, filters, status control
│   ├── Customers.jsx        # Customer directory
│   ├── Invoices.jsx         # Invoice table + billing KPIs
│   ├── Inventory.jsx        # Parts stock table
│   └── Reports.jsx          # YTD revenue trend + summary KPIs
├── utils/
│   ├── constants.js         # Nav config, seed data, formatters, status logic
│   └── validators.js        # Form validation for work orders & customers
├── App.jsx                  
└── index.css                # Tailwind entrypoint + base styles
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A React build setup (e.g. Vite or Create React App) with Tailwind CSS configured

### Installation

```bash
npm install
npm install lucide-react recharts
```

### Run locally

```bash
npm run dev
```

Then open the app in your browser (typically `http://localhost:5173` for Vite).

---

## License
This project is licensed by the MIT license.