import {
  LayoutDashboard,
  Wrench,
  Users,
  FileText,
  Package,
  BarChart3,
} from "lucide-react";
import { Calendar } from "lucide-react";

// ---------- App-wide config ----------
export const STORAGE_KEY = "slipways-auto-data";

export const TECHS = ["Brian", "Kevin", "Otieno", "Faith", "Mercy"];

export const STATUSES = ["Scheduled", "In progress", "Waiting on parts", "Complete"];

// ---------- Sidebar navigation ----------
export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "Main" },
  { id: "appointments", label: "Appointments", icon: Calendar, section: "Main" },
  { id: "workorders", label: "Work orders", icon: Wrench, section: "Shop" },
  { id: "customers", label: "Customers", icon: Users, section: "Shop" },
  { id: "invoices", label: "Invoices", icon: FileText, section: "Shop" },
  { id: "inventory", label: "Inventory", icon: Package, section: "Shop" },
  { id: "reports", label: "Reports", icon: BarChart3, section: "Main" },
];

// ---------- Topbar page metadata ----------
export const PAGE_META = {
  dashboard: { title: "Dashboard", breadcrumb: "Overview of shop activity" },
  workorders: { title: "Work Orders", breadcrumb: "Track and manage repairs" },
  customers: { title: "Customers", breadcrumb: "Customer records" },
  invoices: { title: "Invoices", breadcrumb: "Billing and payments" },
  inventory: { title: "Inventory", breadcrumb: "Parts and stock levels" },
  reports: { title: "Reports", breadcrumb: "Shop performance" },
};

// ---------- Seed data ----------
export const seedWorkOrders = [
  {
    id: "WO-81",
    vehicle: "Toyota Camry 2019",
    owner: "James Odhiambo",
    phone: "0712 345 678",
    plate: "KCA 451A",
    service: "Brake pad replacement",
    tech: "Brian",
    cost: 8500,
    status: "In progress",
    due: "Today",
  },
  {
    id: "WO-82",
    vehicle: "Subaru Forester 2016",
    owner: "Naomi Chebet",
    phone: "0722 111 222",
    plate: "KDB 220C",
    service: "Oil change & filter",
    tech: "Kevin",
    cost: 3200,
    status: "Scheduled",
    due: "Tomorrow",
  },
  {
    id: "WO-83",
    vehicle: "Nissan Navara 2020",
    owner: "Peter Mutua",
    phone: "0733 555 999",
    plate: "KDD 019B",
    service: "Suspension check",
    tech: "Otieno",
    cost: 6000,
    status: "Waiting on parts",
    due: "Friday",
  },
  {
    id: "WO-84",
    vehicle: "Mazda Demio 2015",
    owner: "Grace Wambui",
    phone: "0700 222 444",
    plate: "KCF 774D",
    service: "Full service",
    tech: "Faith",
    cost: 9800,
    status: "Complete",
    due: "Yesterday",
  },
];

export const seedCustomers = [
  { id: "C-1", name: "James Odhiambo", email: "james.o@email.com", phone: "0712 345 678", vehicles: 1, visits: 4, spend: 32000, last: "2 days ago" },
  { id: "C-2", name: "Naomi Chebet", email: "naomi.c@email.com", phone: "0722 111 222", vehicles: 2, visits: 7, spend: 54500, last: "1 week ago" },
  { id: "C-3", name: "Peter Mutua", email: "peter.m@email.com", phone: "0733 555 999", vehicles: 1, visits: 2, spend: 12000, last: "3 weeks ago" },
  { id: "C-4", name: "Grace Wambui", email: "grace.w@email.com", phone: "0700 222 444", vehicles: 1, visits: 9, spend: 78000, last: "Yesterday" },
];

export const seedInvoices = [
  { id: "INV-201", customer: "James Odhiambo", amount: 8500, status: "Paid", date: "2026-07-10" },
  { id: "INV-202", customer: "Naomi Chebet", amount: 3200, status: "Pending", date: "2026-07-12" },
  { id: "INV-203", customer: "Peter Mutua", amount: 6000, status: "Pending", date: "2026-07-13" },
  { id: "INV-204", customer: "Grace Wambui", amount: 9800, status: "Paid", date: "2026-07-14" },
];

export const seedInventory = [
  { id: "P-01", name: "Brake pads (front)", stock: 6, min: 5, unit: "set" },
  { id: "P-02", name: "Engine oil 5W-30", stock: 12, min: 10, unit: "litre" },
  { id: "P-03", name: "Oil filter", stock: 3, min: 8, unit: "pc" },
  { id: "P-04", name: "Air filter", stock: 4, min: 5, unit: "pc" },
  { id: "P-05", name: "Shock absorber", stock: 2, min: 4, unit: "pc" },
];

export const seedRevenue = [
  { month: "Feb", revenue: 210000 },
  { month: "Mar", revenue: 245000 },
  { month: "Apr", revenue: 198000 },
  { month: "May", revenue: 267000 },
  { month: "Jun", revenue: 289000 },
  { month: "Jul", revenue: 154000 },
];