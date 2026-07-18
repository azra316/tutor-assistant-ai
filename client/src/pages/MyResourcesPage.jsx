import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Loader2,
  Printer,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Badge, Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState, useToast } from "../components/ui/Feedback";
import { Field, Select, TextInput } from "../components/ui/FormControls";
import {
  deleteResource,
  duplicateResource,
  fetchResource,
  fetchResources,
  updateResource,
} from "../features/resources/resourcesApi";
import {
  downloadResourcePdf,
  formatResourceForDisplay,
  printResource,
} from "../utils/resourceExport";

const typeOptions = [
  { value: "", label: "All resources" },
  { value: "worksheet", label: "Worksheets" },
  { value: "quiz", label: "Quizzes" },
  { value: "homework", label: "Homework" },
  { value: "lessonPlan", label: "Lesson Plans" },
  { value: "topicExplanation", label: "Topic Explanations" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "updated", label: "Recently updated" },
  { value: "titleAsc", label: "Title A-Z" },
  { value: "titleDesc", label: "Title Z-A" },
];

const typeTone = {
  worksheet: "green",
  quiz: "coral",
  homework: "honey",
  lessonPlan: "blue",
  topicExplanation: "blue",
};

export function MyResourcesPage() {
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ search: "", type: "", sort: "newest", page: 1, limit: 6 });
  const [selectedResource, setSelectedResource] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeAction, setActiveAction] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const activeTypeLabel = useMemo(
    () => typeOptions.find((option) => option.value === filters.type)?.label ?? "All resources",
    [filters.type],
  );

  async function loadResources(nextFilters = filters) {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchResources(nextFilters);
      setResources(data.items);
      setPagination(data.pagination);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadResources(filters);
  }, [filters]);

  function updateFilter(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value,
      page: field === "page" ? value : 1,
    }));
  }

  async function openResource(resource, mode = "view") {
    setIsDetailLoading(true);

    try {
      const detail = await fetchResource(resource.id);
      setSelectedResource(detail);

      if (mode === "edit") {
        setEditingResource(detail);
        setEditTitle(detail.title);
        setEditContent(detail.content ?? {});
      }
    } catch (requestError) {
      showToast({ title: "Could not open resource", description: requestError.message, tone: "error" });
    } finally {
      setIsDetailLoading(false);
    }
  }

  async function handleSaveEdit(event) {
    event.preventDefault();
    setActiveAction("save");

    try {
      const updated = await updateResource(editingResource.id, {
        title: editTitle,
        content: editContent ?? {},
      });
      setSelectedResource(updated);
      setEditingResource(null);
      await loadResources(filters);
      showToast({ title: "Resource updated", description: `${updated.title} was saved.` });
    } catch (saveError) {
      showToast({
        title: "Could not save changes",
        description: saveError.message,
        tone: "error",
      });
    } finally {
      setActiveAction("");
    }
  }

  async function handleDelete(resource) {
    if (!window.confirm(`Delete "${resource.title}"?`)) return;
    setActiveAction(`delete-${resource.id}`);

    try {
      await deleteResource(resource.id);
      setSelectedResource(null);
      await loadResources(filters);
      showToast({ title: "Resource deleted", description: `${resource.title} was removed.` });
    } catch (requestError) {
      showToast({ title: "Could not delete resource", description: requestError.message, tone: "error" });
    } finally {
      setActiveAction("");
    }
  }

  async function handleDuplicate(resource) {
    setActiveAction(`duplicate-${resource.id}`);

    try {
      const duplicated = await duplicateResource(resource.id);
      await loadResources({ ...filters, page: 1 });
      showToast({ title: "Resource duplicated", description: `${duplicated.title} was created.` });
    } catch (requestError) {
      showToast({ title: "Could not duplicate resource", description: requestError.message, tone: "error" });
    } finally {
      setActiveAction("");
    }
  }

  async function withResourceDetail(resource, action) {
    try {
      const detail = resource.content ? resource : await fetchResource(resource.id);
      action(detail);
    } catch (requestError) {
      showToast({ title: "Could not complete action", description: requestError.message, tone: "error" });
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slateboard/10 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Badge tone="blue">My Resources</Badge>
            <h2 className="mt-3 text-2xl font-black text-slateboard">Saved teaching resources</h2>
            <p className="mt-2 text-sm leading-6 text-slateboard/65">
              View, edit, delete, duplicate, print, and download the classroom materials you have created.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(14rem,1fr)_12rem_12rem] xl:min-w-[44rem]">
            <Field label="Search">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 text-slateboard/40" size={18} />
                <TextInput
                  className="w-full pl-10"
                  value={filters.search}
                  onChange={(event) => updateFilter("search", event.target.value)}
                  placeholder="Search by title"
                />
              </div>
            </Field>
            <Field label="Filter">
              <Select value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}>
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Sort">
              <Select value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-slateboard/60">
          {activeTypeLabel} / {pagination.total} saved
        </p>
        <Button type="button" variant="secondary" onClick={() => loadResources(filters)}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {error && (
        <section className="rounded-lg border border-coral/30 bg-coral/10 p-4 text-sm text-coral" role="alert">
          {error}
        </section>
      )}

      {isLoading ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index}>
              <div className="h-4 w-28 rounded-full skeleton" />
              <div className="mt-5 h-7 rounded-full skeleton" />
              <div className="mt-3 h-4 w-2/3 rounded-full skeleton" />
            </Card>
          ))}
        </section>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resources found"
          description="Your saved teaching materials will appear here after you create them."
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="flex min-h-56 flex-col">
              <div className="flex items-start justify-between gap-3">
                <Badge tone={typeTone[resource.type] ?? "green"}>{formatType(resource.type)}</Badge>
                <span className="text-xs font-bold text-slateboard/45">{formatDate(resource.createdAt)}</span>
              </div>
              <h3 className="mt-4 line-clamp-2 text-lg font-black text-slateboard">{resource.title}</h3>
              <p className="mt-2 text-sm text-slateboard/55">Updated {formatDate(resource.updatedAt)}</p>

              <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
                <IconButton label="View" icon={Eye} onClick={() => openResource(resource)} disabled={Boolean(activeAction)} />
                <IconButton label="Edit" icon={Edit3} onClick={() => openResource(resource, "edit")} disabled={Boolean(activeAction)} />
                <IconButton label="Delete" icon={Trash2} onClick={() => handleDelete(resource)} disabled={Boolean(activeAction)} danger />
                <IconButton label="Duplicate" icon={Copy} onClick={() => handleDuplicate(resource)} disabled={Boolean(activeAction)} />
                <IconButton label="Print" icon={Printer} onClick={() => withResourceDetail(resource, printResource)} disabled={Boolean(activeAction)} />
                <IconButton label="PDF" icon={Download} onClick={() => withResourceDetail(resource, downloadResourcePdf)} disabled={Boolean(activeAction)} />
              </div>
            </Card>
          ))}
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slateboard/10 bg-white p-4">
        <p className="text-sm font-bold text-slateboard/60">
          Page {pagination.page} of {pagination.totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={pagination.page <= 1}
            onClick={() => updateFilter("page", pagination.page - 1)}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => updateFilter("page", pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {(selectedResource || isDetailLoading) && (
        <ResourceModal
          resource={selectedResource}
          isLoading={isDetailLoading}
          editingResource={editingResource}
          editTitle={editTitle}
          editContent={editContent}
          setEditTitle={setEditTitle}
          setEditContent={setEditContent}
          onEdit={() => {
            setEditingResource(selectedResource);
            setEditTitle(selectedResource.title);
            setEditContent(selectedResource.content ?? {});
          }}
          onClose={() => {
            setSelectedResource(null);
            setEditingResource(null);
          }}
          onSave={handleSaveEdit}
          isSaving={activeAction === "save"}
          onPrint={() => printResource(selectedResource)}
          onPdf={() => downloadResourcePdf(selectedResource)}
        />
      )}
    </div>
  );
}

