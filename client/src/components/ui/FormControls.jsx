export function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slateboard">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ as = "input", className = "", ...props }) {
  const Component = as;
  return (
    <Component
      className={`min-h-11 rounded-lg border border-slateboard/15 bg-white px-3 py-2.5 text-sm text-ink shadow-sm transition placeholder:text-slateboard/45 hover:border-slateboard/30 ${className}`}
      {...props}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      className="min-h-11 rounded-lg border border-slateboard/15 bg-white px-3 py-2.5 text-sm text-ink shadow-sm transition hover:border-slateboard/30"
      {...props}
    >
      {children}
    </select>
  );
}
