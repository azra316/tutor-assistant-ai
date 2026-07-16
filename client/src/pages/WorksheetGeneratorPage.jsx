import { useMemo, useState } from "react";
import {
  BookOpenText,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Server,
  FileText,
  Layers3,
  Printer,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Badge, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton, useToast } from "../components/ui/Feedback";
import { Field, Select, TextInput } from "../components/ui/FormControls";
import { useAuth } from "../features/auth/AuthContext";
import { generateWorksheet } from "../features/worksheets/worksheetApi";
import { formatToday } from "../utils/date";

const difficultyOptions = ["Easy", "Medium", "Challenging", "Mixed"];

const questionStyles = {
  Easy: ["Recall", "Fill in the blank", "Quick practice", "Vocabulary"],
  Medium: ["Apply", "Explain", "Compare", "Solve"],
  Challenging: ["Analyze", "Justify", "Create", "Extend"],
  Mixed: ["Warm-up", "Practice", "Challenge", "Reflect"],
};

const starterPrompts = [
  "Show your work clearly.",
  "Use complete sentences where needed.",
  "Check your answer before moving on.",
];

function createQuestions({ topic, subject, difficulty, questionCount }) {
  const labels = questionStyles[difficulty] ?? questionStyles.Mixed;
  const safeTopic = topic.trim() || "the selected topic";
  const safeSubject = subject.trim() || "this subject";
  const safeQuestionCount = Math.min(12, Math.max(1, questionCount || 1));

  return Array.from({ length: safeQuestionCount }, (_, index) => {
    const style = labels[index % labels.length];
    return {
      id: index + 1,
      style,
      title: `${style} question`,
      prompt: `Practice ${safeTopic} in ${safeSubject} with a focused ${style.toLowerCase()} task.`,
    };
  });
}

