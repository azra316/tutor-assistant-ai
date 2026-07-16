import { createQuiz } from "../services/quiz.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";

export async function generateQuiz(request, response, next) {
  try {
    const quiz = addTeacherMetadata(await createQuiz(request.validatedBody), request.user);

    await saveGeneratedResource({
      userId: request.user._id,
      type: "quiz",
      resource: quiz,
    });

    response.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
}
