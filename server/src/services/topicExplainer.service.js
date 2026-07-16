import {
  buildTopicExplainerPrompt,
  topicExplainerJsonSchema,
} from "../prompts/topicExplainer.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

export async function createTopicExplanation(input) {
  const result = await generateGeminiJson({
    prompt: buildTopicExplainerPrompt(input),
    schema: topicExplainerJsonSchema,
    responseName: "topic explanation",
    emptyResponseMessage: "Gemini returned an empty topic explanation response",
  });

  const explanation = parseTopicExplanationResponse(result.data);

  return {
    id: result.id,
    ...explanation,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseTopicExplanationResponse(explanation) {
  validateTopicExplanationShape(explanation);
  return explanation;
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
    throw new ApiError(502, "Gemini topic explanation response was missing required fields");
  }
}
