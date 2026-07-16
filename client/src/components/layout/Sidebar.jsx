import { BookMarked, LogOut, PanelLeftClose, Sparkles, UserRound } from "lucide-react";
import { pages } from "../../data/navigation";

export function Sidebar({ activePage, onNavigate, isOpen, onClose, user, onLogout }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slateboard/35 transition lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[86vw] flex-col border-r border-white/10 bg-slateboard text-white shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-20 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg bg-honey text-slateboard">
              <BookMarked size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-base font-black">Tutor Assistant</p>
              <p className="text-xs font-semibold text-white/65">AI classroom studio</p>
            </div>
          </div>
          <button
            className="grid size-10 place-items-center rounded-lg text-white/75 hover:bg-white/10 lg:hidden"
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        <nav className="app-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-3" aria-label="Primary">
          {pages.map((page) => {
            const Icon = page.icon;
            const isActive = page.id === activePage;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => onNavigate(page.id)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold transition duration-200 hover:translate-x-0.5 ${
                  isActive
                    ? "bg-white text-slateboard shadow-soft"
                    : "text-white/78 hover:bg-white/10 hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{page.label}</span>
              </button>
            );
          })}
        </nav>

        {user && (
          <div className="mx-4 rounded-lg bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-white text-slateboard">
                <UserRound size={19} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{user.fullName}</p>
                <p className="truncate text-xs font-semibold text-white/62">{user.email}</p>
              </div>
            </div>
            <button
              className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-white/10 text-sm font-bold text-white transition hover:bg-white/15"
              type="button"
              onClick={onLogout}
            >
              <LogOut size={17} aria-hidden="true" />
              Logout
            </button>
          </div>
        )}

        <div className="m-4 rounded-lg bg-white/10 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <Sparkles size={17} aria-hidden="true" />
            Smart planning tip
          </div>
          <p className="text-sm leading-6 text-white/72">
            Use grade level, topic, and student needs together for stronger classroom outputs.
          </p>
        </div>
      </aside>
    </>
  );
}
