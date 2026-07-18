import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Modal from "./Modal";
import Field from "./Field";
import { validateCustomer } from "../utils/validation";
import { inputClass, btnClass, btnPrimaryClass } from "../utils/styles";
import { useData } from "../context/DataContext";

const EMPTY = { name: "", phone: "", email: "", visits: "", spend: "", last: "" };

export default function CustomerModal({ open, onClose, triggerRef, customer = null }) {
  const { addCustomer, updateCustomer } = useData();
  const isEdit = !!customer;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // populate form when opening in edit mode, reset when opening in add mode
  useEffect(() => {
    if (!open) return;
    if (customer) {
      setForm({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        visits: customer.visits ?? "",
        spend: customer.spend ?? "",
        last: customer.last && customer.last !== "—" ? customer.last : "",
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [open, customer]);

  function handleClose() {
    setForm(EMPTY);
    setErrors({});
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validateCustomer(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      ...form,
      visits: form.visits === "" ? 0 : Number(form.visits),
      spend: form.spend === "" ? 0 : Number(form.spend),
      last: form.last.trim() === "" ? "—" : form.last.trim(),
    };

    if (isEdit) {
      updateCustomer(customer.id, payload);
    } else {
      addCustomer(payload);
    }
    handleClose();
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit customer" : "Add customer"}
      onClose={handleClose}
      triggerRef={triggerRef}
      footer={
        <>
          <button className={btnClass} onClick={handleClose} type="button">
            Cancel
          </button>
          <button className={btnPrimaryClass} form="cust-form" type="submit">
            <Check size={13} /> {isEdit ? "Save changes" : "Add customer"}
          </button>
        </>
      }
    >
      {(firstFieldRef) => (
        <form id="cust-form" onSubmit={handleSubmit} noValidate>
          <Field label="Full name" error={errors.name}>
            <input
              ref={firstFieldRef}
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              aria-invalid={!!errors.name}
              placeholder="e.g. Naomi Chebet"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone number" error={errors.phone}>
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                aria-invalid={!!errors.phone}
                placeholder="07xx xxx xxx"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={!!errors.email}
                placeholder="name@email.com"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Total visits" error={errors.visits}>
              <input
                type="number"
                min="0"
                step="1"
                className={inputClass}
                value={form.visits}
                onChange={(e) => setForm({ ...form, visits: e.target.value })}
                aria-invalid={!!errors.visits}
                placeholder="0"
              />
            </Field>
            <Field label="Total spend" error={errors.spend}>
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                value={form.spend}
                onChange={(e) => setForm({ ...form, spend: e.target.value })}
                aria-invalid={!!errors.spend}
                placeholder="0.00"
              />
            </Field>
            <Field label="Last visit" error={errors.last}>
              <input
                type="text"
                className={inputClass}
                value={form.last}
                onChange={(e) => setForm({ ...form, last: e.target.value })}
                aria-invalid={!!errors.last}
                placeholder="e.g. 2024-06-12 or Never"
              />
            </Field>
          </div>
        </form>
      )}
    </Modal>
  );
}