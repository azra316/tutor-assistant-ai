import { buildWorksheetPrompt, worksheetJsonSchema } from "../prompts/worksheet.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

export async function createWorksheet(input, trace) {
  logAiStep(trace, "service entered", { input });
  const result = await generateGeminiJson({
    prompt: buildWorksheetPrompt(input),
    schema: worksheetJsonSchema,
    responseName: "worksheet",
    emptyResponseMessage: "Gemini returned an empty worksheet response",
    trace,
  });

  const worksheet = parseWorksheetResponse(result.data, trace);
  logAiStep(trace, "service parsed Gemini response", { title: worksheet.title });

  return {
    id: result.id,
    ...worksheet,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseWorksheetResponse(worksheet, trace) {
  validateWorksheetShape(worksheet, trace);
  return worksheet;
}

function validateWorksheetShape(worksheet, trace) {
  const hasQuestionCount =
    Number.isInteger(worksheet?.numberOfQuestions) &&
    Array.isArray(worksheet?.questions) &&
    worksheet.questions.length === worksheet.numberOfQuestions;

  const hasAnswerKey =
    Array.isArray(worksheet?.answerKey) &&
    worksheet.answerKey.length === worksheet.numberOfQuestions;

  if (!worksheet?.title || !hasQuestionCount || !hasAnswerKey) {
    const error = new ApiError(502, "Gemini worksheet response was missing required fields");
    logAiError(trace, "worksheet shape validation failed", error, {
      hasTitle: Boolean(worksheet?.title),
      hasQuestionCount,
      hasAnswerKey,
    });
    throw error;
  }
}
