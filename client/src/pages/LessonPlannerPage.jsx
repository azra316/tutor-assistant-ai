import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Layers3,
  ListChecks,
  Loader2,
  Route,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { Badge, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton, useToast } from "../components/ui/Feedback";
import { Field, TextInput } from "../components/ui/FormControls";
import { useAuth } from "../features/auth/AuthContext";
import { generateLessonPlan } from "../features/lessons/lessonPlanApi";
import { formatToday } from "../utils/date";

function createDraftLessonPlan({ topic, duration }) {
  const safeTopic = topic.trim() || "the selected topic";
  const safeDuration = duration.trim() || "45 minutes";

  return {
    objectives: [
      `Identify key ideas related to ${safeTopic}.`,
      `Apply ${safeTopic} through guided classroom practice.`,
    ],
    activities: [
      {
        name: "Warm-up",
        duration: "5 minutes",
        description: `Activate prior knowledge about ${safeTopic}.`,
      },
      {
        name: "Mini lesson",
        duration: "15 minutes",
        description: `Teacher models the core idea behind ${safeTopic}.`,
      },
      {
        name: "Guided practice",
        duration: safeDuration,
        description: "Students practice with teacher support and discussion.",
      },
    ],
    teachingSteps: [
      {
        step: 1,
        teacherAction: "Introduce the lesson goal and connect it to prior learning.",
        studentAction: "Listen, respond, and share what they already know.",
      },
      {
        step: 2,
        teacherAction: "Model the key concept with a clear example.",
        studentAction: "Follow the model and ask clarifying questions.",
      },
      {
        step: 3,
        teacherAction: "Guide students through practice tasks.",
        studentAction: "Complete practice and explain their thinking.",
      },
      {
        step: 4,
        teacherAction: "Check understanding and assign a short exit ticket.",
        studentAction: "Submit a response showing what they learned.",
      },
    ],
    assessment: {
      method: "Exit ticket and teacher observation",
      criteria: ["Accurate use of the main concept", "Clear explanation or example"],
      exitTicket: `Explain one important idea about ${safeTopic}.`,
    },
  };
}

