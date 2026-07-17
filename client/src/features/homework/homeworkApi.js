import { postJson } from "../apiClient";

export async function generateHomework(payload) {
  return postJson("/generate-homework", payload, {
    fallbackMessage: "We could not create the homework. Please try again.",
    invalidFormatMessage: "The homework was created, but we could not display it correctly. Please try again.",
  });
}
