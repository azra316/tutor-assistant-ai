import { openAiConfig } from "../config/openai.js";
import { buildQuizPrompt, quizJsonSchema } from "../prompts/quiz.prompt.js";
import { ApiError } from "../utils/ApiError.js";

const requiredQuestionTypes = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "short_answer",
];

export async function createQuiz(input) {
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
      input: buildQuizPrompt(input),
      text: {
        format: {
          type: "json_schema",
          name: "quiz_generation",
          strict: true,
          schema: quizJsonSchema,
        },
      },
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.error?.message || "OpenAI was unable to generate the quiz";
    throw new ApiError(response.status, message);
  }

  const quiz = parseQuizResponse(result);

  return {
    id: result.id,
    ...quiz,
    generatedBy: "openai",
    model: openAiConfig.model,
    createdAt: new Date().toISOString(),
  };
}

function parseQuizResponse(result) {
  const outputText = extractOutputText(result);

  if (!outputText) {
    throw new ApiError(502, "OpenAI returned an empty quiz response");
  }

  try {
    const quiz = JSON.parse(outputText);
    validateQuizShape(quiz);
    return quiz;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, "OpenAI returned invalid quiz JSON");
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
    throw new ApiError(502, "OpenAI quiz response was missing required fields");
  }
}
