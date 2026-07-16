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
import { downloadResourcePdf, printResource, stringifyResource } from "../utils/resourceExport";

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
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
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
        setEditContent(stringifyResource(detail));
      }
    } catch (requestError) {
      showToast({ title: "Resource failed", description: requestError.message, tone: "error" });
    } finally {
      setIsDetailLoading(false);
    }
  }

  async function handleSaveEdit(event) {
    event.preventDefault();

    try {
      const parsedContent = JSON.parse(editContent);
      const updated = await updateResource(editingResource.id, {
        title: editTitle,
        content: parsedContent,
      });
      setSelectedResource(updated);
      setEditingResource(null);
      await loadResources(filters);
      showToast({ title: "Resource updated", description: `${updated.title} was saved.` });
    } catch (saveError) {
      showToast({ title: "Update failed", description: saveError.message, tone: "error" });
    }
  }

  async function handleDelete(resource) {
    if (!window.confirm(`Delete "${resource.title}"?`)) return;

    try {
      await deleteResource(resource.id);
      setSelectedResource(null);
      await loadResources(filters);
      showToast({ title: "Resource deleted", description: `${resource.title} was removed.` });
    } catch (requestError) {
      showToast({ title: "Delete failed", description: requestError.message, tone: "error" });
    }
  }

  async function handleDuplicate(resource) {
    try {
      const duplicated = await duplicateResource(resource.id);
      await loadResources({ ...filters, page: 1 });
      showToast({ title: "Resource duplicated", description: `${duplicated.title} was created.` });
    } catch (requestError) {
      showToast({ title: "Duplicate failed", description: requestError.message, tone: "error" });
    }
  }

  async function withResourceDetail(resource, action) {
    try {
      const detail = resource.content ? resource : await fetchResource(resource.id);
      action(detail);
    } catch (requestError) {
      showToast({ title: "Action failed", description: requestError.message, tone: "error" });
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
              View, edit, delete, duplicate, print, and export resources saved from your account.
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
          {activeTypeLabel} · {pagination.total} saved
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
          description="Generated resources saved to MongoDB will appear here for the logged-in teacher."
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
                <IconButton label="View" icon={Eye} onClick={() => openResource(resource)} />
                <IconButton label="Edit" icon={Edit3} onClick={() => openResource(resource, "edit")} />
                <IconButton label="Delete" icon={Trash2} onClick={() => handleDelete(resource)} danger />
                <IconButton label="Duplicate" icon={Copy} onClick={() => handleDuplicate(resource)} />
                <IconButton label="Print" icon={Printer} onClick={() => withResourceDetail(resource, printResource)} />
                <IconButton label="PDF" icon={Download} onClick={() => withResourceDetail(resource, downloadResourcePdf)} />
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
            setEditContent(stringifyResource(selectedResource));
          }}
          onClose={() => {
            setSelectedResource(null);
            setEditingResource(null);
          }}
          onSave={handleSaveEdit}
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
  onPrint,
  onPdf,
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slateboard/45 p-4">
      <section className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <Badge tone={typeTone[resource?.type] ?? "blue"}>
              {resource ? formatType(resource.type) : "Loading"}
            </Badge>
            <h2 className="mt-3 text-xl font-black text-slateboard">{resource?.title ?? "Loading resource"}</h2>
          </div>
          <button type="button" className="grid size-10 place-items-center rounded-lg hover:bg-slateboard/5" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 rounded-lg bg-skywash p-4 font-bold text-slateboard">
            <Loader2 className="animate-spin" size={20} aria-hidden="true" />
            Loading resource...
          </div>
        ) : editingResource ? (
          <form className="grid gap-4" onSubmit={onSave}>
            <Field label="Title">
              <TextInput value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
            </Field>
            <Field label="Content JSON">
              <TextInput
                as="textarea"
                className="min-h-80 font-mono"
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
              />
            </Field>
            <div className="flex flex-wrap justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={onEdit}><Edit3 size={16} />Edit</Button>
              <Button type="button" variant="secondary" onClick={onPrint}><Printer size={16} />Print</Button>
              <Button type="button" variant="secondary" onClick={onPdf}><Download size={16} />Download PDF</Button>
            </div>
            <pre className="max-h-[56vh] overflow-auto rounded-lg bg-chalk p-4 text-sm leading-6 text-slateboard">
              {stringifyResource(resource)}
            </pre>
          </>
        )}
      </section>
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
      }`}
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
