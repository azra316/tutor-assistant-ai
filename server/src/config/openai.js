export const openAiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  responsesUrl: "https://api.openai.com/v1/responses",
};
