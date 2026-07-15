import { openAiConfig } from "../config/openai.js";
import {
  buildLessonPlanPrompt,
  lessonPlanJsonSchema,
} from "../prompts/lessonPlan.prompt.js";
import { ApiError } from "../utils/ApiError.js";

export async function createLessonPlan(input) {
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
      input: buildLessonPlanPrompt(input),
      text: {
        format: {
          type: "json_schema",
          name: "lesson_plan_generation",
          strict: true,
          schema: lessonPlanJsonSchema,
        },
      },
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.error?.message || "OpenAI was unable to generate the lesson plan";
    throw new ApiError(response.status, message);
  }

  const lessonPlan = parseLessonPlanResponse(result);

  return {
    id: result.id,
    ...lessonPlan,
    generatedBy: "openai",
    model: openAiConfig.model,
    createdAt: new Date().toISOString(),
  };
}

function parseLessonPlanResponse(result) {
  const outputText = extractOutputText(result);

  if (!outputText) {
    throw new ApiError(502, "OpenAI returned an empty lesson plan response");
  }

  try {
    const lessonPlan = JSON.parse(outputText);
    validateLessonPlanShape(lessonPlan);
    return lessonPlan;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, "OpenAI returned invalid lesson plan JSON");
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

function validateLessonPlanShape(lessonPlan) {
  const hasCoreFields =
    lessonPlan?.title &&
    Array.isArray(lessonPlan?.objectives) &&
    Array.isArray(lessonPlan?.activities) &&
    Array.isArray(lessonPlan?.teachingSteps) &&
    lessonPlan?.assessment;

  if (!hasCoreFields) {
    throw new ApiError(502, "OpenAI lesson plan response was missing required fields");
  }
}
