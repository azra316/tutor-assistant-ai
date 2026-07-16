import { postJson } from "../apiClient";

export async function explainTopic(payload) {
  return postJson("/explain-topic", payload, {
    fallbackMessage: "Unable to explain topic.",
    invalidFormatMessage: "The topic explanation response was not in the expected format.",
  });
}
