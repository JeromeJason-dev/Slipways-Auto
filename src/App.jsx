import { useState, useRef, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import Modal from "./components/Modal";
import Field from "./components/Field";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import WorkOrders from "./pages/WorkOrders";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Home from "./pages/Home";
import About from "./pages/About";
import Appointments from "./pages/Appointments";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Booking from "./pages/Booking";
import AppointmentsPage from "./pages/AppointmentsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataProvider, useData } from "./context/DataContext";
import { validateWorkOrder, validateCustomer } from "./utils/validation";

function HomePage() {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased">
      <Navbar />
      <Home />
    </div>
  );
}

function AdminApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = location.pathname.replace(/^\/dashboard\/?/, "") || "dashboard";

  const { data, setData, saveState, resetData, techs, statuses } = useData();

  const [modal, setModal] = useState(null);
  const newWOBtnRef = useRef(null);
  const newCustBtnRef = useRef(null);

  const [woForm, setWoForm] = useState({
    owner: "",
    phone: "",
    vehicle: "",
    plate: "",
    service: "",
    tech: techs[0],
    cost: "",
  });
  const [woErrors, setWoErrors] = useState({});
  const [custForm, setCustForm] = useState({ name: "", phone: "", email: "" });
  const [custErrors, setCustErrors] = useState({});

  const openWOModal = () => {
    setWoForm({
      owner: "",
      phone: "",
      vehicle: "",
      plate: "",
      service: "",
      tech: techs[0],
      cost: "",
    });
    setWoErrors({});
    setModal("workorder");
  };
  const openCustModal = () => {
    setCustForm({ name: "", phone: "", email: "" });
    setCustErrors({});
    setModal("customer");
  };
  const closeModal = () => setModal(null);

  const submitWorkOrder = (e) => {
    e.preventDefault();
    const errs = validateWorkOrder(woForm);
    setWoErrors(errs);
    if (Object.keys(errs).length) return;

    setData((d) => {
      const nums = d.workOrders
        .map((w) => parseInt(w.id.split("-")[1], 10))
        .filter((n) => !isNaN(n));
      const nextNum = (nums.length ? Math.max(...nums) : 80) + 1;
      const newWO = {
        id: `WO-${nextNum}`,
        vehicle: woForm.vehicle.trim(),
        owner: woForm.owner.trim(),
        phone: woForm.phone.trim(),
        plate: woForm.plate.trim().toUpperCase(),
        service: woForm.service.trim(),
        tech: woForm.tech,
        cost: Number(woForm.cost),
        status: "Scheduled",
        due: "Today",
      };
      return { ...d, workOrders: [newWO, ...d.workOrders] };
    });
    closeModal();
  };

  const submitCustomer = (e) => {
    e.preventDefault();
    const errs = validateCustomer(custForm);
    setCustErrors(errs);
    if (Object.keys(errs).length) return;

    setData((d) => ({
      ...d,
      customers: [
        {
          id: `C-${Date.now()}`,
          name: custForm.name.trim(),
          email: custForm.email.trim(),
          phone: custForm.phone.trim(),
          vehicles: 1,
          visits: 0,
          spend: 0,
          last: "—",
        },
        ...d.customers,
      ],
    }));
    closeModal();
  };

  const setWOStatus = (id, status) => {
    setData((d) => ({
      ...d,
      workOrders: d.workOrders.map((w) => (w.id === id ? { ...w, status } : w)),
    }));
  };

  const derived = useMemo(() => {
    return {
      open: data.workOrders.filter((w) => w.status !== "Complete"),
      statusCounts: statuses.reduce(
        (acc, s) => ({
          ...acc,
          [s]: data.workOrders.filter((w) => w.status === s).length,
        }),
        {},
      ),
      revenueThisMonth: data.revenue[data.revenue.length - 1]?.revenue || 0,
      lowStock: data.inventory.filter((i) => i.stock <= i.min),
      invoicedTotal: data.invoices.reduce((s, i) => s + i.amount, 0),
      paidTotal: data.invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0),
      get outstanding() {
        return this.invoicedTotal - this.paidTotal;
      },
    };
  }, [data, statuses]);

  const goTo = (nextPage) => navigate(nextPage === "dashboard" ? "/dashboard" : `/dashboard/${nextPage}`);

  return (
    <div className="bg-slate-50 h-screen overflow-hidden text-slate-900 font-sans selection:bg-orange-500/20 antialiased">
      <div className="flex h-screen">
        <Sidebar page={page} derived={derived} resetData={resetData} onNavigate={goTo} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar page={page} saveState={saveState} openWOModal={openWOModal} newWOBtnRef={newWOBtnRef} />

          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route index element={<Dashboard data={data} derived={derived} />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route
                path="workorders"
                element={
                  <WorkOrders
                    data={data}
                    derived={derived}
                    onNew={openWOModal}
                    newBtnRef={newWOBtnRef}
                    onStatus={setWOStatus}
                  />
                }
              />
              <Route path="customers" element={<Customers data={data} onNew={openCustModal} newBtnRef={newCustBtnRef} />} />
              <Route path="invoices" element={<Invoices data={data} derived={derived} />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<Reports data={data} derived={derived} />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* MODAL CONFIGURATORS */}
      <Modal
        open={modal === "workorder"}
        title="New work order"
        onClose={closeModal}
        triggerRef={newWOBtnRef}
        footer={
          <>
            <button
              className="px-3 py-1.5 border border-slate-200 text-xs font-medium text-slate-600 rounded-lg bg-white hover:bg-slate-50 cursor-pointer"
              onClick={closeModal}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 bg-orange-500 text-xs font-medium text-white rounded-lg hover:bg-orange-600 flex items-center gap-1 cursor-pointer"
              form="wo-form"
              type="submit"
            >
              <Check size={13} /> Create work order
            </button>
          </>
        }
      >
        {(firstFieldRef) => (
          <form id="wo-form" onSubmit={submitWorkOrder} noValidate className="space-y-1">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Customer name" error={woErrors.owner}>
                <input
                  ref={firstFieldRef}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500"
                  value={woForm.owner}
                  onChange={(e) => setWoForm({ ...woForm, owner: e.target.value })}
                  placeholder="James Odhiambo"
                />
              </Field>
              <Field label="Phone number" error={woErrors.phone}>
                <input
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500"
                  value={woForm.phone}
                  onChange={(e) => setWoForm({ ...woForm, phone: e.target.value })}
                  placeholder="07xx xxx xxx"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Vehicle make & model" error={woErrors.vehicle}>
                <input
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500"
                  value={woForm.vehicle}
                  onChange={(e) => setWoForm({ ...woForm, vehicle: e.target.value })}
                  placeholder="Toyota Camry 2019"
                />
              </Field>
              <Field label="Number plate" error={woErrors.plate}>
                <input
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500"
                  value={woForm.plate}
                  onChange={(e) => setWoForm({ ...woForm, plate: e.target.value })}
                  placeholder="KCA 451A"
                />
              </Field>
            </div>
            <Field label="Service required" error={woErrors.service}>
              <textarea
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500"
                rows={2}
                value={woForm.service}
                onChange={(e) => setWoForm({ ...woForm, service: e.target.value })}
                placeholder="Describe the issue..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Assign technician">
                <select
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-orange-500"
                  value={woForm.tech}
                  onChange={(e) => setWoForm({ ...woForm, tech: e.target.value })}
                >
                  {techs.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Estimated cost (KSh)" error={woErrors.cost}>
                <input
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500"
                  type="number"
                  min="1"
                  value={woForm.cost}
                  onChange={(e) => setWoForm({ ...woForm, cost: e.target.value })}
                  placeholder="0"
                />
              </Field>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={modal === "customer"}
        title="Add customer"
        onClose={closeModal}
        triggerRef={newCustBtnRef}
        footer={
          <>
            <button
              className="px-3 py-1.5 border border-slate-200 text-xs font-medium text-slate-600 rounded-lg bg-white hover:bg-slate-50 cursor-pointer"
              onClick={closeModal}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 bg-orange-500 text-xs font-medium text-white rounded-lg hover:bg-orange-600 flex items-center gap-1 cursor-pointer"
              form="cust-form"
              type="submit"
            >
              <Check size={13} /> Add customer
            </button>
          </>
        }
      >
        {(firstFieldRef) => (
          <form id="cust-form" onSubmit={submitCustomer} noValidate className="space-y-1">
            <Field label="Full name" error={custErrors.name}>
              <input
                ref={firstFieldRef}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500"
                value={custForm.name}
                onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                placeholder="Naomi Chebet"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone number" error={custErrors.phone}>
                <input
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500"
                  value={custForm.phone}
                  onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                  placeholder="07xx xxx xxx"
                />
              </Field>
              <Field label="Email" error={custErrors.email}>
                <input
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500"
                  value={custForm.email}
                  onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
                  placeholder="name@email.com"
                />
              </Field>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute adminOnly>
              <DataProvider>
                <AdminApp />
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/booking" element={<Booking />} />
        <Route path="/about" element={<About />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}