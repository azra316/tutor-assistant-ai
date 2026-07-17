import {
  buildLessonPlanPrompt,
  lessonPlanJsonSchema,
} from "../prompts/lessonPlan.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

export async function createLessonPlan(input, trace) {
  logAiStep(trace, "service entered", { input });
  const result = await generateGeminiJson({
    prompt: buildLessonPlanPrompt(input),
    schema: lessonPlanJsonSchema,
    responseName: "lesson plan",
    emptyResponseMessage: "Gemini returned an empty lesson plan response",
    trace,
  });

  const lessonPlan = parseLessonPlanResponse(result.data, trace);
  logAiStep(trace, "service parsed Gemini response", { title: lessonPlan.title });

  return {
    id: result.id,
    ...lessonPlan,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseLessonPlanResponse(lessonPlan, trace) {
  validateLessonPlanShape(lessonPlan, trace);
  return lessonPlan;
}

function validateLessonPlanShape(lessonPlan, trace) {
  const hasCoreFields =
    lessonPlan?.title &&
    Array.isArray(lessonPlan?.objectives) &&
    Array.isArray(lessonPlan?.activities) &&
    Array.isArray(lessonPlan?.teachingSteps) &&
    lessonPlan?.assessment;

  if (!hasCoreFields) {
    const error = new ApiError(502, "Gemini lesson plan response was missing required fields");
    logAiError(trace, "lesson plan shape validation failed", error, { hasCoreFields });
    throw error;
  }
}