export function LessonPlannerPage() {
  const [form, setForm] = useState({
    topic: "Introduction to Fractions",
    className: "Grade 6",
    duration: "45 minutes",
  });
  const [lessonPlan, setLessonPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const { user } = useAuth();

  const draftLessonPlan = useMemo(() => createDraftLessonPlan(form), [form]);
  const objectives = lessonPlan?.objectives ?? draftLessonPlan.objectives;
  const activities = lessonPlan?.activities ?? draftLessonPlan.activities;
  const teachingSteps = lessonPlan?.teachingSteps ?? draftLessonPlan.teachingSteps;
  const assessment = lessonPlan?.assessment ?? draftLessonPlan.assessment;
  const isGenerated = Boolean(lessonPlan);
  const teacherName = lessonPlan?.teacherName ?? user?.fullName ?? "Teacher";
  const generatedDate = lessonPlan?.generatedDate ?? formatToday();

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setLessonPlan(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const generatedLessonPlan = await generateLessonPlan({
        topic: form.topic,
        class: form.className,
        duration: form.duration,
      });

      setLessonPlan(generatedLessonPlan);
      showToast({
        title: "Lesson plan generated",
        description: `${generatedLessonPlan.title} is ready to teach.`,
      });
    } catch (requestError) {
      setError(requestError.message);
      showToast({
        title: "Lesson plan failed",
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
              <div className="grid size-12 place-items-center rounded-lg bg-slateboard text-white">
                <GraduationCap size={24} aria-hidden="true" />
              </div>
              <Badge tone="blue">Lesson planner</Badge>
            </div>
            <h2 className="text-2xl font-black text-slateboard sm:text-3xl">
              Generate a complete lesson plan.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slateboard/65">
              Enter the topic, class, and duration. Tutor Assistant creates objectives, activities, teaching steps, and assessment.
            </p>
          </div>

          <div className="rounded-lg bg-skywash p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-white text-slateboard">
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="font-black text-slateboard">
                  {isGenerated ? "Ready lesson plan" : "Draft preview"}
                </p>
                <p className="text-sm font-semibold text-slateboard/58">
                  {isGenerated ? "Lesson plan ready" : "Ready to create"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">{objectives.length}</p>
                <p className="text-xs font-bold text-slateboard/55">Objectives</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">{activities.length}</p>
                <p className="text-xs font-bold text-slateboard/55">Activities</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">{lessonPlan?.duration ?? form.duration}</p>
                <p className="text-xs font-bold text-slateboard/55">Duration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <Card className="h-fit">
          <div className="mb-5">
            <h3 className="text-lg font-black text-slateboard">Lesson inputs</h3>
            <p className="text-sm text-slateboard/60">
              Keep the topic focused so the plan fits the class period.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Field label="Topic">
              <TextInput
                value={form.topic}
                onChange={(event) => updateField("topic", event.target.value)}
                placeholder="Example: Introduction to Fractions"
              />
            </Field>

            <Field label="Class">
              <TextInput
                value={form.className}
                onChange={(event) => updateField("className", event.target.value)}
                placeholder="Example: Grade 6"
              />
            </Field>

            <Field label="Duration">
              <TextInput
                value={form.duration}
                onChange={(event) => updateField("duration", event.target.value)}
                placeholder="Example: 45 minutes"
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
                <h3 className="font-black text-coral">Could not generate lesson plan</h3>
                <p className="mt-1 leading-6">{error}</p>
              </div>
            </section>
          )}

          {isLoading && (
            <section
              className="flex items-center gap-3 rounded-lg border border-slateboard/20 bg-skywash p-4 text-sm font-semibold text-slateboard"
              aria-live="polite"
            >
              <Loader2 className="animate-spin text-slateboard" size={20} aria-hidden="true" />
              Creating your lesson plan...
            </section>
          )}

          {isLoading && <LoadingSkeleton title="Sequencing lesson steps" lines={5} />}

          {isGenerated && (
            <section
              className="flex items-start gap-3 rounded-lg border border-meadow/20 bg-white p-4 shadow-soft"
              aria-live="polite"
            >
              <CheckCircle2 className="mt-0.5 shrink-0 text-meadow" size={20} aria-hidden="true" />
              <div>
                <h3 className="font-black text-slateboard">Lesson plan is ready</h3>
                <p className="mt-1 text-sm leading-6 text-slateboard/65">
                  Review the lesson plan below.
                </p>
              </div>
            </section>
          )}

          <section className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-meadow">
                  Teacher lesson plan
                </p>
                <h3 className="mt-2 text-2xl font-black text-slateboard">
                  {lessonPlan?.title ?? `${form.topic || "Untitled Topic"} Lesson Plan`}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="blue">{lessonPlan?.class ?? form.className ?? "Class"}</Badge>
                  <Badge tone="green">{lessonPlan?.topic ?? form.topic ?? "Topic"}</Badge>
                  <Badge tone="honey">{lessonPlan?.duration ?? form.duration ?? "Duration"}</Badge>
                </div>
              </div>

              <div className="rounded-lg bg-chalk p-4 text-sm font-bold text-slateboard">
                Date: {generatedDate}
                <br />
                Teacher: {teacherName}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <div className="mb-3 flex items-center gap-3">
                <Target className="text-meadow" size={20} aria-hidden="true" />
                <h3 className="font-black text-slateboard">Objectives</h3>
              </div>
              <div className="grid gap-2">
                {objectives.map((objective) => (
                  <div key={objective} className="rounded-lg bg-skywash p-3 text-sm font-semibold text-slateboard">
                    {objective}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center gap-3">
                <Clock3 className="text-warningText dark:text-honey" size={20} aria-hidden="true" />
                <h3 className="font-black text-slateboard">Activities</h3>
              </div>
              <div className="grid gap-3">
                {activities.map((activity) => (
                  <div key={activity.name} className="rounded-lg border border-slateboard/10 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-slateboard">{activity.name}</p>
                      <Badge tone="honey">{activity.duration}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slateboard/65">{activity.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid gap-4">
            {teachingSteps.map((step) => (
              <article
                key={step.step}
                className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-meadow/35"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-slateboard text-sm font-black text-white">
                      {step.step}
                    </div>
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Route className="text-meadow" size={18} aria-hidden="true" />
                        <h4 className="font-black text-slateboard">Teaching step</h4>
                      </div>
                      <p className="text-sm leading-6 text-slateboard/70">
                        <span className="font-black text-slateboard">Teacher:</span> {step.teacherAction}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slateboard/70">
                        <span className="font-black text-slateboard">Students:</span> {step.studentAction}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="hidden shrink-0 text-meadow sm:block" size={20} aria-hidden="true" />
                </div>
              </article>
            ))}
          </section>

          <Card className="bg-slateboard text-white">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-lg bg-white/10">
                    <ListChecks size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-black">Assessment</h3>
                    <p className="text-sm text-white/68">{assessment.method}</p>
                  </div>
                </div>
                <Badge tone="honey">{lessonPlan ? "Created for your class" : "Ready when you are"}</Badge>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-white/10 p-3 text-sm">
                  <p className="font-black">Success criteria</p>
                  <ul className="mt-2 grid gap-2 text-white/78">
                    {assessment.criteria.map((criterion) => (
                      <li key={criterion}>{criterion}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-white/10 p-3 text-sm">
                  <p className="font-black">Exit ticket</p>
                  <p className="mt-2 text-white/78">{assessment.exitTicket}</p>
                </div>
              </div>

              {lessonPlan?.materials && (
                <div className="flex flex-wrap gap-2">
                  <Layers3 size={18} aria-hidden="true" />
                  {lessonPlan.materials.map((material) => (
                    <span key={material} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                      {material}
                    </span>
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
