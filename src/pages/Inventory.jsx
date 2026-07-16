import { Filter } from "lucide-react";
import Badge from "../components/Badge";
import { useData } from "../context/DataContext";
import { currency } from "../utils/format";

export default function Inventory() {
  const { data } = useData();
  const lowStockCount = data.inventory.filter((i) => i.stock <= i.min).length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-ink-muted">
          <Filter size={13} />
          <span className="text-xs">{data.inventory.length} parts tracked</span>
        </div>
        <Badge tone="red">{lowStockCount} low stock</Badge>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/[.08] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Part name", "SKU", "Category", "In stock", "Min. stock", "Unit cost", "Status"].map((h) => (
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
                return (
                  <tr key={p.sku} className="border-b border-black/[.08] last:border-none hover:bg-surface">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-ink-secondary">
                        {p.sku}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">{p.min}</td>
                    <td className="px-4 py-3">{currency(p.cost)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={status === "OK" ? "green" : "red"}>{status}</Badge>
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
