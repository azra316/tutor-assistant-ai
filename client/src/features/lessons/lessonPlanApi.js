import { postJson } from "../apiClient";

export async function generateLessonPlan(payload) {
  return postJson("/generate-lesson-plan", payload, {
    fallbackMessage: "Unable to generate lesson plan.",
    invalidFormatMessage: "The lesson plan response was not in the expected format.",
  });
}
