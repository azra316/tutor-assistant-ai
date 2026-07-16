export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-meadow text-white shadow-soft hover:bg-[#176B57] active:bg-[#115344]",
    secondary:
      "border border-slateboard/15 bg-white text-slateboard hover:bg-skywash dark:bg-[#17313B] dark:text-white dark:hover:bg-[#21434D]",
    ghost: "text-slateboard hover:bg-slateboard/5 dark:text-white dark:hover:bg-white/10",
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
