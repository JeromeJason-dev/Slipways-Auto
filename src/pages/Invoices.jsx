import { FileText, Check, ArrowDown } from "lucide-react";
import MetricCard from "../components/MetricCard";
import Badge from "../components/Badge";
import { useData } from "../context/DataContext";
import { currency, statusTone } from "../utils/format";

export default function Invoices() {
  const { data, derived } = useData();

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <MetricCard icon={FileText} tone="orange" label="Total invoiced" value={currency(derived.invoicedTotal)} />
        <MetricCard
          icon={Check}
          tone="teal"
          label="Paid"
          value={currency(derived.paidTotal)}
          sub={`${data.invoices.filter((i) => i.status === "Paid").length} invoices`}
        />
        <MetricCard
          icon={ArrowDown}
          tone="blue"
          label="Outstanding"
          value={currency(derived.outstanding)}
          sub={`${data.invoices.filter((i) => i.status === "Overdue").length} overdue`}
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-black/[.08] bg-white">
        <div className="border-b border-black/[.08] px-[18px] py-3.5">
          <span className="text-[13px] font-semibold">Invoices</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["#", "Customer", "Service", "Date", "Amount", "Status"].map((h) => (
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
              {data.invoices.map((i) => (
                <tr key={i.id} className="border-b border-black/[.08] last:border-none hover:bg-surface">
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-ink-secondary">
                      {i.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">{i.customer}</td>
                  <td className="px-4 py-3 text-ink-muted">{i.service}</td>
                  <td className="px-4 py-3 text-ink-muted">{i.date}</td>
                  <td className="px-4 py-3">
                    <strong>{currency(i.amount)}</strong>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(i.status)}>{i.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
