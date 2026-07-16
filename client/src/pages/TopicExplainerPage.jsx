import { useState } from "react";
import {
  BookOpenText,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Lightbulb,
  Loader2,
  Printer,
  Rocket,
  Server,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Badge, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton, useToast } from "../components/ui/Feedback";
import { Field, TextInput } from "../components/ui/FormControls";
import { useAuth } from "../features/auth/AuthContext";
import { explainTopic } from "../features/explainers/topicExplainerApi";
import { formatToday } from "../utils/date";

function createDraftExplanation({ topic, className }) {
  const safeTopic = topic.trim() || "the selected topic";
  const safeClass = className.trim() || "the selected class";

  return {
    title: `${safeTopic} for Class ${safeClass}`,
    topic: safeTopic,
    class: safeClass,
    simpleExplanation: `${safeTopic} will be explained in simple words that match Class ${safeClass}.`,
    realLifeExample: `A real-life example will connect ${safeTopic} to something students can see or experience.`,
    funFact: `A memorable fact about ${safeTopic} will appear here after generation.`,
    revisionPoints: [
      `Remember the main meaning of ${safeTopic}.`,
      "Connect the idea to a simple example.",
      "Use the key words correctly.",
    ],
  };
}

export function TopicExplainerPage() {
  const [form, setForm] = useState({
    topic: "Photosynthesis",
    className: "5",
  });
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const { user } = useAuth();

  const draftExplanation = createDraftExplanation(form);
  const displayedExplanation = explanation ?? draftExplanation;
  const isGenerated = Boolean(explanation);
  const teacherName = explanation?.teacherName ?? user?.fullName ?? "Teacher";
  const generatedDate = explanation?.generatedDate ?? formatToday();

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setExplanation(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const generatedExplanation = await explainTopic({
        topic: form.topic,
        class: form.className,
      });

      setExplanation(generatedExplanation);
      showToast({
        title: "Topic explained",
        description: `${generatedExplanation.title} is ready for students.`,
      });
    } catch (requestError) {
      setError(requestError.message);
      showToast({
        title: "Explanation failed",
        description: requestError.message,
        tone: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-lg border border-slateboard/10 bg-white shadow-soft">
        <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="grid size-12 place-items-center rounded-lg bg-[#4E6E81] text-white">
                <HelpCircle size={24} aria-hidden="true" />
              </div>
              <Badge tone="blue">Topic explainer</Badge>
            </div>
            <h2 className="text-2xl font-black text-slateboard sm:text-3xl">
              Explain any topic for the selected grade.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slateboard/65">
              Enter a topic and class. The AI returns a simple explanation, real-life example, fun fact, and revision points.
            </p>
          </div>

          <div className="rounded-lg bg-skywash p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-white text-[#4E6E81]">
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="font-black text-slateboard">
                  {isGenerated ? "Backend response" : "Preview mode"}
                </p>
                <p className="text-sm font-semibold text-slateboard/58">
                  {isGenerated ? "Explanation loaded" : "Ready to generate"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">{displayedExplanation.class}</p>
                <p className="text-xs font-bold text-slateboard/55">Class</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">
                  {displayedExplanation.revisionPoints.length}
                </p>
                <p className="text-xs font-bold text-slateboard/55">Revision</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">
                  {isGenerated ? "OK" : "A+"}
                </p>
                <p className="text-xs font-bold text-slateboard/55">
                  {isGenerated ? "Success" : "Ready"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <Card className="h-fit">
          <div className="mb-5">
            <h3 className="text-lg font-black text-slateboard">Explainer inputs</h3>
            <p className="text-sm text-slateboard/60">
              The explanation adapts to the selected class level.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Field label="Topic">
              <TextInput
                value={form.topic}
                onChange={(event) => updateField("topic", event.target.value)}
                placeholder="Example: Photosynthesis"
              />
            </Field>

            <Field label="Class">
              <TextInput
                value={form.className}
                onChange={(event) => updateField("className", event.target.value)}
                placeholder="Example: 5"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" size={17} aria-hidden="true" />
                ) : (
                  <ClipboardCheck size={17} aria-hidden="true" />
                )}
                {isLoading ? "Creating" : "Create"}
              </Button>
              <Button type="button" variant="secondary">
                <Printer size={17} aria-hidden="true" />
                Print
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid gap-5">
          {error && (
            <section
              className="flex items-start gap-3 rounded-lg border border-coral/30 bg-coral/10 p-4 text-sm text-slateboard"
              role="alert"
              aria-live="assertive"
            >
              <TriangleAlert className="mt-0.5 shrink-0 text-coral" size={20} aria-hidden="true" />
              <div>
                <h3 className="font-black text-coral">Could not explain topic</h3>
                <p className="mt-1 leading-6">{error}</p>
              </div>
            </section>
          )}

          {isLoading && (
            <section
              className="flex items-center gap-3 rounded-lg border border-slateboard/20 bg-skywash p-4 text-sm font-semibold text-slateboard"
              aria-live="polite"
            >
              <Loader2 className="animate-spin text-[#4E6E81]" size={20} aria-hidden="true" />
              Generating explanation from the backend...
            </section>
          )}

          {isLoading && <LoadingSkeleton title="Simplifying topic explanation" lines={4} />}

          {isGenerated && (
            <section
              className="flex items-start gap-3 rounded-lg border border-meadow/20 bg-white p-4 shadow-soft"
              aria-live="polite"
            >
              <Server className="mt-0.5 shrink-0 text-meadow" size={20} aria-hidden="true" />
              <div>
                <h3 className="font-black text-slateboard">Topic explained successfully</h3>
                <p className="mt-1 text-sm leading-6 text-slateboard/65">
                  Received response ID <span className="font-bold">{explanation.id}</span>.
                </p>
              </div>
            </section>
          )}

          <section className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4E6E81]">
                  Student explanation
                </p>
                <h3 className="mt-2 text-2xl font-black text-slateboard">
                  {displayedExplanation.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="blue">Class {displayedExplanation.class}</Badge>
                  <Badge tone="green">{displayedExplanation.topic}</Badge>
                </div>
              </div>

              <div className="rounded-lg bg-chalk p-4 text-sm font-bold text-slateboard">
                Teacher: {teacherName}
                <br />
                Date: {generatedDate}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <div className="mb-3 flex items-center gap-3">
                <BookOpenText className="text-[#4E6E81]" size={20} aria-hidden="true" />
                <h3 className="font-black text-slateboard">Simple explanation</h3>
              </div>
              <p className="text-sm leading-6 text-slateboard/70">
                {displayedExplanation.simpleExplanation}
              </p>
            </Card>

            <Card>
              <div className="mb-3 flex items-center gap-3">
                <Rocket className="text-coral" size={20} aria-hidden="true" />
                <h3 className="font-black text-slateboard">Real-life example</h3>
              </div>
              <p className="text-sm leading-6 text-slateboard/70">
                {displayedExplanation.realLifeExample}
              </p>
            </Card>
          </section>

          <Card className="bg-skywash">
            <div className="flex items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-white text-[#7A4B04]">
                <Lightbulb size={22} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-black text-slateboard">Fun fact</h3>
                <p className="mt-2 text-sm leading-6 text-slateboard/70">
                  {displayedExplanation.funFact}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-slateboard text-white">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-lg bg-white/10">
                    <CheckCircle2 size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-black">Revision points</h3>
                    <p className="text-sm text-white/68">
                      Quick points students can review before class or a quiz.
                    </p>
                  </div>
                </div>
                <Badge tone="honey">{displayedExplanation.generatedBy ?? "OpenAI"}</Badge>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                {displayedExplanation.revisionPoints.map((point) => (
                  <div key={point} className="rounded-lg bg-white/10 p-3 text-sm text-white/80">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
