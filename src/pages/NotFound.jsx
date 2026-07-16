import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 px-10 py-16 text-center text-ink-muted">
      <p>Page not found. Use the sidebar to navigate, or go back to the dashboard.</p>
      <Link
        to="/"
        className="rounded-lg border border-black/[.14] bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink hover:bg-surface"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
