import { createWorksheet } from "../services/worksheet.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";

export async function generateWorksheet(request, response, next) {
  try {
    logAiStep(request.aiTrace, "controller entered");
    const worksheet = addTeacherMetadata(
      await createWorksheet(request.validatedBody, request.aiTrace),
      request.user,
    );
    logAiStep(request.aiTrace, "controller generated resource", { title: worksheet.title });

    await saveGeneratedResource({
      userId: request.user._id,
      type: "worksheet",
      resource: worksheet,
    });
    logAiStep(request.aiTrace, "resource saved to MongoDB");

    logAiStep(request.aiTrace, "response sent to frontend", { statusCode: 200 });
    response.status(200).json({
      success: true,
      data: worksheet,
    });
  } catch (error) {
    logAiError(request.aiTrace, "controller caught exception", error);
    next(error);
  }
}
