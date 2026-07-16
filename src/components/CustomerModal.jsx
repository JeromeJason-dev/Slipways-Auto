import { useState } from "react";
import { Check } from "lucide-react";
import Modal from "./Modal";
import Field from "./Field";
import { validateCustomer } from "../utils/validation";
import { inputClass, btnClass, btnPrimaryClass } from "../utils/styles";
import { useData } from "../context/DataContext";

const EMPTY = { name: "", phone: "", email: "" };

export default function CustomerModal({ open, onClose, triggerRef }) {
  const { addCustomer } = useData();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

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
    addCustomer(form);
    handleClose();
  }

  return (
    <Modal
      open={open}
      title="Add customer"
      onClose={handleClose}
      triggerRef={triggerRef}
      footer={
        <>
          <button className={btnClass} onClick={handleClose} type="button">
            Cancel
          </button>
          <button className={btnPrimaryClass} form="cust-form" type="submit">
            <Check size={13} /> Add customer
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
        </form>
      )}
    </Modal>
  );
}
