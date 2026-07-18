import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Badge, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/Feedback";
import { useAuth } from "../features/auth/AuthContext";
import { fetchDashboardStats } from "../features/dashboard/dashboardApi";
import { formatToday } from "../utils/date";

const statCards = [
  {
    key: "totalWorksheets",
    label: "Total Worksheets",
    icon: FileText,
    tone: "bg-meadow text-white",
  },
  {
    key: "totalQuizzes",
    label: "Total Quizzes",
    icon: ClipboardList,
    tone: "bg-coral text-white",
  },
  {
    key: "totalHomework",
    label: "Total Homework",
    icon: BookOpenCheck,
    tone: "bg-honey text-slateboard",
  },
  {
    key: "totalLessonPlans",
    label: "Total Lesson Plans",
    icon: GraduationCap,
    tone: "bg-slateboard text-white",
  },
  {
    key: "totalTopicExplanations",
    label: "Total Topic Explanations",
    icon: HelpCircle,
    tone: "bg-info text-white",
  },
];

const emptyStats = {
  totalWorksheets: 0,
  totalQuizzes: 0,
  totalHomework: 0,
  totalLessonPlans: 0,
  totalTopicExplanations: 0,
};

export function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(emptyStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const totalResources = useMemo(
    () => Object.values(stats).reduce((total, value) => total + Number(value || 0), 0),
    [stats],
  );

  async function loadStats() {
    setIsLoading(true);
    setError("");

    try {
      setStats(await fetchDashboardStats());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="grid gap-6">
      <section className="animate-fade-in overflow-hidden rounded-lg bg-slateboard text-white shadow-soft">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_20rem] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm font-bold text-white/86">
              <Sparkles size={16} aria-hidden="true" />
              Teacher dashboard
            </div>
            <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
              Welcome back, {user?.fullName ?? "Teacher"}.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
              See the teaching materials you have created and quickly start your next classroom resource.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => onNavigate("worksheet")}>Start worksheet</Button>
              <Button variant="secondary" onClick={() => onNavigate("lesson")}>
                Plan lesson
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 text-slateboard">
            <p className="text-sm font-bold text-slateboard/58">Today</p>
            <p className="mt-2 text-xl font-black">{formatToday()}</p>
            <div className="mt-4 rounded-lg bg-skywash p-4">
              <p className="text-sm font-bold text-slateboard/58">Total generated</p>
              <p className="mt-2 text-3xl font-black">{totalResources}</p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <section
          className="flex items-start gap-3 rounded-lg border border-coral/30 bg-coral/10 p-4 text-sm text-slateboard"
          role="alert"
          aria-live="assertive"
        >
          <TriangleAlert className="mt-0.5 shrink-0 text-coral" size={20} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-coral">Could not load dashboard summary</h3>
            <p className="mt-1 leading-6">{error}</p>
          </div>
          <Button type="button" variant="secondary" onClick={loadStats}>
            <RefreshCw size={16} aria-hidden="true" />
            Retry
          </Button>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.key} className="min-h-36">
              <div className={`grid size-11 place-items-center rounded-lg ${stat.tone}`}>
                <Icon size={22} aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm font-bold text-slateboard/58">{stat.label}</p>
              {isLoading ? (
                <div className="mt-3 h-9 w-16 rounded-lg bg-slateboard/10 skeleton" />
              ) : (
                <p className="mt-3 text-3xl font-black text-slateboard">
                  {stats[stat.key] ?? 0}
                </p>
              )}
            </Card>
          );
        })}
      </section>

      {!isLoading && !error && totalResources === 0 && (
        <EmptyState
          icon={FileText}
          title="No generated resources yet"
          description="Create your first worksheet, quiz, homework, lesson plan, or topic explanation to see real counts here."
          action={<Button onClick={() => onNavigate("worksheet")}>Create worksheet</Button>}
        />
      )}
    </div>
  );
}
