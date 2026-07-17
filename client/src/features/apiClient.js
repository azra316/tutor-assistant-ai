const DEFAULT_LOCAL_API_BASE_URL = "http://127.0.0.1:5000";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = normalizeApiBaseUrl(
  configuredApiBaseUrl || (import.meta.env.DEV ? DEFAULT_LOCAL_API_BASE_URL : ""),
);

export async function postJson(path, payload, options = {}) {
  const { fallbackMessage, invalidFormatMessage } = options;
  const result = await requestJson(
    path,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    { fallbackMessage },
  );

  if (!result?.success || !result?.data) {
    throw new Error(toTeacherMessage(invalidFormatMessage));
  }

  return result.data;
}

export async function requestJson(path, fetchOptions = {}, options = {}) {
  const url = buildApiUrl(path);
  let response;

  try {
    response = await fetch(url, {
      credentials: "include",
      ...fetchOptions,
      headers: {
        ...(fetchOptions.headers ?? {}),
      },
    });
  } catch {
    throw new Error("We could not reach Tutor Assistant right now. Please check your connection and try again.");
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.message ?? options.fallbackMessage ?? "Something went wrong. Please try again.";
    const details = Array.isArray(result?.errors) ? result.errors : [];
    throw new Error(toTeacherMessage(details.length > 0 ? `${message}: ${details.join(", ")}` : message));
  }

  return result;
}

function buildApiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error("Tutor Assistant needs a quick setup update. Please contact support if this keeps happening.");
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeApiBaseUrl(value) {
  return value ? value.replace(/\/+$/, "") : "";
}

function toTeacherMessage(message) {
  const text = String(message || "");
  const technicalTerms = [
    "api",
    "backend",
    "server",
    "mongodb",
    "database",
    "json",
    "vite",
    "gemini",
    "openai",
    "model",
    "expected format",
    "configured",
    "internal",
    "stack",
    "resource identifier",
  ];

  if (technicalTerms.some((term) => text.toLowerCase().includes(term))) {
    return "Tutor Assistant had trouble preparing this. Please try again in a moment.";
  }

  return text || "Something went wrong. Please try again.";
}
