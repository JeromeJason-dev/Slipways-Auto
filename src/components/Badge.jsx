const TONES = {
  green: "bg-green-soft text-[#15803D]",
  amber: "bg-amber-soft text-[#92400E]",
  red: "bg-red-soft text-[#B91C1C]",
  blue: "bg-blue-soft text-[#1D4ED8]",
  teal: "bg-teal-soft text-[#0F766E]",
  gray: "bg-surface-2 text-ink-secondary",
};

export default function Badge({ tone = "gray", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONES[tone] || TONES.gray}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
