import { requestJson } from "../apiClient";

export async function fetchDashboardStats() {
  const result = await requestJson("/api/dashboard/stats", {}, {
    fallbackMessage: "Unable to load dashboard statistics.",
  });

  if (!result?.success || !result?.data) {
    throw new Error("The dashboard statistics response was not in the expected format.");
  }

  return result.data;
}
