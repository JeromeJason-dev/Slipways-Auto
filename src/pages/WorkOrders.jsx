import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useData } from "../context/DataContext";
import { STATUSES } from "../data/seedData";
import { currency, initials, statusTone } from "../utils/format";
import { btnPrimaryClass } from "../utils/styles";

export default function WorkOrders({ onNew, newBtnRef }) {
  const { data, derived, setWorkOrderStatus } = useData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const rows = useMemo(
    () =>
      data.workOrders.filter((w) => {
        const matchesQuery =
          !query || `${w.vehicle} ${w.owner} ${w.plate} ${w.id}`.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = statusFilter === "All" || w.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [data.workOrders, query, statusFilter]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-2">
          <button className={btnPrimaryClass} ref={newBtnRef} onClick={onNew}>
            <Plus size={13} /> New work order
          </button>
          <div className="flex w-[260px] items-center gap-1.5 rounded-lg border border-black/[.14] bg-white px-2.5 py-1.5 text-ink-muted">
            <Search size={13} />
            <input
              className="w-full border-none text-[13px] outline-none"
              placeholder="Search vehicle, owner, plate, ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search work orders"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
          <button
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              statusFilter === "All" ? "border-navy bg-navy text-white" : "border-black/[.14] bg-white text-ink-secondary"
            }`}
            onClick={() => setStatusFilter("All")}
          >
            All ({data.workOrders.length})
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                statusFilter === s ? "border-navy bg-navy text-white" : "border-black/[.14] bg-white text-ink-secondary"
              }`}
              onClick={() => setStatusFilter(s)}
            >
              {s} ({derived.statusCounts[s]})
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/[.08] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["#", "Vehicle", "Service", "Technician", "Est. cost", "Status", "Due"].map((h) => (
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
              {rows.map((w) => (
                <tr key={w.id} className="border-b border-black/[.08] last:border-none hover:bg-surface">
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-ink-secondary">
                      {w.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{w.vehicle}</div>
                    <div className="text-[11px] text-ink-muted">
                      {w.owner} · {w.plate}
                    </div>
                  </td>
                  <td className="px-4 py-3">{w.service}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="mr-2 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-navy text-[10px] font-semibold text-white">
                        {initials(w.tech)}
                      </div>
                      {w.tech}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{currency(w.cost)}</td>
                  <td className="px-4 py-3">
                    <label className="sr-only" htmlFor={`status-${w.id}`}>
                      Status for {w.id}
                    </label>
                    <select
                      id={`status-${w.id}`}
                      className={`status-select cursor-pointer rounded-full border-none px-2.5 py-1 text-[11px] font-semibold ${badgeBg(
                        statusTone(w.status)
                      )}`}
                      value={w.status}
                      onChange={(e) => setWorkOrderStatus(w.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">{w.due}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-7 text-center text-ink-muted">
                    No work orders match your search.
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

function badgeBg(tone) {
  return (
    {
      green: "bg-green-soft text-[#15803D]",
      amber: "bg-amber-soft text-[#92400E]",
      red: "bg-red-soft text-[#B91C1C]",
      blue: "bg-blue-soft text-[#1D4ED8]",
      teal: "bg-teal-soft text-[#0F766E]",
      gray: "bg-surface-2 text-ink-secondary",
    }[tone] || "bg-surface-2 text-ink-secondary"
  );
}
