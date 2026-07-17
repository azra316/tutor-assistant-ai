import { postJson } from "../apiClient";

export async function generateQuiz(payload) {
  return postJson("/generate-quiz", payload, {
    fallbackMessage: "We could not create the quiz. Please try again.",
    invalidFormatMessage: "The quiz was created, but we could not display it correctly. Please try again.",
  });
}
