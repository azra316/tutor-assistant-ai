import { createHomework } from "../services/homework.service.js";
import {
  addTeacherMetadata,
  recordGeneration,
} from "../services/resourceGeneration.service.js";

export async function generateHomework(request, response, next) {
  try {
    const homework = addTeacherMetadata(await createHomework(request.validatedBody), request.user);

    await recordGeneration({
      userId: request.user._id,
      type: "homework",
      resource: homework,
      request: request.validatedBody,
    });

    response.status(200).json({
      success: true,
      data: homework,
    });
  } catch (error) {
    next(error);
  }
}
