import { postJson } from "../apiClient";

export async function generateLessonPlan(payload) {
  return postJson("/generate-lesson-plan", payload, {
    fallbackMessage: "We could not create the lesson plan. Please try again.",
    invalidFormatMessage: "The lesson plan was created, but we could not display it correctly. Please try again.",
  });
}
