export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "ui-button-primary",
    secondary: "ui-button-secondary",
    ghost: "ui-button-ghost",
  };

  return (
    <button
      className={`ui-button text-base ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
