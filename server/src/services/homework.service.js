import { openAiConfig } from "../config/openai.js";
import { buildHomeworkPrompt, homeworkJsonSchema } from "../prompts/homework.prompt.js";
import { ApiError } from "../utils/ApiError.js";

export async function createHomework(input) {
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
      input: buildHomeworkPrompt(input),
      text: {
        format: {
          type: "json_schema",
          name: "homework_generation",
          strict: true,
          schema: homeworkJsonSchema,
        },
      },
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.error?.message || "OpenAI was unable to generate the homework";
    throw new ApiError(response.status, message);
  }

  const homework = parseHomeworkResponse(result);

  return {
    id: result.id,
    ...homework,
    generatedBy: "openai",
    model: openAiConfig.model,
    createdAt: new Date().toISOString(),
  };
}

function parseHomeworkResponse(result) {
  const outputText = extractOutputText(result);

  if (!outputText) {
    throw new ApiError(502, "OpenAI returned an empty homework response");
  }

  try {
    const homework = JSON.parse(outputText);
    validateHomeworkShape(homework);
    return homework;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, "OpenAI returned invalid homework JSON");
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

function validateHomeworkShape(homework) {
  const hasCoreFields =
    homework?.title &&
    homework?.learningObjective &&
    homework?.estimatedCompletionTime &&
    Array.isArray(homework?.homework) &&
    homework.homework.length >= 4;

  const hasTeacherNotes =
    Array.isArray(homework?.teacherNotes) && homework.teacherNotes.length >= 2;

  if (!hasCoreFields || !hasTeacherNotes) {
    throw new ApiError(502, "OpenAI homework response was missing required fields");
  }
}
