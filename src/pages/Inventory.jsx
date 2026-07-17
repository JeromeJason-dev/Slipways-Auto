import { useState } from "react";
import { Filter, Plus, X, Edit2, Check } from "lucide-react"; // Added Edit2 and Check icons
import Badge from "../components/Badge";
import { useData } from "../context/DataContext";
import { currency } from "../utils/format";

export default function Inventory() {
  const { data, addInventoryItem, updateInventoryStock } = useData(); // Destructured correctly
  const [isAdding, setIsAdding] = useState(false);
  
  // Inline editing state
  const [editingSku, setEditingSku] = useState(null);
  const [editStock, setEditStock] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    stock: 0,
    min: 0,
    cost: 0,
  });

  const lowStockCount = data.inventory.filter((i) => i.stock <= i.min).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.sku || !formData.name || !formData.category) {
      alert("Please fill in all required fields.");
      return;
    }

    const success = addInventoryItem(formData);
    if (success) {
      setFormData({ sku: "", name: "", category: "", stock: 0, min: 0, cost: 0 });
      setIsAdding(false);
    }
  };

  const startEditing = (item) => {
    setEditingSku(item.sku);
    setEditStock(item.stock);
  };

  const handleSaveStock = (sku) => {
    updateInventoryStock(sku, editStock);
    setEditingSku(null);
  };

  return (
    <div>
      {/* Header Actions */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-ink-muted">
            <Filter size={13} />
            <span className="text-xs">{data.inventory.length} parts tracked</span>
          </div>
          <Badge tone="red">{lowStockCount} low stock</Badge>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-black/80 transition"
        >
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? "Cancel" : "Add Part"}
        </button>
      </div>

      {/* Add Part Inline Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-black/[.08] bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold">Add New Inventory Item</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-medium uppercase text-ink-muted mb-1">Part Name *</label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-black/[.12] px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase text-ink-muted mb-1">SKU *</label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-black/[.12] px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase text-ink-muted mb-1">Category *</label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-black/[.12] px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase text-ink-muted mb-1">Initial Stock</label>
              <input
                type="number"
                min="0"
                className="w-full rounded-md border border-black/[.12] px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase text-ink-muted mb-1">Min. Stock Alert</label>
              <input
                type="number"
                min="0"
                className="w-full rounded-md border border-black/[.12] px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                value={formData.min}
                onChange={(e) => setFormData({ ...formData, min: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase text-ink-muted mb-1">Unit Cost (KES)</label>
              <input
                type="number"
                min="0"
                className="w-full rounded-md border border-black/[.12] px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-xs font-medium text-white hover:bg-black/80 transition"
            >
              Save to Inventory
            </button>
          </div>
        </form>
      )}

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-lg border border-black/[.08] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Part name", "SKU", "Category", "In stock", "Min. stock", "Unit cost", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-black/[.08] bg-surface px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.inventory.map((p) => {
                const status = p.stock === 0 ? "Out of stock" : p.stock <= p.min ? "Low stock" : "OK";
                const isEditing = editingSku === p.sku;

                return (
                  <tr key={p.sku} className="border-b border-black/[.08] last:border-none hover:bg-surface/50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-ink-secondary">
                        {p.sku}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.category}</td>
                    
                    {/* Editable Stock Column */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          className="w-20 rounded border border-black/[.2] px-2 py-0.5 text-xs focus:outline-none focus:border-black"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveStock(p.sku)}
                          autoFocus
                        />
                      ) : (
                        <span>{p.stock}</span>
                      )}
                    </td>

                    <td className="px-4 py-3">{p.min}</td>
                    <td className="px-4 py-3">{currency(p.cost)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={status === "OK" ? "green" : "red"}>{status}</Badge>
                    </td>

                    {/* Dynamic Action Buttons */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveStock(p.sku)}
                            className="flex items-center justify-center rounded p-1 text-green-600 hover:bg-green-50 transition"
                            title="Save Restock"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingSku(null)}
                            className="flex items-center justify-center rounded p-1 text-slate-400 hover:bg-slate-100 transition"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(p.sku === editingSku ? null : p)}
                          className="flex items-center gap-1 text-[11px] font-medium text-black/60 hover:text-black rounded px-2 py-1 border border-black/[.06] bg-white transition shadow-sm"
                        >
                          <Edit2 size={11} />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}