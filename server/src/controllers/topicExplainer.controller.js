import { createTopicExplanation } from "../services/topicExplainer.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";

export async function explainTopic(request, response, next) {
  try {
    const explanation = addTeacherMetadata(
      await createTopicExplanation(request.validatedBody),
      request.user,
    );

    await saveGeneratedResource({
      userId: request.user._id,
      type: "topicExplanation",
      resource: explanation,
    });

    response.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    next(error);
  }
}
