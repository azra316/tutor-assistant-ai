import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  FileQuestion,
  HelpCircle,
  ListChecks,
  Loader2,
  Server,
  Sparkles,
  TextCursorInput,
  ToggleRight,
  TriangleAlert,
} from "lucide-react";
import { Badge, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton, useToast } from "../components/ui/Feedback";
import { Field, Select, TextInput } from "../components/ui/FormControls";
import { useAuth } from "../features/auth/AuthContext";
import { generateQuiz } from "../features/quizzes/quizApi";
import { formatToday } from "../utils/date";

const difficultyOptions = ["Easy", "Medium", "Challenging", "Mixed"];

const questionTypes = {
  multiple_choice: {
    label: "MCQ",
    icon: ListChecks,
    tone: "green",
  },
  true_false: {
    label: "True/False",
    icon: ToggleRight,
    tone: "blue",
  },
  fill_blank: {
    label: "Fill blank",
    icon: TextCursorInput,
    tone: "honey",
  },
  short_answer: {
    label: "Short answer",
    icon: HelpCircle,
    tone: "coral",
  },
};

const draftTypes = ["multiple_choice", "true_false", "fill_blank", "short_answer"];

function createDraftQuestions({ topic, subject, questionCount }) {
  const safeTopic = topic.trim() || "the selected topic";
  const safeSubject = subject.trim() || "this subject";
  const safeQuestionCount = Math.min(12, Math.max(4, questionCount || 4));

  return Array.from({ length: safeQuestionCount }, (_, index) => {
    const type = draftTypes[index % draftTypes.length];

    return {
      number: index + 1,
      type,
      prompt: `Draft ${questionTypes[type].label.toLowerCase()} question about ${safeTopic} in ${safeSubject}.`,
      choices:
        type === "multiple_choice"
          ? ["Option A", "Option B", "Option C", "Option D"]
          : [],
      points: type === "short_answer" ? 3 : 1,
    };
  });
}

