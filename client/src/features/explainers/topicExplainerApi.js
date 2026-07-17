import { postJson } from "../apiClient";

export async function explainTopic(payload) {
  return postJson("/explain-topic", payload, {
    fallbackMessage: "We could not create the topic explanation. Please try again.",
    invalidFormatMessage: "The topic explanation was created, but we could not display it correctly. Please try again.",
  });
}
