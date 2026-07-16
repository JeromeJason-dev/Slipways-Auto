export function validateWorkOrder(f) {
  const e = {};
  if (!f.owner.trim()) e.owner = "Customer name is required.";
  if (!/^0\d{9}$/.test(f.phone.replace(/\s/g, "")))
    e.phone = "Enter a valid phone number, e.g. 0722 001 234.";
  if (!f.vehicle.trim()) e.vehicle = "Vehicle make, model and year are required.";
  if (!/^K[A-Z]{2}\s?\d{3}[A-Z]$/i.test(f.plate.trim()))
    e.plate = "Enter a valid plate, e.g. KCA 451A.";
  if (!f.service.trim()) e.service = "Describe the service needed.";
  if (!f.cost || isNaN(f.cost) || Number(f.cost) <= 0)
    e.cost = "Enter a cost greater than 0.";
  return e;
}

export function validateCustomer(f) {
  const e = {};
  if (!f.name.trim()) e.name = "Name is required.";
  if (!/^0\d{9}$/.test(f.phone.replace(/\s/g, "")))
    e.phone = "Enter a valid phone number, e.g. 0722 001 234.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    e.email = "Enter a valid email address.";
  return e;
}
