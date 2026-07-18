export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-meadow text-white shadow-soft hover:bg-meadowHover active:bg-meadowActive",
    secondary:
      "border border-slateboard/15 bg-white text-slateboard hover:bg-skywash",
    ghost: "text-slateboard hover:bg-slateboard/5",
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-base font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
