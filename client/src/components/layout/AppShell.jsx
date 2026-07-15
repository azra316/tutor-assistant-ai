import { Bell, Menu, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { pages } from "../../data/navigation";
import { Sidebar } from "./Sidebar";

export function AppShell({ activePage, onNavigate, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const page = useMemo(
    () => pages.find((item) => item.id === activePage) ?? pages[0],
    [activePage],
  );

  function navigate(pageId) {
    onNavigate(pageId);
    setIsOpen(false);
  }

  return (
    <div className="min-h-screen bg-chalk text-ink lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
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

            <div className="hidden h-11 min-w-72 items-center gap-2 rounded-lg border border-slateboard/10 bg-white px-3 text-sm text-slateboard/55 shadow-sm md:flex">
              <Search size={18} aria-hidden="true" />
              <span>Search resources, topics, classes</span>
            </div>

            <button
              className="hidden min-h-11 items-center gap-2 rounded-lg bg-slateboard px-4 text-sm font-bold text-white shadow-soft transition hover:bg-[#0D2930] sm:inline-flex"
              type="button"
            >
              <Sparkles size={17} aria-hidden="true" />
              New resource
            </button>

            <button
              className="grid size-11 place-items-center rounded-lg border border-slateboard/10 bg-white text-slateboard shadow-sm"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>
          </div>
        </header>

        <main className="animate-slide-up px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
