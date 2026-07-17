import {
  buildTopicExplainerPrompt,
  topicExplainerJsonSchema,
} from "../prompts/topicExplainer.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

export async function createTopicExplanation(input, trace) {
  logAiStep(trace, "service entered", { input });
  const result = await generateGeminiJson({
    prompt: buildTopicExplainerPrompt(input),
    schema: topicExplainerJsonSchema,
    responseName: "topic explanation",
    emptyResponseMessage: "Gemini returned an empty topic explanation response",
    trace,
  });

  const explanation = parseTopicExplanationResponse(result.data, trace);
  logAiStep(trace, "service parsed Gemini response", { title: explanation.title });

  return {
    id: result.id,
    ...explanation,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseTopicExplanationResponse(explanation, trace) {
  validateTopicExplanationShape(explanation, trace);
  return explanation;
}

function validateTopicExplanationShape(explanation, trace) {
  const hasCoreFields =
    explanation?.title &&
    explanation?.simpleExplanation &&
    explanation?.realLifeExample &&
    explanation?.funFact &&
    Array.isArray(explanation?.revisionPoints) &&
    explanation.revisionPoints.length >= 3;

  if (!hasCoreFields) {
    const error = new ApiError(502, "Gemini topic explanation response was missing required fields");
    logAiError(trace, "topic explanation shape validation failed", error, { hasCoreFields });
    throw error;
  }
}
