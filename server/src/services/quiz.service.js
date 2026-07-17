import { buildQuizPrompt, quizJsonSchema } from "../prompts/quiz.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

const requiredQuestionTypes = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "short_answer",
];

export async function createQuiz(input, trace) {
  logAiStep(trace, "service entered", { input });
  const result = await generateGeminiJson({
    prompt: buildQuizPrompt(input),
    schema: quizJsonSchema,
    responseName: "quiz",
    emptyResponseMessage: "Gemini returned an empty quiz response",
    trace,
  });

  const quiz = parseQuizResponse(result.data, trace);
  logAiStep(trace, "service parsed Gemini response", { title: quiz.title });

  return {
    id: result.id,
    ...quiz,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseQuizResponse(quiz, trace) {
  validateQuizShape(quiz, trace);
  return quiz;
}

function validateQuizShape(quiz, trace) {
  const hasQuestionCount =
    Number.isInteger(quiz?.numberOfQuestions) &&
    Array.isArray(quiz?.questions) &&
    quiz.questions.length === quiz.numberOfQuestions;

  const hasAnswerKey =
    Array.isArray(quiz?.answerKey) && quiz.answerKey.length === quiz.numberOfQuestions;

  const types = new Set(quiz?.questions?.map((question) => question.type));
  const hasAllTypes = requiredQuestionTypes.every((type) => types.has(type));

  const mcqsHaveChoices = quiz?.questions
    ?.filter((question) => question.type === "multiple_choice")
    ?.every((question) => Array.isArray(question.choices) && question.choices.length === 4);

  if (!quiz?.title || !hasQuestionCount || !hasAnswerKey || !hasAllTypes || !mcqsHaveChoices) {
    const error = new ApiError(502, "Gemini quiz response was missing required fields");
    logAiError(trace, "quiz shape validation failed", error, {
      hasTitle: Boolean(quiz?.title),
      hasQuestionCount,
      hasAnswerKey,
      hasAllTypes,
      mcqsHaveChoices,
    });
    throw error;
  }
}