export function WorksheetGeneratorPage() {
  const [form, setForm] = useState({
    className: "Grade 6",
    subject: "Mathematics",
    topic: "Fractions",
    difficulty: "Medium",
    questionCount: 6,
  });
  const [worksheet, setWorksheet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const { user } = useAuth();

  const questions = useMemo(() => createQuestions(form), [form]);
  const displayedQuestions = worksheet?.questions ?? questions;
  const isGenerated = Boolean(worksheet);
  const teacherName = worksheet?.teacherName ?? user?.fullName ?? "Teacher";
  const generatedDate = worksheet?.generatedDate ?? formatToday();

  function updateField(field, value) {
    const nextValue =
      field === "questionCount" ? Math.min(12, Math.max(1, Number(value) || 1)) : value;

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
    setWorksheet(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const generatedWorksheet = await generateWorksheet({
        class: form.className,
        subject: form.subject,
        topic: form.topic,
        difficulty: form.difficulty,
        numberOfQuestions: form.questionCount,
      });

      setWorksheet(generatedWorksheet);
      showToast({
        title: "Worksheet generated",
        description: `${generatedWorksheet.title} is ready to review.`,
      });
    } catch (requestError) {
      setError(requestError.message);
      showToast({
        title: "Worksheet failed",
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
              <div className="grid size-12 place-items-center rounded-lg bg-meadow text-white">
                <FileText size={24} aria-hidden="true" />
              </div>
              <Badge tone="green">Worksheet studio</Badge>
            </div>
            <h2 className="text-2xl font-black text-slateboard sm:text-3xl">
              Build a polished classroom worksheet.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slateboard/65">
              Choose the class, subject, topic, difficulty, and number of questions. The page sends the request to the Express backend and renders the generated response.
            </p>
          </div>

          <div className="rounded-lg bg-skywash p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-white text-meadow">
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="font-black text-slateboard">
                  {isGenerated ? "Backend response" : "Preview mode"}
                </p>
                <p className="text-sm font-semibold text-slateboard/58">
                  {isGenerated ? "Worksheet loaded" : "Ready to generate"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">
                  {worksheet?.numberOfQuestions ?? form.questionCount}
                </p>
                <p className="text-xs font-bold text-slateboard/55">Questions</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">1</p>
                <p className="text-xs font-bold text-slateboard/55">Page</p>
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
            <h3 className="text-lg font-black text-slateboard">Worksheet inputs</h3>
            <p className="text-sm text-slateboard/60">
              The preview updates instantly as you adjust the details.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Field label="Class">
              <TextInput
                value={form.className}
                onChange={(event) => updateField("className", event.target.value)}
                placeholder="Example: Grade 6"
              />
            </Field>

            <Field label="Subject">
              <TextInput
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                placeholder="Example: Mathematics"
              />
            </Field>

            <Field label="Topic">
              <TextInput
                value={form.topic}
                onChange={(event) => updateField("topic", event.target.value)}
                placeholder="Example: Fractions"
              />
            </Field>

            <Field label="Difficulty">
              <Select
                value={form.difficulty}
                onChange={(event) => updateField("difficulty", event.target.value)}
              >
                {difficultyOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
            </Field>

            <Field label="Number of Questions">
              <TextInput
                type="number"
                min="1"
                max="12"
                value={form.questionCount}
                onChange={(event) => updateField("questionCount", event.target.value)}
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
                <h3 className="font-black text-coral">Could not generate worksheet</h3>
                <p className="mt-1 leading-6">{error}</p>
              </div>
            </section>
          )}

          {isLoading && (
            <section
              className="flex items-center gap-3 rounded-lg border border-meadow/20 bg-meadow/10 p-4 text-sm font-semibold text-slateboard"
              aria-live="polite"
            >
              <Loader2 className="animate-spin text-meadow" size={20} aria-hidden="true" />
              Generating worksheet from the backend...
            </section>
          )}

          {isLoading && <LoadingSkeleton title="Building worksheet cards" lines={5} />}

          {isGenerated && (
            <section
              className="flex items-start gap-3 rounded-lg border border-meadow/20 bg-white p-4 shadow-soft"
              aria-live="polite"
            >
              <Server className="mt-0.5 shrink-0 text-meadow" size={20} aria-hidden="true" />
              <div>
                <h3 className="font-black text-slateboard">Worksheet generated successfully</h3>
                <p className="mt-1 text-sm leading-6 text-slateboard/65">
                  Received response ID <span className="font-bold">{worksheet.id}</span>.
                </p>
              </div>
            </section>
          )}

          <section className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-meadow">
                  Student worksheet
                </p>
                <h3 className="mt-2 text-2xl font-black text-slateboard">
                  {worksheet?.title ?? form.topic ?? "Untitled Topic"}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="blue">{worksheet?.class ?? form.className ?? "Class"}</Badge>
                  <Badge tone="green">{worksheet?.subject ?? form.subject ?? "Subject"}</Badge>
                  <Badge tone="honey">{worksheet?.difficulty ?? form.difficulty}</Badge>
                </div>
              </div>

              <div className="rounded-lg bg-chalk p-4 text-sm font-bold text-slateboard">
                Teacher: {teacherName}
                <br />
                Date: {generatedDate}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {displayedQuestions.map((question) => (
              <article
                key={question.id ?? question.number}
                className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-meadow/35"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-slateboard text-sm font-black text-white">
                      {question.id ?? question.number}
                    </div>
                    <div>
                      <h4 className="font-black text-slateboard">
                        {question.title ?? `Question ${question.number}`}
                      </h4>
                      <p className="text-xs font-bold text-meadow">
                        {question.style ?? question.type}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-meadow" size={20} aria-hidden="true" />
                </div>

                <p className="text-sm leading-6 text-slateboard/70">{question.prompt}</p>

                <div className="mt-5 grid gap-2">
                  <div className="h-10 rounded-lg border border-dashed border-slateboard/20 bg-chalk" />
                  <div className="h-10 rounded-lg border border-dashed border-slateboard/20 bg-chalk" />
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {starterPrompts.map((prompt) => (
              <div
                key={prompt}
                className="flex items-start gap-3 rounded-lg border border-slateboard/10 bg-skywash p-4 text-sm font-semibold text-slateboard"
              >
                <Layers3 className="mt-0.5 text-meadow" size={18} aria-hidden="true" />
                {prompt}
              </div>
            ))}
          </section>

          <Card className="bg-slateboard text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-lg bg-white/10">
                  <BookOpenText size={22} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-black">
                    {worksheet?.answerKey ? "Answer key" : "Answer key placeholder"}
                  </h3>
                  {worksheet?.answerKey ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-white/80">
                      {worksheet.answerKey.map((answer) => (
                        <span key={answer.number} className="rounded-full bg-white/10 px-3 py-1">
                          {answer.number}. {answer.answer}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/68">
                      Submit the form to load the generated answer key from the backend.
                    </p>
                  )}
                </div>
              </div>
              <Badge tone="honey">{worksheet?.generatedBy ?? "OpenAI"}</Badge>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
