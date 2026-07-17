import { createQuiz } from "../services/quiz.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";

export async function generateQuiz(request, response, next) {
  try {
    logAiStep(request.aiTrace, "controller entered");
    const quiz = addTeacherMetadata(await createQuiz(request.validatedBody, request.aiTrace), request.user);
    logAiStep(request.aiTrace, "controller generated resource", { title: quiz.title });

    await saveGeneratedResource({
      userId: request.user._id,
      type: "quiz",
      resource: quiz,
    });
    logAiStep(request.aiTrace, "resource saved to MongoDB");

    logAiStep(request.aiTrace, "response sent to frontend", { statusCode: 200 });
    response.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    logAiError(request.aiTrace, "controller caught exception", error);
    next(error);
  }
}
