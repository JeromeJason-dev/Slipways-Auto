const ICON_TONES = {
  orange: "bg-accent-soft text-accent",
  teal: "bg-teal-soft text-teal",
  blue: "bg-blue-soft text-blue",
  green: "bg-green-soft text-green",
};

const STRIPE_TONES = {
  orange: "before:bg-accent",
  teal: "before:bg-teal",
  blue: "before:bg-blue",
  green: "before:bg-green",
};

export default function MetricCard({ icon: Icon, tone = "orange", label, value, delta, deltaTone, sub }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-black/[.08] bg-white p-4 before:absolute before:inset-y-0 before:left-0 before:w-[3px] ${STRIPE_TONES[tone] || STRIPE_TONES.orange}`}
    >
      <div className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg ${ICON_TONES[tone] || ICON_TONES.orange}`}>
        <Icon size={16} />
      </div>
      <div className="mb-1 text-xs text-ink-muted">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {delta && (
        <div className={`mt-1 text-xs ${deltaTone === "up" ? "text-green" : "text-ink-muted"}`}>{delta}</div>
      )}
      {sub && <div className="mt-1 text-xs text-ink-muted">{sub}</div>}
    </div>
  );
}
