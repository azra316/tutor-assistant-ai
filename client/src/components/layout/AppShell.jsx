import { LogOut, Menu, Moon, Sun, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { pages } from "../../data/navigation";
import { useTheme } from "../../features/theme/ThemeContext";
import { Sidebar } from "./Sidebar";

export function AppShell({ activePage, onNavigate, children, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const page = useMemo(
    () => pages.find((item) => item.id === activePage) ?? pages[0],
    [activePage],
  );

  function navigate(pageId) {
    onNavigate(pageId);
    setIsOpen(false);
  }

  return (
    <div className="min-h-screen bg-chalk text-ink transition-colors lg:grid lg:grid-cols-[18rem_1fr]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-honey focus:px-4 focus:py-2 focus:font-bold focus:text-slateboard"
      >
        Skip to main content
      </a>
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slateboard/10 bg-chalk/90 backdrop-blur">
          <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              className="grid size-11 place-items-center rounded-lg border border-slateboard/10 bg-white text-slateboard shadow-sm lg:hidden"
              type="button"
              aria-label="Open navigation"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-meadow">
                {page.eyebrow}
              </p>
              <h1 className="truncate text-xl font-black text-slateboard sm:text-2xl">
                {page.title}
              </h1>
            </div>

            {user && (
              <div className="hidden min-h-11 items-center gap-2 rounded-lg border border-slateboard/10 bg-white px-3 text-sm font-bold text-slateboard shadow-sm sm:flex">
                <UserRound size={18} aria-hidden="true" />
                <span className="max-w-36 truncate">{user.fullName}</span>
              </div>
            )}

            <button
              className="grid size-11 place-items-center rounded-lg border border-slateboard/10 bg-white text-slateboard shadow-sm transition hover:bg-skywash"
              type="button"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDarkMode}
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
            </button>

            <button
              className="grid size-11 place-items-center rounded-lg border border-slateboard/10 bg-white text-coral shadow-sm transition hover:bg-coral/10"
              type="button"
              aria-label="Logout"
              onClick={onLogout}
            >
              <LogOut size={19} />
            </button>
          </div>
        </header>

        <main id="main-content" className="animate-slide-up px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
