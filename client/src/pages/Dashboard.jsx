import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import {
  dashboardStats,
  quickActions,
  recentGenerations,
} from "../data/navigation";
import { Badge, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function Dashboard({ onNavigate }) {
  return (
    <div className="grid gap-6">
      <section className="animate-fade-in overflow-hidden rounded-lg bg-slateboard text-white shadow-soft">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm font-bold text-white/86">
              <Sparkles size={16} aria-hidden="true" />
              Planning workspace
            </div>
            <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
              Create classroom-ready materials with calm, focused AI support.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
              Build differentiated worksheets, quizzes, homework, lesson plans, and explainers from one polished teacher dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => onNavigate("worksheet")}>Start worksheet</Button>
              <Button variant="secondary" onClick={() => onNavigate("lesson")}>
                Plan lesson
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 text-slateboard">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-black">Today&apos;s planning block</p>
              <Badge tone="honey">45 min</Badge>
            </div>
            {["Warm-up: fractions review", "Quiz: cell structure", "Homework: thesis statements"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-t border-slateboard/10 py-3 text-sm font-semibold"
                >
                  <CheckCircle2 className="text-meadow" size={18} aria-hidden="true" />
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm font-bold text-slateboard/58">{stat.label}</p>
            <p className="mt-3 text-3xl font-black text-slateboard">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-meadow">{stat.change}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slateboard">Quick actions</h2>
              <p className="text-sm text-slateboard/60">Reusable prompts for common planning tasks.</p>
            </div>
            <Badge tone="blue">Teacher favorites</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                className="flex min-h-20 items-center justify-between rounded-lg border border-slateboard/10 bg-chalk px-4 text-left font-bold text-slateboard transition duration-200 hover:-translate-y-0.5 hover:border-meadow/40 hover:bg-skywash hover:shadow-soft"
              >
                <span>{action}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-black text-slateboard">Recent generations</h2>
          <div className="mt-4 space-y-4">
            {recentGenerations.map((item) => (
              <article key={item.title} className="rounded-lg border border-slateboard/10 p-4 transition duration-200 hover:border-meadow/30 hover:bg-skywash">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Badge tone={item.type === "Quiz" ? "coral" : "green"}>{item.type}</Badge>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slateboard/50">
                    <Clock3 size={14} aria-hidden="true" />
                    {item.time}
                  </span>
                </div>
                <h3 className="font-black text-slateboard">{item.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slateboard/60">
                  <CalendarDays size={15} aria-hidden="true" />
                  {item.className}
                </p>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
