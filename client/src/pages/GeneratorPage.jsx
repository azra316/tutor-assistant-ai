import { BookOpen, FileText, GraduationCap, Lightbulb, ListChecks, Wand2 } from "lucide-react";
import { Badge, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/Feedback";
import { Field, Select, TextInput } from "../components/ui/FormControls";
import { generatorPresets } from "../data/navigation";

const pageIcons = {
  worksheet: FileText,
  quiz: ListChecks,
  homework: BookOpen,
  lesson: GraduationCap,
  explainer: Lightbulb,
};

const accent = {
  worksheet: "bg-meadow",
  quiz: "bg-coral",
  homework: "bg-honey",
  lesson: "bg-slateboard",
  explainer: "bg-[#4E6E81]",
};

export function GeneratorPage({ page }) {
  const preset = generatorPresets[page.id];
  const Icon = pageIcons[page.id] ?? Wand2;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="grid gap-6">
        <div className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className={`grid size-12 place-items-center rounded-lg text-white ${accent[page.id]}`}>
                  <Icon size={24} aria-hidden="true" />
                </div>
                <Badge tone="blue">{page.eyebrow}</Badge>
              </div>
              <h2 className="text-2xl font-black text-slateboard">{page.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slateboard/65">
                {page.description}
              </p>
            </div>
            <Button variant="secondary">
              <Wand2 size={17} aria-hidden="true" />
              Use template
            </Button>
          </div>
        </div>

        <Card>
          <div className="mb-5">
            <h3 className="text-lg font-black text-slateboard">Resource details</h3>
            <p className="text-sm text-slateboard/60">
              Fill in the essentials before generation. AI connection comes in a later feature.
            </p>
          </div>

          <form className="grid gap-4 md:grid-cols-2">
            {preset.fields.map((field, index) => (
              <Field key={field} label={field}>
                {index === 3 ? (
                  <Select defaultValue="">
                    <option value="" disabled>
                      Choose an option
                    </option>
                    <option>Beginner</option>
                    <option>Approaching grade level</option>
                    <option>On grade level</option>
                    <option>Advanced</option>
                  </Select>
                ) : (
                  <TextInput placeholder={`Enter ${field.toLowerCase()}`} />
                )}
              </Field>
            ))}

            <Field label="Additional instructions">
              <TextInput
                as="textarea"
                rows="5"
                className="md:col-span-2"
                placeholder="Add accommodations, standards, tone, vocabulary, or classroom context."
              />
            </Field>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2">
              <Button type="button">
                <Wand2 size={17} aria-hidden="true" />
                Preview generation
              </Button>
              <Button type="button" variant="secondary">
                Save draft
              </Button>
            </div>
          </form>
        </Card>
      </section>

      <aside className="grid gap-6">
        <Card>
          <h3 className="text-lg font-black text-slateboard">Include options</h3>
          <div className="mt-4 grid gap-3">
            {preset.suggestions.map((suggestion) => (
              <label
                key={suggestion}
                className="flex min-h-12 items-center gap-3 rounded-lg border border-slateboard/10 px-3 text-sm font-bold text-slateboard"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-meadow"
                  defaultChecked={suggestion.length % 2 === 0}
                />
                {suggestion}
              </label>
            ))}
          </div>
        </Card>

        <Card className="bg-skywash">
          <h3 className="text-lg font-black text-slateboard">Output preview</h3>
          <div className="mt-4">
            <EmptyState
              icon={Wand2}
              title="No generated output yet"
              description="Fill the form and create a resource to preview the finished classroom material here."
            />
          </div>
        </Card>
      </aside>
    </div>
  );
}
