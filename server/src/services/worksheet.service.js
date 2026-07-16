import { buildWorksheetPrompt, worksheetJsonSchema } from "../prompts/worksheet.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

export async function createWorksheet(input) {
  const result = await generateGeminiJson({
    prompt: buildWorksheetPrompt(input),
    schema: worksheetJsonSchema,
    responseName: "worksheet",
    emptyResponseMessage: "Gemini returned an empty worksheet response",
  });

  const worksheet = parseWorksheetResponse(result.data);

  return {
    id: result.id,
    ...worksheet,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseWorksheetResponse(worksheet) {
  validateWorksheetShape(worksheet);
  return worksheet;
}

function validateWorksheetShape(worksheet) {
  const hasQuestionCount =
    Number.isInteger(worksheet?.numberOfQuestions) &&
    Array.isArray(worksheet?.questions) &&
    worksheet.questions.length === worksheet.numberOfQuestions;

  const hasAnswerKey =
    Array.isArray(worksheet?.answerKey) &&
    worksheet.answerKey.length === worksheet.numberOfQuestions;

  if (!worksheet?.title || !hasQuestionCount || !hasAnswerKey) {
    throw new ApiError(502, "Gemini worksheet response was missing required fields");
  }
}