function ResourceModal({
  resource,
  isLoading,
  editingResource,
  editTitle,
  editContent,
  setEditTitle,
  setEditContent,
  onEdit,
  onClose,
  onSave,
  isSaving,
  onPrint,
  onPdf,
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slateboard/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resource-dialog-title"
    >
      <section className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <Badge tone={typeTone[resource?.type] ?? "blue"}>
              {resource ? formatType(resource.type) : "Opening"}
            </Badge>
            <h2 id="resource-dialog-title" className="mt-3 text-xl font-black text-slateboard">{resource?.title ?? "Opening resource"}</h2>
          </div>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg hover:bg-slateboard/5"
            aria-label="Close resource dialog"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 rounded-lg bg-skywash p-4 font-bold text-slateboard">
            <Loader2 className="animate-spin" size={20} aria-hidden="true" />
            Opening resource...
          </div>
        ) : editingResource ? (
          <form className="grid gap-4" onSubmit={onSave}>
            <Field label="Title">
              <TextInput value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
            </Field>
            <Field label="Resource details">
              <EditableResourceContent value={editContent ?? {}} onChange={setEditContent} />
              <p className="mt-2 text-xs font-semibold text-slateboard/55">
                Update the wording you want to change, then save.
              </p>
            </Field>
            <div className="flex flex-wrap justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="animate-spin" size={16} aria-hidden="true" />}
                Save changes
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={onEdit}><Edit3 size={16} />Edit</Button>
              <Button type="button" variant="secondary" onClick={onPrint}><Printer size={16} />Print</Button>
              <Button type="button" variant="secondary" onClick={onPdf}><Download size={16} />Download PDF</Button>
            </div>
            <ResourceContentPreview resource={resource} />
          </>
        )}
      </section>
    </div>
  );
}

