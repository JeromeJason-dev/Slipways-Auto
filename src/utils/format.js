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
