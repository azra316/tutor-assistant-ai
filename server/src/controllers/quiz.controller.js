import { createQuiz } from "../services/quiz.service.js";

export async function generateQuiz(request, response, next) {
  try {
    const quiz = await createQuiz(request.validatedBody);

    response.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
}
