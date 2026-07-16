import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "slipways-auto-data";
const API_URL = "/data.json"; // swap for a real endpoint later, e.g. "/api/garage-data"

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveState, setSaveState] = useState("idle");
  const [meta, setMeta] = useState({ techs: [], statuses: [] });
  const seedRef = useRef(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
        return res.json();
      })
      .then((json) => {
        const seed = {
          workOrders: json.workOrders,
          customers: json.customers,
          invoices: json.invoices,
          inventory: json.inventory,
          revenue: json.revenue,
        };
        seedRef.current = seed;
        setMeta({ techs: json.meta.techs, statuses: json.meta.statuses });

        let initial = seed;
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) initial = JSON.parse(cached);
        } catch {
          // corrupt cache — ignore, use fresh seed
        }
        setData(initial);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data) return;
    setSaveState("saving");
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaveState("saved");
      } catch {
        setSaveState("idle");
      }
    }, 400);
    return () => clearTimeout(t);
  }, [data]);

  const resetData = () => {
    if (!seedRef.current) return;
    if (!window.confirm("Reset all data back to the sample demo data? This can't be undone.")) return;
    setData({ ...seedRef.current });
  };

  const setWorkOrderStatus = (id, status) => {
    setData((d) => ({
      ...d,
      workOrders: d.workOrders.map((w) => (w.id === id ? { ...w, status } : w)),
    }));
  };

  const addWorkOrder = (workOrder) => {
    setData((d) => {
      const nums = d.workOrders.map((w) => parseInt(w.id.split("-")[1], 10)).filter((n) => !isNaN(n));
      const nextNum = (nums.length ? Math.max(...nums) : 80) + 1;
      const newWO = { id: `WO-${nextNum}`, status: "Scheduled", due: "Today", ...workOrder };
      return { ...d, workOrders: [newWO, ...d.workOrders] };
    });
  };

  const addCustomer = (customer) => {
    setData((d) => ({
      ...d,
      customers: [{ id: `C-${Date.now()}`, vehicles: 1, visits: 0, spend: 0, last: "—", ...customer }, ...d.customers],
    }));
  };

  const derived = useMemo(() => {
    if (!data) return null;
    return {
      open: data.workOrders.filter((w) => w.status !== "Complete"),
      statusCounts: meta.statuses.reduce(
        (acc, s) => ({ ...acc, [s]: data.workOrders.filter((w) => w.status === s).length }),
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
  }, [data, meta.statuses]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-500">
        Loading data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-red-500">
        Couldn't load data: {error}
      </div>
    );
  }

  return (
    <DataContext.Provider
      value={{
        data,
        derived,
        setData,
        saveState,
        resetData,
        setWorkOrderStatus,
        addWorkOrder,
        addCustomer,
        techs: meta.techs,
        statuses: meta.statuses,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}