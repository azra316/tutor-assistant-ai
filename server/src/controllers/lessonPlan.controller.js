import { createLessonPlan } from "../services/lessonPlan.service.js";
import {
  addTeacherMetadata,
  recordGeneration,
} from "../services/resourceGeneration.service.js";

export async function generateLessonPlan(request, response, next) {
  try {
    const lessonPlan = addTeacherMetadata(await createLessonPlan(request.validatedBody), request.user);

    await recordGeneration({
      userId: request.user._id,
      type: "lessonPlan",
      resource: lessonPlan,
      request: request.validatedBody,
    });

    response.status(200).json({
      success: true,
      data: lessonPlan,
    });
  } catch (error) {
    next(error);
  }
}
