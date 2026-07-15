const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000";

export async function generateLessonPlan(payload) {
  const response = await fetch(`${API_BASE_URL}/generate-lesson-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.message ?? "Unable to generate lesson plan.";
    const details = Array.isArray(result?.errors) ? result.errors : [];
    throw new Error(details.length > 0 ? `${message}: ${details.join(", ")}` : message);
  }

  if (!result?.success || !result?.data) {
    throw new Error("The lesson plan response was not in the expected format.");
  }

  return result.data;
}
