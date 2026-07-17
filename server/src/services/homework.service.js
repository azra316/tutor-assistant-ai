import { buildHomeworkPrompt, homeworkJsonSchema } from "../prompts/homework.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

export async function createHomework(input, trace) {
  logAiStep(trace, "service entered", { input });
  const result = await generateGeminiJson({
    prompt: buildHomeworkPrompt(input),
    schema: homeworkJsonSchema,
    responseName: "homework",
    emptyResponseMessage: "Gemini returned an empty homework response",
    trace,
  });

  const homework = parseHomeworkResponse(result.data, trace);
  logAiStep(trace, "service parsed Gemini response", { title: homework.title });

  return {
    id: result.id,
    ...homework,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseHomeworkResponse(homework, trace) {
  validateHomeworkShape(homework, trace);
  return homework;
}

function validateHomeworkShape(homework, trace) {
  const hasCoreFields =
    homework?.title &&
    homework?.learningObjective &&
    homework?.estimatedCompletionTime &&
    Array.isArray(homework?.homework) &&
    homework.homework.length >= 4;

  const hasTeacherNotes =
    Array.isArray(homework?.teacherNotes) && homework.teacherNotes.length >= 2;

  if (!hasCoreFields || !hasTeacherNotes) {
    const error = new ApiError(502, "Gemini homework response was missing required fields");
    logAiError(trace, "homework shape validation failed", error, {
      hasCoreFields,
      hasTeacherNotes,
    });
    throw error;
  }
}
