export function Card({ children, className = "" }) {
  return (
    <section className={`ui-card ${className}`}>
      {children}
    </section>
  );
}

export function Badge({ children, tone = "green" }) {
  const tones = {
    green: "ui-badge-green",
    coral: "ui-badge-coral",
    honey: "ui-badge-honey",
    blue: "ui-badge-blue",
  };

  return (
    <span className={`ui-badge ${tones[tone] ?? tones.green}`}>
      {children}
    </span>
  );
}
