import { postJson } from "../apiClient";

export async function generateQuiz(payload) {
  return postJson("/generate-quiz", payload, {
    fallbackMessage: "Unable to generate quiz.",
    invalidFormatMessage: "The quiz response was not in the expected format.",
  });
}
