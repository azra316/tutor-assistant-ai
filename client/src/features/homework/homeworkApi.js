import { postJson } from "../apiClient";

export async function generateHomework(payload) {
  return postJson("/generate-homework", payload, {
    fallbackMessage: "Unable to generate homework.",
    invalidFormatMessage: "The homework response was not in the expected format.",
  });
}
