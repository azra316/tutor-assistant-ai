import { createTopicExplanation } from "../services/topicExplainer.service.js";

export async function explainTopic(request, response, next) {
  try {
    const explanation = await createTopicExplanation(request.validatedBody);

    response.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    next(error);
  }
}
