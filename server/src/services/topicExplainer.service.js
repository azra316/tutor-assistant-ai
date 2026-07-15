import { openAiConfig } from "../config/openai.js";
import {
  buildTopicExplainerPrompt,
  topicExplainerJsonSchema,
} from "../prompts/topicExplainer.prompt.js";
import { ApiError } from "../utils/ApiError.js";

export async function createTopicExplanation(input) {
  if (!openAiConfig.apiKey) {
    throw new ApiError(500, "OPENAI_API_KEY is not configured");
  }

  const response = await fetch(openAiConfig.responsesUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: openAiConfig.model,
      input: buildTopicExplainerPrompt(input),
      text: {
        format: {
          type: "json_schema",
          name: "topic_explanation",
          strict: true,
          schema: topicExplainerJsonSchema,
        },
      },
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.error?.message || "OpenAI was unable to explain the topic";
    throw new ApiError(response.status, message);
  }

  const explanation = parseTopicExplanationResponse(result);

  return {
    id: result.id,
    ...explanation,
    generatedBy: "openai",
    model: openAiConfig.model,
    createdAt: new Date().toISOString(),
  };
}

function parseTopicExplanationResponse(result) {
  const outputText = extractOutputText(result);

  if (!outputText) {
    throw new ApiError(502, "OpenAI returned an empty topic explanation response");
  }

  try {
    const explanation = JSON.parse(outputText);
    validateTopicExplanationShape(explanation);
    return explanation;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, "OpenAI returned invalid topic explanation JSON");
  }
}

function extractOutputText(result) {
  if (typeof result?.output_text === "string") {
    return result.output_text;
  }

  const contentItems = result?.output
    ?.flatMap((item) => item.content ?? [])
    ?.filter((content) => content.type === "output_text" && typeof content.text === "string");

  return contentItems?.map((content) => content.text).join("").trim();
}

function validateTopicExplanationShape(explanation) {
  const hasCoreFields =
    explanation?.title &&
    explanation?.simpleExplanation &&
    explanation?.realLifeExample &&
    explanation?.funFact &&
    Array.isArray(explanation?.revisionPoints) &&
    explanation.revisionPoints.length >= 3;

  if (!hasCoreFields) {
    throw new ApiError(502, "OpenAI topic explanation response was missing required fields");
  }
}
