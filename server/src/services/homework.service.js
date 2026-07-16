import { buildHomeworkPrompt, homeworkJsonSchema } from "../prompts/homework.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

export async function createHomework(input) {
  const result = await generateGeminiJson({
    prompt: buildHomeworkPrompt(input),
    schema: homeworkJsonSchema,
    responseName: "homework",
    emptyResponseMessage: "Gemini returned an empty homework response",
  });

  const homework = parseHomeworkResponse(result.data);

  return {
    id: result.id,
    ...homework,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseHomeworkResponse(homework) {
  validateHomeworkShape(homework);
  return homework;
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
    throw new ApiError(502, "Gemini homework response was missing required fields");
  }
}
