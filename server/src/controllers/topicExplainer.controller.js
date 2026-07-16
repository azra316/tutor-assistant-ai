import { createTopicExplanation } from "../services/topicExplainer.service.js";
import {
  addTeacherMetadata,
  recordGeneration,
} from "../services/resourceGeneration.service.js";

export async function explainTopic(request, response, next) {
  try {
    const explanation = addTeacherMetadata(
      await createTopicExplanation(request.validatedBody),
      request.user,
    );

    await recordGeneration({
      userId: request.user._id,
      type: "topicExplanation",
      resource: explanation,
      request: request.validatedBody,
    });

    response.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    next(error);
  }
}
