import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "slipways-auto-data";
const API_URL = "/data.json"; 

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
          appointments: json.appointments || [], // Fallback if missing in original seed
          invoices: json.invoices,
          inventory: json.inventory,
          revenue: json.revenue,
        };
        seedRef.current = seed;
        setMeta({ techs: json.meta.techs, statuses: json.meta.statuses });

        let initial = seed;
        try {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            // Ensure appointments array exists in cached schemas
            if (!parsed.appointments) parsed.appointments = [];
            initial = parsed;
          }
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

  const updateCustomer = (id, patch) => {
    setData((d) => ({
      ...d,
      customers: d.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };

  const deleteCustomer = (id) => {
    setData((d) => ({
      ...d,
      customers: d.customers.filter((c) => c.id !== id),
    }));
  };

  const addInventoryItem = (item) => {
    let success = true;

    setData((d) => {
      const skuExists = d.inventory.some(
        (i) => i.sku.toLowerCase() === item.sku.trim().toLowerCase()
      );
      
      if (skuExists) {
        alert(`An item with SKU "${item.sku}" already exists.`);
        success = false;
        return d;
      }

      const newItem = {
        sku: item.sku.trim().toUpperCase(),
        name: item.name.trim(),
        category: item.category.trim(),
        stock: Number(item.stock) || 0,
        min: Number(item.min) || 0,
        cost: Number(item.cost) || 0,
      };

      return {
        ...d,
        inventory: [...d.inventory, newItem],
      };
    });

    return success;
  };

  const updateInventoryStock = (sku, newStock) => {
    setData((d) => ({
      ...d,
      inventory: d.inventory.map((item) =>
        item.sku === sku ? { ...item, stock: Math.max(0, Number(newStock) || 0) } : item
      ),
    }));
  };

  // Handler to approve appointment and seamlessly add or increment the customer record
  const approveAppointment = (appointmentId) => {
    setData((d) => {
      const appointment = d.appointments?.find((app) => app.id === appointmentId);
      if (!appointment) return d;

      const updatedAppointments = d.appointments.map((app) =>
        app.id === appointmentId ? { ...app, status: "approved" } : app
      );

      const existingCustomerIndex = d.customers.findIndex(
        (c) => c.email === appointment.contactEmail || c.phone === appointment.contactPhone
      );

      let updatedCustomers = [...d.customers];

      if (existingCustomerIndex > -1) {
        const currentCustomer = updatedCustomers[existingCustomerIndex];
        const currentVehicles = currentCustomer.vehicles ? String(currentCustomer.vehicles) : "";
        
        const vehicleList = currentVehicles.includes(appointment.vehicle)
          ? currentVehicles
          : currentVehicles 
            ? `${currentVehicles}, ${appointment.vehicle}` 
            : appointment.vehicle;

        updatedCustomers[existingCustomerIndex] = {
          ...currentCustomer,
          vehicles: vehicleList,
          visits: (Number(currentCustomer.visits) || 0) + 1,
          last: appointment.date,
        };
      } else {
        const newCustomer = {
          id: `cust-${Date.now()}`,
          name: appointment.contactName,
          email: appointment.contactEmail,
          phone: appointment.contactPhone,
          vehicles: appointment.vehicle,
          visits: 1,
          spend: 0,
          last: appointment.date,
        };
        updatedCustomers.unshift(newCustomer); // Adds to the top of the table view
      }

      return {
        ...d,
        appointments: updatedAppointments,
        customers: updatedCustomers,
      };
    });
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
        updateCustomer,
        deleteCustomer,
        addInventoryItem, 
        updateInventoryStock,
        approveAppointment,
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