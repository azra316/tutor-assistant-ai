import { GraduationCap, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Badge, Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field, TextInput } from "../../components/ui/FormControls";
import { useToast } from "../../components/ui/Feedback";
import { useAuth } from "../../features/auth/AuthContext";

export function LoginPage({ onSwitchToRegister, onAuthenticated }) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await login(form);
      showToast({
        title: "Welcome back",
        description: `Signed in as ${user.fullName}.`,
      });
      onAuthenticated?.();
    } catch (requestError) {
      setError(requestError.message);
      showToast({
        title: "Login failed",
        description: requestError.message,
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout title="Log in to Tutor Assistant AI" subtitle="Continue building classroom-ready resources.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {error && <AuthError message={error} />}
        <Field label="Email">
          <TextInput
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="teacher@example.com"
            required
          />
        </Field>
        <Field label="Password">
          <TextInput
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Enter your password"
            required
          />
        </Field>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" size={17} /> : <LockKeyhole size={17} />}
          {isLoading ? "Logging in" : "Login"}
        </Button>
        <AuthSwitch
          text="New to Tutor Assistant AI?"
          actionText="Create an account"
          onClick={onSwitchToRegister}
        />
      </form>
    </AuthLayout>
  );
}

export function RegisterPage({ onSwitchToLogin, onAuthenticated }) {
  const { register } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await register(form);
      showToast({
        title: "Account created",
        description: `Welcome, ${user.fullName}.`,
      });
      onAuthenticated?.();
    } catch (requestError) {
      setError(requestError.message);
      showToast({
        title: "Registration failed",
        description: requestError.message,
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your teacher account" subtitle="Start generating resources with a secure account.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {error && <AuthError message={error} />}
        <Field label="Full name">
          <TextInput
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            placeholder="Azraa Teacher"
            required
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="teacher@example.com"
            required
          />
        </Field>
        <Field label="Password">
          <TextInput
            type="password"
            minLength="8"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="At least 8 characters"
            required
          />
        </Field>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" size={17} /> : <UserRound size={17} />}
          {isLoading ? "Creating account" : "Register"}
        </Button>
        <AuthSwitch text="Already have an account?" actionText="Login" onClick={onSwitchToLogin} />
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="grid min-h-screen bg-chalk px-4 py-8 text-ink sm:px-6 lg:grid-cols-[minmax(0,1fr)_30rem] lg:px-8">
      <section className="hidden items-center justify-center lg:flex">
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-meadow/10 px-3 py-1.5 text-sm font-black text-meadow">
            <GraduationCap size={17} />
            Tutor Assistant AI
          </div>
          <h1 className="text-5xl font-black leading-tight text-slateboard">
            Secure planning tools for focused teachers.
          </h1>
          <p className="mt-5 text-base leading-7 text-slateboard/65">
            Generate worksheets, quizzes, homework, lesson plans, and explainers from one protected workspace.
          </p>
        </div>
      </section>

      <section className="grid place-items-center">
        <Card className="w-full max-w-md">
          <div className="mb-6">
            <Badge tone="blue">Authentication</Badge>
            <h2 className="mt-4 text-2xl font-black text-slateboard">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slateboard/60">{subtitle}</p>
          </div>
          {children}
        </Card>
      </section>
    </main>
  );
}

function AuthError({ message }) {
  return (
    <div className="rounded-lg border border-coral/25 bg-coral/10 p-3 text-sm font-semibold text-coral">
      {message}
    </div>
  );
}

function AuthSwitch({ text, actionText, onClick }) {
  return (
    <p className="text-center text-sm text-slateboard/60">
      {text}{" "}
      <button className="font-black text-meadow hover:underline" type="button" onClick={onClick}>
        {actionText}
      </button>
    </p>
  );
}
