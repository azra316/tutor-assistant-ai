import { requestJson } from "../apiClient";

export async function fetchDashboardStats() {
  const result = await requestJson("/api/dashboard/stats", {}, {
    fallbackMessage: "We could not load your dashboard summary. Please try again.",
  });

  if (!result?.success || !result?.data) {
    throw new Error("We could not load your dashboard summary. Please try again.");
  }

  return result.data;
}
