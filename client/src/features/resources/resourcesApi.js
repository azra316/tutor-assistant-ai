import { requestJson } from "../apiClient";

export async function fetchResources(params) {
  const query = new URLSearchParams(params);
  const result = await requestJson(`/api/resources?${query.toString()}`, {}, {
    fallbackMessage: "Unable to load resources.",
  });

  if (!result?.success || !result?.data) {
    throw new Error("The resources response was not in the expected format.");
  }

  return result.data;
}

export async function fetchResource(id) {
  const result = await requestJson(`/api/resources/${id}`, {}, {
    fallbackMessage: "Unable to load resource.",
  });

  if (!result?.success || !result?.data) {
    throw new Error("The resource response was not in the expected format.");
  }

  return result.data;
}

export async function updateResource(id, payload) {
  const result = await requestJson(
    `/api/resources/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    { fallbackMessage: "Unable to update resource." },
  );

  if (!result?.success || !result?.data) {
    throw new Error("The updated resource response was not in the expected format.");
  }

  return result.data;
}

export async function deleteResource(id) {
  await requestJson(
    `/api/resources/${id}`,
    { method: "DELETE" },
    { fallbackMessage: "Unable to delete resource." },
  );
}

export async function duplicateResource(id) {
  const result = await requestJson(
    `/api/resources/${id}/duplicate`,
    { method: "POST" },
    { fallbackMessage: "Unable to duplicate resource." },
  );

  if (!result?.success || !result?.data) {
    throw new Error("The duplicated resource response was not in the expected format.");
  }

  return result.data;
}
