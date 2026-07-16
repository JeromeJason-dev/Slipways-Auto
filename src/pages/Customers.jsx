import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useData } from "../context/DataContext";
import { currency, initials } from "../utils/format";
import { btnPrimaryClass } from "../utils/styles";

export default function Customers({ onNew, newBtnRef }) {
  const { data } = useData();
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      data.customers.filter(
        (c) => !query || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(query.toLowerCase())
      ),
    [data.customers, query]
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex w-[260px] items-center gap-1.5 rounded-lg border border-black/[.14] bg-white px-2.5 py-1.5 text-ink-muted">
          <Search size={13} />
          <input
            className="w-full border-none text-[13px] outline-none"
            placeholder="Search customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search customers"
          />
        </div>
        <button className={btnPrimaryClass} ref={newBtnRef} onClick={onNew}>
          <Plus size={13} /> Add customer
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/[.08] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Customer", "Phone", "Vehicles", "Total visits", "Total spend", "Last visit"].map((h) => (
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
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-black/[.08] last:border-none hover:bg-surface">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="mr-2 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-navy text-[10px] font-semibold text-white">
                        {initials(c.name)}
                      </div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-[11px] text-ink-muted">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{c.vehicles}</td>
                  <td className="px-4 py-3">
                    <strong>{c.visits}</strong>
                  </td>
                  <td className="px-4 py-3 font-medium text-green">{currency(c.spend)}</td>
                  <td className="px-4 py-3">{c.last}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-7 text-center text-ink-muted">
                    No customers match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
