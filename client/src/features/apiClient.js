const DEFAULT_LOCAL_API_BASE_URL = "http://127.0.0.1:5000";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = normalizeApiBaseUrl(
  configuredApiBaseUrl || (import.meta.env.DEV ? DEFAULT_LOCAL_API_BASE_URL : ""),
);

export async function postJson(path, payload, options) {
  const { fallbackMessage, invalidFormatMessage } = options;
  const url = buildApiUrl(path);
  let response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      `Could not connect to the API at ${API_BASE_URL}. Make sure the backend is running and VITE_API_BASE_URL points to the deployed API URL.`,
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.message ?? fallbackMessage;
    const details = Array.isArray(result?.errors) ? result.errors : [];
    throw new Error(details.length > 0 ? `${message}: ${details.join(", ")}` : message);
  }

  if (!result?.success || !result?.data) {
    throw new Error(invalidFormatMessage);
  }

  return result.data;
}

function buildApiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error(
      "API URL is not configured. Set VITE_API_BASE_URL to your backend URL before building the frontend.",
    );
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeApiBaseUrl(value) {
  return value ? value.replace(/\/+$/, "") : "";
}
