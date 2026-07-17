import { createHomework } from "../services/homework.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";

export async function generateHomework(request, response, next) {
  try {
    logAiStep(request.aiTrace, "controller entered");
    const homework = addTeacherMetadata(
      await createHomework(request.validatedBody, request.aiTrace),
      request.user,
    );
    logAiStep(request.aiTrace, "controller generated resource", { title: homework.title });

    await saveGeneratedResource({
      userId: request.user._id,
      type: "homework",
      resource: homework,
    });
    logAiStep(request.aiTrace, "resource saved to MongoDB");

    logAiStep(request.aiTrace, "response sent to frontend", { statusCode: 200 });
    response.status(200).json({
      success: true,
      data: homework,
    });
  } catch (error) {
    logAiError(request.aiTrace, "controller caught exception", error);
    next(error);
  }
}
