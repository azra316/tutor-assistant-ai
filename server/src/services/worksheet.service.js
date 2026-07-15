import { openAiConfig } from "../config/openai.js";
import { buildWorksheetPrompt, worksheetJsonSchema } from "../prompts/worksheet.prompt.js";
import { ApiError } from "../utils/ApiError.js";

export async function createWorksheet(input) {
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
      input: buildWorksheetPrompt(input),
      text: {
        format: {
          type: "json_schema",
          name: "worksheet_generation",
          strict: true,
          schema: worksheetJsonSchema,
        },
      },
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result?.error?.message || "OpenAI was unable to generate the worksheet";
    throw new ApiError(response.status, message);
  }

  const worksheet = parseWorksheetResponse(result);

  return {
    id: result.id,
    ...worksheet,
    generatedBy: "openai",
    model: openAiConfig.model,
    createdAt: new Date().toISOString(),
  };
}

function parseWorksheetResponse(result) {
  const outputText = extractOutputText(result);

  if (!outputText) {
    throw new ApiError(502, "OpenAI returned an empty worksheet response");
  }

  try {
    const worksheet = JSON.parse(outputText);
    validateWorksheetShape(worksheet);
    return worksheet;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, "OpenAI returned invalid worksheet JSON");
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

function validateWorksheetShape(worksheet) {
  const hasQuestionCount =
    Number.isInteger(worksheet?.numberOfQuestions) &&
    Array.isArray(worksheet?.questions) &&
    worksheet.questions.length === worksheet.numberOfQuestions;

  const hasAnswerKey =
    Array.isArray(worksheet?.answerKey) &&
    worksheet.answerKey.length === worksheet.numberOfQuestions;

  if (!worksheet?.title || !hasQuestionCount || !hasAnswerKey) {
    throw new ApiError(502, "OpenAI worksheet response was missing required fields");
  }
}
