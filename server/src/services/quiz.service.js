import { buildQuizPrompt, quizJsonSchema } from "../prompts/quiz.prompt.js";
import { ApiError } from "../utils/ApiError.js";
import { generateGeminiJson, getGeminiModel } from "../utils/geminiClient.js";

const requiredQuestionTypes = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "short_answer",
];

export async function createQuiz(input) {
  const result = await generateGeminiJson({
    prompt: buildQuizPrompt(input),
    schema: quizJsonSchema,
    responseName: "quiz",
    emptyResponseMessage: "Gemini returned an empty quiz response",
  });

  const quiz = parseQuizResponse(result.data);

  return {
    id: result.id,
    ...quiz,
    generatedBy: "gemini",
    model: getGeminiModel(),
    createdAt: new Date().toISOString(),
  };
}

function parseQuizResponse(quiz) {
  validateQuizShape(quiz);
  return quiz;
}

function validateQuizShape(quiz) {
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
    throw new ApiError(502, "Gemini quiz response was missing required fields");
  }
}
