export function Card({ children, className = "" }) {
  return (
    <section
      className={`animate-fade-in rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-slateboard/20 dark:bg-[#17313B] dark:text-white ${className}`}
    >
      {children}
    </section>
  );
}

export function Badge({ children, tone = "green" }) {
  const tones = {
    green: "bg-meadow/10 text-meadow",
    coral: "bg-coral/10 text-coral",
    honey: "bg-honey/20 text-[#7A4B04]",
    blue: "bg-skywash text-slateboard dark:bg-white/10 dark:text-white",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}
