import {
  buildLessonPlanPrompt,
  lessonPlanJsonSchema,
} from "../prompts/lessonPlan.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

export async function createLessonPlan(input) {
  const result = await generateGeminiJson({
    prompt: buildLessonPlanPrompt(input),
    schema: lessonPlanJsonSchema,
    responseName: "lesson plan",
    emptyResponseMessage: "Gemini returned an empty lesson plan response",
  });

  const lessonPlan = parseLessonPlanResponse(result.data);

  return {
    id: result.id,
    ...lessonPlan,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseLessonPlanResponse(lessonPlan) {
  validateLessonPlanShape(lessonPlan);
  return lessonPlan;
}

function validateLessonPlanShape(lessonPlan) {
  const hasCoreFields =
    lessonPlan?.title &&
    Array.isArray(lessonPlan?.objectives) &&
    Array.isArray(lessonPlan?.activities) &&
    Array.isArray(lessonPlan?.teachingSteps) &&
    lessonPlan?.assessment;

  if (!hasCoreFields) {
    throw new ApiError(502, "Gemini lesson plan response was missing required fields");
  }
}
