import { postJson } from "../apiClient";

export async function generateWorksheet(payload) {
  return postJson("/generate-worksheet", payload, {
    fallbackMessage: "Unable to generate worksheet.",
    invalidFormatMessage: "The worksheet response was not in the expected format.",
  });
}
