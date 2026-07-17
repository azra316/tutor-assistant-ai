import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Loader2,
  NotebookTabs,
  Server,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { Badge, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton, useToast } from "../components/ui/Feedback";
import { Field, TextInput } from "../components/ui/FormControls";
import { useAuth } from "../features/auth/AuthContext";
import { generateHomework } from "../features/homework/homeworkApi";
import { formatToday } from "../utils/date";

function createDraftHomework({ topic, subject }) {
  const safeTopic = topic.trim() || "the selected topic";
  const safeSubject = subject.trim() || "this subject";

  return [
    {
      number: 1,
      task: "Review",
      studentInstructions: `Review today's notes about ${safeTopic} in ${safeSubject}.`,
      successCriteria: "Key vocabulary and ideas are highlighted.",
    },
    {
      number: 2,
      task: "Practice",
      studentInstructions: `Complete a short practice activity about ${safeTopic}.`,
      successCriteria: "Work is complete and answers are checked.",
    },
    {
      number: 3,
      task: "Apply",
      studentInstructions: `Use ${safeTopic} in a real classroom-style example.`,
      successCriteria: "The example is clear and connected to the topic.",
    },
    {
      number: 4,
      task: "Reflect",
      studentInstructions: "Write one question you still have and one idea you understand well.",
      successCriteria: "Reflection includes both required parts.",
    },
  ];
}

