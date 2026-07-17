import { useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { ErrorBoundary, ErrorPage } from "./components/ui/Feedback";
import { pages } from "./data/navigation";
import { useAuth } from "./features/auth/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { HomeworkGeneratorPage } from "./pages/HomeworkGeneratorPage";
import { LessonPlannerPage } from "./pages/LessonPlannerPage";
import { MyResourcesPage } from "./pages/MyResourcesPage";
import { QuizGeneratorPage } from "./pages/QuizGeneratorPage";
import { TopicExplainerPage } from "./pages/TopicExplainerPage";
import { WorksheetGeneratorPage } from "./pages/WorksheetGeneratorPage";
import { LoginPage, RegisterPage } from "./pages/auth/AuthPages";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [authPage, setAuthPage] = useState("login");
  const { isAuthLoading, isAuthenticated, logout, user } = useAuth();
  const page = useMemo(
    () => pages.find((item) => item.id === activePage),
    [activePage],
  );
  const isKnownPage = Boolean(page);

  async function handleLogout() {
    await logout();
    setActivePage("dashboard");
    setAuthPage("login");
  }

  if (isAuthLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-chalk px-4" aria-busy="true" aria-live="polite">
        <div className="w-full max-w-md rounded-lg border border-slateboard/10 bg-white p-6 shadow-soft">
          <p className="sr-only">Loading your secure workspace</p>
          <div className="mb-4 h-4 w-40 rounded-full skeleton" />
          <div className="grid gap-3">
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 rounded-full skeleton" />
            <div className="h-3 w-2/3 rounded-full skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authPage === "register" ? (
      <RegisterPage
        onSwitchToLogin={() => setAuthPage("login")}
        onAuthenticated={() => setActivePage("dashboard")}
      />
    ) : (
      <LoginPage
        onSwitchToRegister={() => setAuthPage("register")}
        onAuthenticated={() => setActivePage("dashboard")}
      />
    );
  }

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage} user={user} onLogout={handleLogout}>
      <ErrorBoundary onReset={() => setActivePage("dashboard")}>
        {!isKnownPage && (
          <ErrorPage
            statusCode="404"
            title="Page not found"
            description="We could not find that page. Return to your dashboard and choose a workspace section."
            onReset={() => setActivePage("dashboard")}
          />
        )}
        {activePage === "dashboard" && <Dashboard onNavigate={setActivePage} />}
        {activePage === "resources" && <MyResourcesPage />}
        {activePage === "worksheet" && <WorksheetGeneratorPage />}
        {activePage === "quiz" && <QuizGeneratorPage />}
        {activePage === "homework" && <HomeworkGeneratorPage />}
        {activePage === "lesson" && <LessonPlannerPage />}
        {activePage === "explainer" && <TopicExplainerPage />}
      </ErrorBoundary>
    </AppShell>
  );
}
