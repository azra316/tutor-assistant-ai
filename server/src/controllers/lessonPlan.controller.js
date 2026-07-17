import { createLessonPlan } from "../services/lessonPlan.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";

export async function generateLessonPlan(request, response, next) {
  try {
    logAiStep(request.aiTrace, "controller entered");
    const lessonPlan = addTeacherMetadata(
      await createLessonPlan(request.validatedBody, request.aiTrace),
      request.user,
    );
    logAiStep(request.aiTrace, "controller generated resource", { title: lessonPlan.title });

    await saveGeneratedResource({
      userId: request.user._id,
      type: "lessonPlan",
      resource: lessonPlan,
    });
    logAiStep(request.aiTrace, "resource saved to MongoDB");

    logAiStep(request.aiTrace, "response sent to frontend", { statusCode: 200 });
    response.status(200).json({
      success: true,
      data: lessonPlan,
    });
  } catch (error) {
    logAiError(request.aiTrace, "controller caught exception", error);
    next(error);
  }
}
