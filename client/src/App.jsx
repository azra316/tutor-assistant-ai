import { useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { ErrorBoundary, ErrorPage } from "./components/ui/Feedback";
import { pages } from "./data/navigation";
import { Dashboard } from "./pages/Dashboard";
import { GeneratorPage } from "./pages/GeneratorPage";
import { HomeworkGeneratorPage } from "./pages/HomeworkGeneratorPage";
import { LessonPlannerPage } from "./pages/LessonPlannerPage";
import { QuizGeneratorPage } from "./pages/QuizGeneratorPage";
import { TopicExplainerPage } from "./pages/TopicExplainerPage";
import { WorksheetGeneratorPage } from "./pages/WorksheetGeneratorPage";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const page = useMemo(
    () => pages.find((item) => item.id === activePage),
    [activePage],
  );
  const isKnownPage = Boolean(page);

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      <ErrorBoundary onReset={() => setActivePage("dashboard")}>
        {!isKnownPage && (
          <ErrorPage
            title="Page not found"
            description="That workspace page is not available yet."
            onReset={() => setActivePage("dashboard")}
          />
        )}
        {activePage === "dashboard" && <Dashboard onNavigate={setActivePage} />}
        {activePage === "worksheet" && <WorksheetGeneratorPage />}
        {activePage === "quiz" && <QuizGeneratorPage />}
        {activePage === "homework" && <HomeworkGeneratorPage />}
        {activePage === "lesson" && <LessonPlannerPage />}
        {activePage === "explainer" && <TopicExplainerPage />}
        {isKnownPage &&
          activePage !== "dashboard" &&
          activePage !== "worksheet" &&
          activePage !== "quiz" &&
          activePage !== "homework" &&
          activePage !== "lesson" &&
          activePage !== "explainer" && <GeneratorPage page={page} />}
      </ErrorBoundary>
    </AppShell>
  );
}