export function HomeworkGeneratorPage() {
  const [form, setForm] = useState({
    className: "Grade 6",
    subject: "English",
    topic: "Main Idea",
  });
  const [homework, setHomework] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const { user } = useAuth();

  const draftHomework = useMemo(() => createDraftHomework(form), [form]);
  const homeworkItems = homework?.homework ?? draftHomework;
  const isGenerated = Boolean(homework);
  const teacherName = homework?.teacherName ?? user?.fullName ?? "Teacher";
  const generatedDate = homework?.generatedDate ?? formatToday();

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setHomework(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const generatedHomework = await generateHomework({
        class: form.className,
        subject: form.subject,
        topic: form.topic,
      });

      setHomework(generatedHomework);
      showToast({
        title: "Homework generated",
        description: `${generatedHomework.title} is ready to assign.`,
      });
    } catch (requestError) {
      setError(requestError.message);
      showToast({
        title: "Homework failed",
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
              <div className="grid size-12 place-items-center rounded-lg bg-honey text-[#12343B]">
                <BookOpenCheck size={24} aria-hidden="true" />
              </div>
              <Badge tone="honey">Homework studio</Badge>
            </div>
            <h2 className="text-2xl font-black text-slateboard sm:text-3xl">
              Generate thoughtful homework for teachers.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slateboard/65">
              Select the class, subject, and topic. Tutor Assistant creates homework tasks, an estimated completion time, and a learning objective.
            </p>
          </div>

          <div className="rounded-lg bg-skywash p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-white text-[#7A4B04] dark:text-honey">
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="font-black text-slateboard">
                  {isGenerated ? "Ready homework" : "Draft preview"}
                </p>
                <p className="text-sm font-semibold text-slateboard/58">
                  {isGenerated ? "Homework ready" : "Ready to create"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">{homeworkItems.length}</p>
                <p className="text-xs font-bold text-slateboard/55">Tasks</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">
                  {homework?.estimatedCompletionTime ?? "25m"}
                </p>
                <p className="text-xs font-bold text-slateboard/55">Estimate</p>
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
            <h3 className="text-lg font-black text-slateboard">Homework inputs</h3>
            <p className="text-sm text-slateboard/60">
              Keep the prompt simple and classroom-focused.
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
                placeholder="Example: English"
              />
            </Field>

            <Field label="Topic">
              <TextInput
                value={form.topic}
                onChange={(event) => updateField("topic", event.target.value)}
                placeholder="Example: Main Idea"
              />
            </Field>

            <div className="pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" size={17} aria-hidden="true" />
                ) : (
                  <ClipboardCheck size={17} aria-hidden="true" />
                )}
                {isLoading ? "Creating" : "Create"}
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
                <h3 className="font-black text-coral">Could not generate homework</h3>
                <p className="mt-1 leading-6">{error}</p>
              </div>
            </section>
          )}

          {isLoading && (
            <section
              className="flex items-center gap-3 rounded-lg border border-honey/30 bg-honey/20 p-4 text-sm font-semibold text-slateboard"
              aria-live="polite"
            >
              <Loader2 className="animate-spin text-[#7A4B04] dark:text-honey" size={20} aria-hidden="true" />
              Creating your homework...
            </section>
          )}

          {isLoading && <LoadingSkeleton title="Organizing homework tasks" lines={4} />}

          {isGenerated && (
            <section
              className="flex items-start gap-3 rounded-lg border border-meadow/20 bg-white p-4 shadow-soft"
              aria-live="polite"
            >
              <Server className="mt-0.5 shrink-0 text-meadow" size={20} aria-hidden="true" />
              <div>
                <h3 className="font-black text-slateboard">Homework is ready</h3>
                <p className="mt-1 text-sm leading-6 text-slateboard/65">
                  Review the homework below.
                </p>
              </div>
            </section>
          )}

          <section className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7A4B04] dark:text-honey">
                  Student homework
                </p>
                <h3 className="mt-2 text-2xl font-black text-slateboard">
                  {homework?.title ?? `${form.topic || "Untitled Topic"} Homework`}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="blue">{homework?.class ?? form.className ?? "Class"}</Badge>
                  <Badge tone="green">{homework?.subject ?? form.subject ?? "Subject"}</Badge>
                  <Badge tone="honey">{homework?.topic ?? form.topic ?? "Topic"}</Badge>
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
                <Target className="text-meadow" size={20} aria-hidden="true" />
                <h3 className="font-black text-slateboard">Learning objective</h3>
              </div>
              <p className="text-sm leading-6 text-slateboard/70">
                {homework?.learningObjective ??
                  `Students will practice and apply key ideas related to ${form.topic || "the topic"}.`}
              </p>
            </Card>

            <Card>
              <div className="mb-3 flex items-center gap-3">
                <Clock3 className="text-[#7A4B04] dark:text-honey" size={20} aria-hidden="true" />
                <h3 className="font-black text-slateboard">Estimated completion time</h3>
              </div>
              <p className="text-2xl font-black text-slateboard">
                {homework?.estimatedCompletionTime ?? "20-30 minutes"}
              </p>
            </Card>
          </section>

          <section className="grid gap-4">
            {homeworkItems.map((item) => (
              <article
                key={item.number}
                className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-honey/50"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-slateboard text-sm font-black text-white">
                      {item.number}
                    </div>
                    <div>
                      <h4 className="font-black text-slateboard">{item.task}</h4>
                      <p className="mt-1 text-sm leading-6 text-slateboard/70">
                        {item.studentInstructions}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="hidden shrink-0 text-meadow sm:block" size={20} aria-hidden="true" />
                </div>

                <div className="rounded-lg bg-skywash p-3 text-sm font-semibold text-slateboard">
                  Success criteria: {item.successCriteria}
                </div>
              </article>
            ))}
          </section>

          <Card className="bg-slateboard text-white">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-lg bg-white/10">
                    <NotebookTabs size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-black">Teacher notes</h3>
                    <p className="text-sm text-white/68">
                      {homework?.teacherNotes
                        ? "Helpful guidance for assigning and reviewing the homework."
                        : "Create homework to see teacher notes here."}
                    </p>
                  </div>
                </div>
                <Badge tone="honey">{homework ? "Created for your class" : "Ready when you are"}</Badge>
              </div>

              {homework?.teacherNotes && (
                <div className="grid gap-2 md:grid-cols-2">
                  {homework.teacherNotes.map((note) => (
                    <div key={note} className="rounded-lg bg-white/10 p-3 text-sm text-white/80">
                      {note}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
