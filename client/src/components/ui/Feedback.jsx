import { AlertTriangle, CheckCircle2, Inbox, Loader2, X } from "lucide-react";
import { Component, createContext, useContext, useMemo, useState } from "react";
import { Button } from "./Button";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function removeToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function showToast({ title, description, tone = "success" }) {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, description, tone }]);
    window.setTimeout(() => removeToast(id), 4200);
  }

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 grid w-[min(24rem,calc(100vw-2rem))] gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-toast-in rounded-lg border bg-white p-4 shadow-soft ${
              toast.tone === "error" ? "border-coral/25" : "border-meadow/25"
            }`}
            role="status"
          >
            <div className="flex items-start gap-3">
              {toast.tone === "error" ? (
                <AlertTriangle className="mt-0.5 shrink-0 text-coral" size={20} />
              ) : (
                <CheckCircle2 className="mt-0.5 shrink-0 text-meadow" size={20} />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-black text-slateboard">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-sm leading-6 text-slateboard/65">{toast.description}</p>
                )}
              </div>
              <button
                className="grid size-8 shrink-0 place-items-center rounded-lg text-slateboard/45 hover:bg-slateboard/5 hover:text-slateboard"
                type="button"
                aria-label="Dismiss notification"
                onClick={() => removeToast(toast.id)}
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}

export function LoadingSkeleton({ title = "Generating content", lines = 4 }) {
  return (
    <section className="animate-fade-in rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-skywash text-slateboard">
          <Loader2 className="animate-spin" size={19} aria-hidden="true" />
        </div>
        <div>
          <p className="font-black text-slateboard">{title}</p>
          <p className="text-sm text-slateboard/55">Building a classroom-ready draft...</p>
        </div>
      </div>
      <div className="grid gap-3">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={`skeleton h-4 rounded-full ${index === lines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </section>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "Create something to see it here.",
  action,
}) {
  return (
    <section className="animate-fade-in rounded-lg border border-dashed border-slateboard/20 bg-white p-6 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-lg bg-skywash text-slateboard">
        <Icon size={23} aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-black text-slateboard">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slateboard/60">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </section>
  );
}

export function ErrorPage({
  title = "Something went wrong",
  description = "The page could not be loaded. Try returning to the dashboard.",
  onReset,
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <section className="max-w-xl rounded-lg border border-coral/20 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto grid size-14 place-items-center rounded-lg bg-coral/10 text-coral">
          <AlertTriangle size={28} aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-black text-slateboard">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slateboard/65">{description}</p>
        {onReset && (
          <Button className="mt-5" type="button" onClick={onReset}>
            Return to dashboard
          </Button>
        )}
      </section>
    </div>
  );
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          description="A UI error interrupted this page. Return to the dashboard and try again."
          onReset={() => {
            this.setState({ hasError: false });
            this.props.onReset?.();
          }}
        />
      );
    }

    return this.props.children;
  }
}