export function QuizGeneratorPage() {
  const [form, setForm] = useState({
    className: "Grade 6",
    subject: "Science",
    topic: "Photosynthesis",
    difficulty: "Medium",
    questionCount: 8,
  });
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const { user } = useAuth();

  const draftQuestions = useMemo(() => createDraftQuestions(form), [form]);
  const questions = quiz?.questions ?? draftQuestions;
  const isGenerated = Boolean(quiz);
  const teacherName = quiz?.teacherName ?? user?.fullName ?? "Teacher";
  const generatedDate = quiz?.generatedDate ?? formatToday();

  function updateField(field, value) {
    const nextValue =
      field === "questionCount" ? Math.min(12, Math.max(4, Number(value) || 4)) : value;

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
    setQuiz(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const generatedQuiz = await generateQuiz({
        class: form.className,
        subject: form.subject,
        topic: form.topic,
        difficulty: form.difficulty,
        numberOfQuestions: form.questionCount,
      });

      setQuiz(generatedQuiz);
      showToast({
        title: "Quiz generated",
        description: `${generatedQuiz.title} is ready to review.`,
      });
    } catch (requestError) {
      setError(requestError.message);
      showToast({
        title: "Quiz failed",
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
              <div className="grid size-12 place-items-center rounded-lg bg-coral text-white">
                <ClipboardList size={24} aria-hidden="true" />
              </div>
              <Badge tone="coral">Assessment studio</Badge>
            </div>
            <h2 className="text-2xl font-black text-slateboard sm:text-3xl">
              Build a balanced classroom quiz.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slateboard/65">
              Create MCQs, true/false, fill-in-the-blank, and short-answer questions in one balanced quiz.
            </p>
          </div>

          <div className="rounded-lg bg-skywash p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-white text-coral">
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="font-black text-slateboard">
                  {isGenerated ? "Ready quiz" : "Draft preview"}
                </p>
                <p className="text-sm font-semibold text-slateboard/58">
                  {isGenerated ? "Quiz ready" : "Ready to create"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">
                  {quiz?.numberOfQuestions ?? form.questionCount}
                </p>
                <p className="text-xs font-bold text-slateboard/55">Questions</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-lg font-black text-slateboard">4</p>
                <p className="text-xs font-bold text-slateboard/55">Types</p>
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
            <h3 className="text-lg font-black text-slateboard">Quiz inputs</h3>
            <p className="text-sm text-slateboard/60">
              The generated quiz will include all four question formats.
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
                placeholder="Example: Science"
              />
            </Field>

            <Field label="Topic">
              <TextInput
                value={form.topic}
                onChange={(event) => updateField("topic", event.target.value)}
                placeholder="Example: Photosynthesis"
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
                min="4"
                max="12"
                value={form.questionCount}
                onChange={(event) => updateField("questionCount", event.target.value)}
              />
            </Field>

            <div className="pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" size={17} aria-hidden="true" />
                ) : (
                  <BadgeCheck size={17} aria-hidden="true" />
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
                <h3 className="font-black text-coral">Could not generate quiz</h3>
                <p className="mt-1 leading-6">{error}</p>
              </div>
            </section>
          )}

          {isLoading && (
            <section
              className="flex items-center gap-3 rounded-lg border border-coral/20 bg-coral/10 p-4 text-sm font-semibold text-slateboard"
              aria-live="polite"
            >
              <Loader2 className="animate-spin text-coral" size={20} aria-hidden="true" />
              Creating your quiz...
            </section>
          )}

          {isLoading && <LoadingSkeleton title="Preparing quiz sections" lines={5} />}

          {isGenerated && (
            <section
              className="flex items-start gap-3 rounded-lg border border-meadow/20 bg-white p-4 shadow-soft"
              aria-live="polite"
            >
              <Server className="mt-0.5 shrink-0 text-meadow" size={20} aria-hidden="true" />
              <div>
                <h3 className="font-black text-slateboard">Quiz is ready</h3>
                <p className="mt-1 text-sm leading-6 text-slateboard/65">
                  Review the quiz below.
                </p>
              </div>
            </section>
          )}

          <section className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">
                  Student quiz
                </p>
                <h3 className="mt-2 text-2xl font-black text-slateboard">
                  {quiz?.title ?? `${form.topic || "Untitled Topic"} Quiz`}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="blue">{quiz?.class ?? form.className ?? "Class"}</Badge>
                  <Badge tone="green">{quiz?.subject ?? form.subject ?? "Subject"}</Badge>
                  <Badge tone="honey">{quiz?.difficulty ?? form.difficulty}</Badge>
                </div>
              </div>

              <div className="rounded-lg bg-chalk p-4 text-sm font-bold text-slateboard">
                Teacher: {teacherName}
                <br />
                Date: {generatedDate}
                <br />
                Score: ______ / ______
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {questions.map((question) => {
              const type = questionTypes[question.type] ?? questionTypes.short_answer;
              const Icon = type.icon;

              return (
                <article
                  key={question.number}
                  className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-coral/35"
                >
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-slateboard text-sm font-black text-white">
                        {question.number}
                      </div>
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Icon className="text-coral" size={18} aria-hidden="true" />
                          <Badge tone={type.tone}>{type.label}</Badge>
                          <span className="text-xs font-bold text-slateboard/50">
                            {question.points} {question.points === 1 ? "point" : "points"}
                          </span>
                        </div>
                        <p className="text-sm leading-6 text-slateboard/75">{question.prompt}</p>
                      </div>
                    </div>
                    <CheckCircle2 className="hidden shrink-0 text-meadow sm:block" size={20} aria-hidden="true" />
                  </div>

                  {question.choices?.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {question.choices.map((choice, index) => (
                        <div
                          key={choice}
                          className="rounded-lg border border-slateboard/10 bg-chalk px-3 py-2 text-sm font-semibold text-slateboard"
                        >
                          {String.fromCharCode(65 + index)}. {choice}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 h-12 rounded-lg border border-dashed border-slateboard/20 bg-chalk" />
                  )}
                </article>
              );
            })}
          </section>

          <Card className="bg-slateboard text-white">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-lg bg-white/10">
                    <FileQuestion size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-black">Answer key</h3>
                    <p className="text-sm text-white/68">
                      {quiz?.answerKey
                        ? "Generated answers with short explanations."
                        : "Create a quiz to see the answer key here."}
                    </p>
                  </div>
                </div>
                <Badge tone="honey">{quiz ? "Created for your class" : "Ready when you are"}</Badge>
              </div>

              {quiz?.answerKey && (
                <div className="grid gap-2 md:grid-cols-2">
                  {quiz.answerKey.map((answer) => (
                    <div key={answer.number} className="rounded-lg bg-white/10 p-3 text-sm">
                      <p className="font-black">
                        {answer.number}. {answer.answer}
                      </p>
                      <p className="mt-1 text-white/68">{answer.explanation}</p>
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