function EditableResourceContent({ value, onChange }) {
  return (
    <div className="grid max-h-[50vh] gap-3 overflow-auto rounded-lg border border-slateboard/10 bg-chalk p-3">
      {renderEditableFields(value, [], onChange)}
    </div>
  );
}

function renderEditableFields(value, path, onChange) {
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <div key={[...path, index].join(".")} className="grid gap-2 rounded-lg bg-white p-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-slateboard/45">
          Item {index + 1}
        </p>
        {renderEditableFields(item, [...path, index], onChange)}
      </div>
    ));
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([key]) => !["id", "_id", "__v", "createdAt", "updatedAt", "userId", "generatedBy"].includes(key))
      .map(([key, nestedValue]) => (
        <div key={[...path, key].join(".")} className="grid gap-2">
          <span className="text-sm font-black text-slateboard">{formatFieldLabel(key)}</span>
          {nestedValue && typeof nestedValue === "object" ? (
            <div className="grid gap-3 rounded-lg border border-slateboard/10 bg-white p-3">
              {renderEditableFields(nestedValue, [...path, key], onChange)}
            </div>
          ) : (
            <TextInput
              as={String(nestedValue ?? "").length > 80 ? "textarea" : "input"}
              value={nestedValue ?? ""}
              onChange={(event) => onChange((current) => setAtPath(current, [...path, key], event.target.value))}
            />
          )}
        </div>
      ));
  }

  return (
    <TextInput
      as={String(value ?? "").length > 80 ? "textarea" : "input"}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function setAtPath(source, path, nextValue) {
  if (path.length === 0) return nextValue;

  const [key, ...rest] = path;
  const clone = Array.isArray(source) ? [...source] : { ...(source ?? {}) };
  clone[key] = rest.length === 0 ? nextValue : setAtPath(clone[key], rest, nextValue);
  return clone;
}

function formatFieldLabel(value) {
  const labels = {
    answerKey: "Answer Key",
    class: "Class",
    difficulty: "Difficulty",
    estimatedCompletionTime: "Estimated Completion Time",
    funFact: "Fun Fact",
    learningObjective: "Learning Objective",
    numberOfQuestions: "Number of Questions",
    realLifeExample: "Real-Life Example",
    revisionPoints: "Revision Points",
    simpleExplanation: "Simple Explanation",
    studentInstructions: "Student Instructions",
    successCriteria: "Success Criteria",
    teacherAction: "Teacher",
    teacherName: "Teacher",
    teacherNotes: "Teacher Notes",
    teachingSteps: "Teaching Steps",
  };

  return labels[value] ?? String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function ResourceContentPreview({ resource }) {
  return (
    <div className="max-h-[56vh] overflow-auto rounded-lg bg-chalk p-4 text-sm leading-6 text-slateboard">
      {formatResourceForDisplay(resource)
        .split("\n")
        .map((line, index) => (
          <p key={`${line}-${index}`} className={line ? "" : "h-3"}>{line}</p>
        ))}
    </div>
  );
}

function IconButton({ label, icon: Icon, danger = false, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-bold transition ${
        danger
          ? "border-coral/25 text-coral hover:bg-coral/10"
          : "border-slateboard/10 text-slateboard hover:bg-skywash"
      } disabled:cursor-not-allowed disabled:opacity-50`}
      {...props}
    >
      <Icon size={15} aria-hidden="true" />
      {label}
    </button>
  );
}

function formatType(type) {
  const labels = {
    worksheet: "Worksheet",
    quiz: "Quiz",
    homework: "Homework",
    lessonPlan: "Lesson Plan",
    topicExplanation: "Topic Explanation",
  };
  return labels[type] ?? type;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
