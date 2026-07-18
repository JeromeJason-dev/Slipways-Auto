export function currency(n) {
  return "KSh " + Number(n).toLocaleString("en-KE");
}

export function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function statusTone(status) {
  return (
    {
      "In progress": "amber",
      "Waiting parts": "red",
      Scheduled: "blue",
      Complete: "green",
      Paid: "green",
      Sent: "amber",
      Overdue: "red",
    }[status] || "gray"
  );
}

export function formatLastVisit(value) {
  if (!value || value === "—") return "Never";

  // Already a friendly relative string (e.g. "Today", "Yesterday", "3 days ago")
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const visitDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(visitDate.getTime())) return value;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - visitDate) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 6) return `${diffDays} days ago`;

  return visitDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: visitDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}