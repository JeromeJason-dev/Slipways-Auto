export default function Field({ label, error, children, hint }) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-xs font-medium text-ink-secondary">{label}</label>
      {children}
      {hint && !error && <div className="mt-1 text-[11px] text-ink-muted">{hint}</div>}
      {error && (
        <div className="mt-1 text-[11px] text-red" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
