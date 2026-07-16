import { useState } from "react";
import { Check } from "lucide-react";
import Modal from "./Modal.jsx";
import Field from "./Field.jsx";
import { TECHS } from "../data/seedData.js";
import { validateWorkOrder } from "../utils/validation.js";
import { inputClass, btnClass, btnPrimaryClass } from "../utils/styles.js";
import { useData } from "../context/DataContext.jsx";

const EMPTY = { owner: "", phone: "", vehicle: "", plate: "", service: "", tech: TECHS[0], cost: "" };

export default function WorkOrderModal({ open, onClose, triggerRef }) {
  const { addWorkOrder } = useData();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function handleClose() {
    setForm(EMPTY);
    setErrors({});
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validateWorkOrder(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    addWorkOrder(form);
    handleClose();
  }

  return (
    <Modal
      open={open}
      title="New work order"
      onClose={handleClose}
      triggerRef={triggerRef}
      footer={
        <>
          <button className={btnClass} onClick={handleClose} type="button">
            Cancel
          </button>
          <button className={btnPrimaryClass} form="wo-form" type="submit">
            <Check size={13} /> Create work order
          </button>
        </>
      }
    >
      {(firstFieldRef) => (
        <form id="wo-form" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Customer name" error={errors.owner}>
              <input
                ref={firstFieldRef}
                className={inputClass}
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                aria-invalid={!!errors.owner}
                placeholder="e.g. James Odhiambo"
              />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                aria-invalid={!!errors.phone}
                placeholder="07xx xxx xxx"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vehicle (make, model, year)" error={errors.vehicle}>
              <input
                className={inputClass}
                value={form.vehicle}
                onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                aria-invalid={!!errors.vehicle}
                placeholder="e.g. Toyota Camry 2019"
              />
            </Field>
            <Field label="Number plate" error={errors.plate}>
              <input
                className={inputClass}
                value={form.plate}
                onChange={(e) => setForm({ ...form, plate: e.target.value })}
                aria-invalid={!!errors.plate}
                placeholder="e.g. KCA 451A"
              />
            </Field>
          </div>
          <Field label="Service required" error={errors.service}>
            <textarea
              className={inputClass}
              rows={2}
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              aria-invalid={!!errors.service}
              placeholder="Describe the issue or service needed..."
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Assign technician">
              <select
                className={inputClass}
                value={form.tech}
                onChange={(e) => setForm({ ...form, tech: e.target.value })}
              >
                {TECHS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Estimated cost (KSh)" error={errors.cost}>
              <input
                className={inputClass}
                type="number"
                min="1"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                aria-invalid={!!errors.cost}
                placeholder="0"
              />
            </Field>
          </div>
        </form>
      )}
    </Modal>
  );
}
