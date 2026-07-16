import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUp, Wrench, Users } from "lucide-react";
import MetricCard from "../components/MetricCard";
import { useData } from "../context/DataContext";
import { currency } from "../utils/format";

export default function Reports() {
  const { data } = useData();
  const jobsCompleted = data.workOrders.filter((w) => w.status === "Complete").length;
  const revenueYTD = data.revenue.reduce((s, r) => s + r.revenue, 0);

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <MetricCard
          icon={ArrowUp}
          tone="orange"
          label="Revenue YTD"
          value={currency(revenueYTD)}
          delta="↑ 18% vs last year"
          deltaTone="up"
        />
        <MetricCard icon={Wrench} tone="teal" label="Jobs completed" value={jobsCompleted} sub="from current work orders" />
        <MetricCard icon={Users} tone="blue" label="Customer satisfaction" value="4.8 / 5" sub="based on 128 reviews" />
      </div>

      <div className="overflow-hidden rounded-lg border border-black/[.08] bg-white">
        <div className="border-b border-black/[.08] px-[18px] py-3.5">
          <span className="text-[13px] font-semibold">Monthly revenue</span>
        </div>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.revenue} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => currency(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#F4821F" strokeWidth={2} dot={{ fill: "#F4821F", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
