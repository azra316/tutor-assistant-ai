import { requestJson } from "../apiClient";

export async function fetchResources(params) {
  const query = new URLSearchParams(params);
  const result = await requestJson(`/api/resources?${query.toString()}`, {}, {
    fallbackMessage: "We could not load your saved resources. Please try again.",
  });

  if (!result?.success || !result?.data) {
    throw new Error("We could not load your saved resources. Please try again.");
  }

  return result.data;
}

export async function fetchResource(id) {
  const result = await requestJson(`/api/resources/${id}`, {}, {
    fallbackMessage: "We could not open this resource. Please try again.",
  });

  if (!result?.success || !result?.data) {
    throw new Error("We could not open this resource. Please try again.");
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
    { fallbackMessage: "We could not save your changes. Please try again." },
  );

  if (!result?.success || !result?.data) {
    throw new Error("We could not save your changes. Please try again.");
  }

  return result.data;
}

export async function deleteResource(id) {
  await requestJson(
    `/api/resources/${id}`,
    { method: "DELETE" },
    { fallbackMessage: "We could not delete this resource. Please try again." },
  );
}

export async function duplicateResource(id) {
  const result = await requestJson(
    `/api/resources/${id}/duplicate`,
    { method: "POST" },
    { fallbackMessage: "We could not duplicate this resource. Please try again." },
  );

  if (!result?.success || !result?.data) {
    throw new Error("We could not duplicate this resource. Please try again.");
  }

  return result.data;
}
