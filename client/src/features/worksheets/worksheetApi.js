import { postJson } from "../apiClient";

export async function generateWorksheet(payload) {
  return postJson("/generate-worksheet", payload, {
    fallbackMessage: "We could not create the worksheet. Please try again.",
    invalidFormatMessage: "The worksheet was created, but we could not display it correctly. Please try again.",
  });
}
