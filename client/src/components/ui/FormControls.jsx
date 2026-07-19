export function Field({ label, children }) {
  return (
    <label className="ui-label grid gap-2 text-base">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ as = "input", className = "", ...props }) {
  const Component = as;
  return (
    <Component
      className={`ui-input text-base ${className}`}
      {...props}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      className="ui-input text-base"
      {...props}
    >
      {children}
    </select>
  );
}
