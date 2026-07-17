import { createTopicExplanation } from "../services/topicExplainer.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";
import { logAiError, logAiStep } from "../utils/aiLogger.js";

export async function explainTopic(request, response, next) {
  try {
    logAiStep(request.aiTrace, "controller entered");
    const explanation = addTeacherMetadata(
      await createTopicExplanation(request.validatedBody, request.aiTrace),
      request.user,
    );
    logAiStep(request.aiTrace, "controller generated resource", { title: explanation.title });

    await saveGeneratedResource({
      userId: request.user._id,
      type: "topicExplanation",
      resource: explanation,
    });
    logAiStep(request.aiTrace, "resource saved to MongoDB");

    logAiStep(request.aiTrace, "response sent to frontend", { statusCode: 200 });
    response.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    logAiError(request.aiTrace, "controller caught exception", error);
    next(error);
  }
}
