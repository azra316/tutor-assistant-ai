import { createQuiz } from "../services/quiz.service.js";
import {
  addTeacherMetadata,
  recordGeneration,
} from "../services/resourceGeneration.service.js";

export async function generateQuiz(request, response, next) {
  try {
    const quiz = addTeacherMetadata(await createQuiz(request.validatedBody), request.user);

    await recordGeneration({
      userId: request.user._id,
      type: "quiz",
      resource: quiz,
      request: request.validatedBody,
    });

    response.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
}
