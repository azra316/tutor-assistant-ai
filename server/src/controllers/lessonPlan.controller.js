import { createLessonPlan } from "../services/lessonPlan.service.js";
import {
  addTeacherMetadata,
  saveGeneratedResource,
} from "../services/generatedResource.service.js";

export async function generateLessonPlan(request, response, next) {
  try {
    const lessonPlan = addTeacherMetadata(await createLessonPlan(request.validatedBody), request.user);

    await saveGeneratedResource({
      userId: request.user._id,
      type: "lessonPlan",
      resource: lessonPlan,
    });

    response.status(200).json({
      success: true,
      data: lessonPlan,
    });
  } catch (error) {
    next(error);
  }
}
