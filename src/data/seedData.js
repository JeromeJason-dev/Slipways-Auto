export const TECHS = ["Carlos R.", "Fatuma K.", "David O.", "Moses N."];
export const STATUSES = ["Scheduled", "In progress", "Waiting parts", "Complete"];

export function freshData() {
  return {
    workOrders: seedWorkOrders,
    customers: seedCustomers,
    invoices: seedInvoices,
    inventory: seedInventory,
    revenue: seedRevenue,
  };
}
