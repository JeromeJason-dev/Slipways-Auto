import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUp, ClipboardList, Users, Boxes } from "lucide-react";
import MetricCard from "../components/MetricCard.jsx";
import { currency, statusTone } from "../utils/format.js";
import { STATUSES } from "../data/seedData.js";

// Solid fill colors matching the badge tones used in WorkOrders.jsx
const TONE_FILL = {
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  blue: "#3B82F6",
  teal: "#14B8A6",
  gray: "#94A3B8",
};

function barFill(tone) {
  return TONE_FILL[tone] || TONE_FILL.gray;
}

// Destructure data and derived from props instead of context
export default function Dashboard({ data, derived }) {
  // Guard clause to prevent rendering if data/derived are not fully loaded
  if (!data || !derived) return null;

  return (
    <div>
      <div className="mb-5 grid grid-cols-4 gap-3">
        <MetricCard
          icon={ArrowUp}
          tone="orange"
          label="Revenue this month"
          value={currency(derived.revenueThisMonth)}
          delta="↑ 12% vs last month"
          deltaTone="up"
        />
        <MetricCard
          icon={ClipboardList}
          tone="teal"
          label="Open work orders"
          value={derived.open.length}
          sub={`${derived.statusCounts["In progress"] || 0} in progress`}
        />
        <MetricCard icon={Users} tone="blue" label="Customers on file" value={data.customers.length} sub="live count" />
        <MetricCard
          icon={Boxes}
          tone="green"
          label="Low stock parts"
          value={derived.lowStock.length}
          sub="needs restocking"
        />
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-4">
        <div className="overflow-hidden rounded-lg border border-black/[.08] bg-white">
          <div className="flex items-center justify-between border-b border-black/[.08] px-[18px] py-3.5">
            <span className="text-[13px] font-semibold">Revenue — last 6 months</span>
            <span className="text-[11px] text-ink-muted">KSh</span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenue} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => currency(v)} />
                <Bar dataKey="revenue" fill="#FDE8D3" stroke="#F4821F" strokeWidth={1.5} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-black/[.08] bg-white">
          <div className="border-b border-black/[.08] px-[18px] py-3.5">
            <span className="text-[13px] font-semibold">Work orders by status</span>
          </div>
          <div className="px-[18px] py-3.5">
            {STATUSES.map((s) => (
              <div key={s} className="mb-3 grid grid-cols-[100px_1fr_36px] items-center gap-2.5 text-xs">
                <div>{s}</div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(4, ((derived.statusCounts[s] || 0) / (data.workOrders.length || 1)) * 100)}%`,
                      backgroundColor: barFill(statusTone(s)),
                    }}
                  />
                </div>
                <div className="text-right font-semibold">{derived.statusCounts[s] || 0}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}